using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BE.DTOs;
using BE.Models;
using BE.Repositories;
using BE.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthenticationController : ControllerBase {
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IEmailSender _emailSender;

    public AuthenticationController(
        UserManager<ApplicationUser> userManager, 
        IConfiguration configuration,
        IRefreshTokenRepository refreshTokenRepository,
        IEmailSender emailSender
    )
    {
        _userManager = userManager;
        _configuration = configuration;
        _refreshTokenRepository = refreshTokenRepository;
        _emailSender = emailSender;
    }

    [HttpPost]
    [Route("Register")]
    public async Task<IActionResult> Register(UserDTO userDTO) {
        if (ModelState.IsValid) {
            // Check if email already exist
            var user_exist = await _userManager.FindByEmailAsync(userDTO.Email);

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
            IdentityResult result = await _userManager.CreateAsync(newUser, userDTO.Password);

            // Verify email
            if (result.Succeeded == true) {
                var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);

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

        var user = await _userManager.FindByIdAsync(userId);

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

        var result = await _userManager.ConfirmEmailAsync(user, code);
        
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
            var user = await _userManager.FindByEmailAsync(userLogin.Email);

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
            var checkPassword = await _userManager.CheckPasswordAsync(user, userLogin.Password);

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
            Token = GenerateRandomString(24),           // generate a new refresh token
            AddedDate = DateTime.UtcNow,
            ExpiryDate = DateTime.UtcNow.AddMonths(1),
            IsRevoked = false,
            IsUsed = false,
            UserId = user.Id
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

    private string GenerateRandomString(int length) {
        var random = new Random();
        var chars = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwertyuiopasdfghjklzxcvbnm_";

        return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
    }

}