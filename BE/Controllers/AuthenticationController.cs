using System.IdentityModel.Tokens.Jwt;
using BE.DTOs;
using BE.Models;
using BE.Repositories;
using BE.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using BE.Helper;
using System.Text;
using System.Security.Claims;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthenticationController : ControllerBase {
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly IRefreshTokenRepository _refreshTokenRepository; 
    private readonly IEmailSender _emailSender;
    private readonly TokenValidationParameters _tokenValidationParameters;

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;

    public AuthenticationController(
        IUserRepository userRepository,
        IConfiguration configuration,
        IRefreshTokenRepository refreshTokenRepository,
        IEmailSender emailSender,
        TokenValidationParameters tokenValidationParameters,
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager
    )
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _refreshTokenRepository = refreshTokenRepository;
        _emailSender = emailSender;
        _tokenValidationParameters = tokenValidationParameters;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [HttpPost]
    [Route("AdminRegister")]
    public async Task<IActionResult> AdminRegister(UserDTO userDTO) {
        // Create new user
        ApplicationUser user = new ApplicationUser() {
            UserName = userDTO.Name,
        };

        var result = await _userManager.CreateAsync(user, userDTO.Password);

        if (result.Succeeded) {
            var adminRole = await _roleManager.RoleExistsAsync("Admin");
            if (!adminRole) {
                await _roleManager.CreateAsync(new ApplicationRole("Admin"));
            }
            
            await _userManager.AddToRoleAsync(user, "Admin");

            return Ok(user);
        }

        return NotFound();
    }

    [HttpPost]
    [Route("Register")]
    public async Task<IActionResult> Register(UserDTO userDTO) {
        if (ModelState.IsValid) {
            // Check if email already exist
            var user_exist = await _userRepository.GetUserByEmailAsync(userDTO.Email);

            if (user_exist != null) {
                return BadRequest(new AuthResult() {
                    Result = false,
                    Errors = new List<string>() {
                        "Email already exist !"
                    }
                });
            }

            // Create new user
            ApplicationUser newUser = new ApplicationUser() {
                Email = userDTO.Email,
                UserName = userDTO.Name,
                EmailConfirmed = false
            };

            // IdentityResult
            IdentityResult result = await _userRepository.CreateUserAsync(newUser, userDTO.Password);

            // Verify email
            if (result.Succeeded == true) {
                var emailToken = await _userRepository.GenerateEmailConfirmationTokenAsync(newUser);

                var emailBody = $"Please confirm your email address by click here: #URL# ";

                // (http / https -- Scheme) + `://` + (localhost:5281 -- Host)
                var callbackUrl = Request.Scheme + "://" + Request.Host + 
                                    Url.Action("ConfirmEmail", "Authentication", 
                                                new {userId = newUser.Id, code = emailToken}); 

                // Thay thế link vào chuỗi string
                var body = emailBody.Replace("#URL#", callbackUrl);

                // Topic of mail
                var subject = "Verify email";

                try {
                     // email receiver - Subject (chủ đề) - Content (nội dung mail)
                    await _emailSender.SendEmailAsync(newUser.Email, subject, body);

                    return Ok("Send email successfully");
                }
                catch {
                    return BadRequest(new AuthResult() {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Verify Email ERROR!"
                        }
                    });
                }
            }
        }

        return BadRequest();
    }

    [HttpGet]
    [Route("ConfirmEmail")]
    public async Task<IActionResult> ConfirmEmail(string userId, string code) {
        if (userId == null || code == null) {
            return BadRequest(new AuthResult() 
            {
                Result = false,
                Errors = new List<string>()
                {
                    "Invalid email confirmation url"
                }
            });
        }

        var user = await _userRepository.GetUserByIdAsync(userId);

        // invalid user
        if (user == null) {
            return BadRequest(new AuthResult() {
                Result = false,
                Errors = new List<string>()
                {
                    "Invalid user",
                }
            });
        }

        var result = await _userRepository.ConfirmEmailAsync(user, code);
        
        if (result.Succeeded == false) {
            return BadRequest(new AuthResult() {
                Result = false,
                Errors = new List<string>()
                {
                    "Your email is not confirmed, please try again later !"
                }
            });
        }

        return Ok(result);
    }

    [HttpPost]
    [Route("Login")]
    public async Task<IActionResult> Login(UserDTO userLogin) {
        if (ModelState.IsValid) {
            // Check if user is existed
            var user = await _userRepository.GetUserByEmailAsync(userLogin.Email);

            if (user == null) {
                return BadRequest(new AuthResult() {
                    Result = false,
                    Errors = new List<string>() {
                        "User isn't existed !"
                    }
                });
            }

            // Check email confirmed
            if (user.EmailConfirmed == false) {
                return BadRequest(new AuthResult() {
                    Result = false,
                    Errors = new List<string>() {
                        "Email haven't been confirmed yet!"
                    }
                });
            }

            // Validate password
            var checkPassword = await _userRepository.CheckPasswordAsync(user, userLogin.Password);

            if (checkPassword == false) {
                return BadRequest(new AuthResult() {
                    Result = false,
                    Errors = new List<string>() {
                        "INVALID Credentials !"
                    }
                });
            }

            // Create access token & refresh token
            var jwtToken = await generateJwtToken(user);

            return Ok(jwtToken);
        }

        return BadRequest(new AuthResult() {
            Result = false,
            Errors = new List<string>() {
                "INVALID Payload !"
            }
        });
    }

    [HttpPost]
    [Route("RefreshToken")]
    public async Task<IActionResult> RefreshToken(TokenRequestDTO tokenRequest) {
        if (ModelState.IsValid) {
            var result = await VerifyAndGenerateToken(tokenRequest);

            if (result == null) {
                return BadRequest(new AuthResult() {
                    Result = false,
                    Errors = new List<string>() {
                        "Invalid tokens"
                    }
                });
            }

            return Ok(result);
        }

        return BadRequest(new AuthResult() {
            Result = false,
            Errors = new List<string>() {
                "Invalid parameters"
            }
        });
    }

    private async Task<AuthResult> VerifyAndGenerateToken(TokenRequestDTO tokenRequest) {
        var jwtTokenHanlder = new JwtSecurityTokenHandler();

        try {
            // Xác thực access token -> Trả về ClaimsPrinciple
            var tokenInVerification = jwtTokenHanlder.ValidateToken
                    (tokenRequest.Token, _tokenValidationParameters, out var validatedToken);
            
            // Kiểm tra xem validatedToken có phải là một JwtSecurityToken hay không. 
            // Nếu đúng, nó sẽ được gán cho biến jwtSecurityToken
            if (validatedToken is JwtSecurityToken jwtSecurityToken) {
                // Kiểm tra xem token có được mã hóa bằng HMACSHA256 không
                var result = jwtSecurityToken.Header
                                            .Alg
                                            .Equals(SecurityAlgorithms.HmacSha256,
                                                    StringComparison.InvariantCultureIgnoreCase);
                
                if (result == false) {
                    return null;
                }
            }

            return new AuthResult() {
                Result = false,
                Errors = new List<string>() {
                    "Access token is valid"
                }
            };
        }
        // Access token has expired -> Validate refresh token
        catch (SecurityTokenExpiredException) {
            try {
                var storedToken = await _refreshTokenRepository.GetByToken(tokenRequest.RefreshToken);

                // Kiểm tra token có tồn tại trong DB không
                if (storedToken == null) {
                    return new AuthResult() {
                        Result = false,
                        Errors = new List<string>() {
                            "Invalid tokens"
                        }
                    };
                }

                // Kiểm tra refresh token có thuộc access token được request không
                var accessTokenJti = jwtTokenHanlder.ReadJwtToken(tokenRequest.Token)
                                                    .Claims
                                                    .FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?
                                                    .Value;
                
                if (storedToken.JwtId != accessTokenJti) {
                    return new AuthResult() {
                        Result = false,
                        Errors = new List<string>() {
                            "Invalid tokens"
                        }
                    };
                }

                // Kiểm tra token đã được sử dụng chưa
                if (storedToken.IsUsed) {
                    return new AuthResult() {
                        Result = false,
                        Errors = new List<string>() {
                            "Tokens has been used" 
                        }
                    };
                }

                // Token có bị thu hồi không
                if (storedToken.IsRevoked) {
                    return new AuthResult() {
                        Result = false,
                        Errors = new List<string>() {
                            "Token has been revoked"
                        }
                    };
                }

                // Kiểm tra token hết hạn chưa
                if (storedToken.ExpiryDate < DateTime.UtcNow) {
                    return new AuthResult() {
                        Result = false,
                        Errors = new List<string>() {
                            "Expired refresh tokens"
                        }
                    };
                }

                // Cập nhật token đã được sử dụng 
                var isUsed = true;
                await _refreshTokenRepository.Update(storedToken.Id, isUsed);

                // Trả về cặp access - refresh token mới
                var dbUser = await _userRepository.GetUserByIdAsync(storedToken.UserId.ToString());
                var result = await generateJwtToken(dbUser);

                return result;
            }
            catch {
                return null;
            }
        }
        catch (Exception ex) {
            return new AuthResult() {
                Result = false,
                Errors = new List<string>() {
                    ex.Message
                }
            };
        }
    } 

    private async Task<AuthResult> generateJwtToken(ApplicationUser user) {
        // thằng xử lý và generate ra token
        var jwtTokenHanlder = new JwtSecurityTokenHandler();

        var key = Encoding.UTF8.GetBytes(_configuration.GetSection("JwtConfig:Secret").Value);

        // Token description
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            // Khai báo claims
            Subject = new ClaimsIdentity(new []
            {
                new Claim("Id", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),

                // JWT ID
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

                // Issued At Time - Chứa thời điểm Token được tạo
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUniversalTime().ToString())
            }),
            
            Expires = DateTime.UtcNow
                        .Add(TimeSpan.Parse(_configuration.GetSection("JwtConfig:ExpiryTimeFrame").Value)),

            // SymmetricSecurityKey - khóa đối xứng
            // mã hóa bằng thuật toán HMAC-SHA256
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            
        };

        var token = jwtTokenHanlder.CreateToken(tokenDescriptor);
        var jwtToken = jwtTokenHanlder.WriteToken(token);

        var refreshToken = new RefreshToken() {
            JwtId = token.Id,
            Token = Utilities.GenerateRandomString(24),           // generate a new refresh token
            AddedDate = DateTime.UtcNow,
            ExpiryDate = DateTime.UtcNow.AddMonths(1),
            IsRevoked = false,
            IsUsed = false,
            UserId = user.Id.ToString()
        };
        
        // add refresh token to mongoDB
        await _refreshTokenRepository.Create(refreshToken);

        var result = new AuthResult() {
            Result = true,
            RefreshToken = refreshToken.Token,
            Token = jwtToken
        };

        return result;
    }
}