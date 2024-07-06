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
using Microsoft.AspNetCore.Authorization;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthenticationController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IEmailSender _emailSender;
    private readonly TokenValidationParameters _tokenValidationParameters;

    public AuthenticationController(
        IUserRepository userRepository,
        IConfiguration configuration,
        IRefreshTokenRepository refreshTokenRepository,
        IEmailSender emailSender,
        TokenValidationParameters tokenValidationParameters
    )
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _refreshTokenRepository = refreshTokenRepository;
        _emailSender = emailSender;
        _tokenValidationParameters = tokenValidationParameters;
    }

    [HttpPost]
    [Route("AdminRegister")]
    public async Task<IActionResult> AdminRegister(UserDTO userDTO)
    {
        if (userDTO.Name == null || userDTO.Email == null)
        {
            return BadRequest(new AuthResult()
            {
                Result = false,
                Errors = new List<string>() {
                    "Lack Of Information !"
                }
            });
        }

        // Create new user
        ApplicationUser user = new ApplicationUser()
        {
            UserName = userDTO.Name.ToLower(),
            Email = userDTO.Email
        };

        var result = await _userRepository.CreateUserAsync(user, userDTO.Password);

        if (result.Succeeded)
        {
            // Add ADMIN role
            var adminRole = await _userRepository.RoleExistsAsync("Admin");

            if (!adminRole)
            {
                await _userRepository.CreateRoleAsync(new ApplicationRole("Admin"));
            }

            await _userRepository.AddRoleToUserAsync(user, "Admin");

            // Verify email
            var emailToken = await _userRepository.GenerateEmailConfirmationTokenAsync(user);

            var emailBody = $"Please confirm your email address by click here: #URL# ";

            // (http / https -- Scheme) + `://` + (localhost:5281 -- Host)
            var callbackUrl = Request.Scheme + "://" + Request.Host +
                                Url.Action("ConfirmEmail", "Authentication",
                                            new { userId = user.Id, code = emailToken });

            // Thay thế link vào chuỗi string
            var body = emailBody.Replace("#URL#", callbackUrl);

            // Topic of mail
            var subject = "Verify email";

            try
            {
                // email receiver - Subject (chủ đề) - Content (nội dung mail)
                await _emailSender.SendEmailAsync(user.Email, subject, body);

                return Ok("Send email successfully");
            }
            catch
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>()
                    {
                        "Verify Email ERROR!"
                    }
                });
            }
        }

        return NotFound();
    }

    [HttpPost]
    [Route("AdminLogin")]
    public async Task<IActionResult> AdminLogin(UserDTO userDTO)
    {
        if (ModelState.IsValid)
        {
            // Check if user is existed
            var user = await _userRepository.GetUserByNameAsync(userDTO.Name);

            if (user == null)
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>() {
                        "User isn't existed !"
                    }
                });
            }

            // Validate password
            var validatePassword = await _userRepository.CheckPasswordAsync(user, userDTO.Password);

            if (validatePassword == false)
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>() {
                        "INVALID Credentials !"
                    }
                });
            }

            // generate jwt access token & refresh token
            var jwtToken = await generateJwtToken(user);

            return Ok(jwtToken);
        }

        return NotFound();
    }

    [HttpPost]
    [Route("Register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(UserDTO userDTO)
    {
        if (ModelState.IsValid)
        {
            if (userDTO.Email == null)
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>() {
                        "No Email Value !"
                    }
                });
            }

            // Check if email already exist
            var user_exist = await _userRepository.GetUserByEmailAsync(userDTO.Email);

            if (user_exist != null)
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>() {
                        "Email already exist !"
                    }
                });
            }

            // Create new user
            ApplicationUser newUser = new ApplicationUser()
            {
                Email = userDTO.Email,
                UserName = userDTO.Name,
                PhoneNumber = userDTO.Phone,
                Address = userDTO.Address,
                EmailConfirmed = false
            };

            // IdentityResult
            IdentityResult result = await _userRepository.CreateUserAsync(newUser, userDTO.Password);

            if (result.Succeeded == true)
            {
                // Add Customer role
                var customerRole = await _userRepository.RoleExistsAsync("Customer");

                if (!customerRole)
                {
                    await _userRepository.CreateRoleAsync(new ApplicationRole("Customer"));
                }

                await _userRepository.AddRoleToUserAsync(newUser, "Customer");

                // Verify email
                var emailToken = await _userRepository.GenerateEmailConfirmationTokenAsync(newUser);

                var emailBody = $"Please confirm your email address by click here: #URL# ";

                // (http / https -- Scheme) + `://` + (localhost:5281 -- Host)
                var callbackUrl = Request.Scheme + "://" + Request.Host +
                                    Url.Action("ConfirmEmail", "Authentication",
                                                new { userId = newUser.Id, code = emailToken });

                // Thay thế link vào chuỗi string
                var body = emailBody.Replace("#URL#", callbackUrl);

                // Topic of mail
                var subject = "Verify email";

                try
                {
                    // email receiver - Subject (chủ đề) - Content (nội dung mail)
                    await _emailSender.SendEmailAsync(newUser.Email, subject, body);

                    return Ok(new AuthResult()
                    {
                        Result = true
                    });
                }
                catch
                {
                    return BadRequest(new AuthResult()
                    {
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
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail(string userId, string code)
    {
        if (userId == null || code == null)
        {
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
        if (user == null)
        {
            return BadRequest(new AuthResult()
            {
                Result = false,
                Errors = new List<string>()
                {
                    "Invalid user",
                }
            });
        }

        var result = await _userRepository.ConfirmEmailAsync(user, code);

        if (result.Succeeded == false)
        {
            return BadRequest(new AuthResult()
            {
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
    [AllowAnonymous]
    public async Task<IActionResult> Login(UserDTO userLogin)
    {
        if (ModelState.IsValid)
        {
            // Check if user is existed
            var user = await _userRepository.GetUserByEmailAsync(userLogin.Email);

            if (user == null)
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>() {
                        "User isn't existed !"
                    }
                });
            }

            // Check email confirmed
            if (user.EmailConfirmed == false)
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>() {
                        "Email haven't been confirmed yet!"
                    }
                });
            }

            // Validate password
            var checkPassword = await _userRepository.CheckPasswordAsync(user, userLogin.Password);

            if (checkPassword == false)
            {
                return BadRequest(new AuthResult()
                {
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

        return BadRequest(new AuthResult()
        {
            Result = false,
            Errors = new List<string>() {
                "INVALID Payload !"
            }
        });
    }

    [HttpPost]                                                      
    [Route("RefreshToken")]
    public async Task<IActionResult> RefreshToken(TokenRequestDTO tokenRequest)
    {
        if (ModelState.IsValid)
        {       
            var result = await VerifyAndGenerateToken(tokenRequest);

            if (result == null)
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>() {
                        "Invalid tokens"
                    }
                });
            }

            return Ok(result);
        }

        return BadRequest(new AuthResult()
        {
            Result = false,
            Errors = new List<string>() {
                "Invalid parameters"
            }
        });
    }

    [HttpPatch]
    [Route("ChangePassword")]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Customer")]
    public async Task<IActionResult> ChangePasswordUser(ChangePasswordDTO data)
    {
        try
        {
            var result = await _userRepository.ChangePasswordUser(data.token, data.currentPassword, data.newPassword);

            if (result == false)
            {
                return BadRequest();
            }

            return Ok("Change Password Successfully");
        }
        catch
        {
            return StatusCode(500, "ERROR");
        }
    }

    // Token gửi [FromQuery] qua API sẽ bị format string lại và không còn giống chuỗi gốc
    // => Dùng [FromBody] để request token      
    // => Kiểu dữ liệu Model để sử dụng [FromBody]
    // [FromQuery] chỉ xuất hiện ở truyền các tham số
    [HttpPost]
    [Route("VerifyEmail")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyEmail(VerifyEmailDTO data)
    {
        try
        {
            // Verify email
            var emailBody = @"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
        }
        .verify-container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .verify-container h2 {
            text-align: center;
            margin-bottom: 30px;
        }
        .verify-content {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .verify-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white !important;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            text-align: center;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }
        .verify-button:hover {
            background-color: #45a049;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class=""verify-container"">
        <h2>Email Verification</h2>
        <div class=""verify-content"">
            <p>Dear User,</p>
            <p>Please click the button below to verify your email address and complete the process:</p>
            <p><a href=""#URL#"" class=""verify-button"">Verify Email Address</a></p>
            <p>If you did not create an account with us, no further action is required.</p>
        </div>
        <p class=""footer"">This email was sent automatically. Please do not reply to this email.</p>
    </div>
</body>
</html>";

            // (http / https -- Scheme) + `://` + (localhost:5281 -- Host)
            var callbackUrl = data.Url;

            // Thay thế link vào chuỗi string
            var body = emailBody.Replace("#URL#", callbackUrl);

            // Topic of mail
            var subject = "Verify email";

            await _emailSender.SendEmailAsync(data.Email, subject, body);

            return Ok(callbackUrl);
        }
        catch
        {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpGet]
    [Route("ResetPasswordToken")]
    [AllowAnonymous]
    public async Task<IActionResult> GetResetPasswordToken(string email) {
        try {
            var user = await _userRepository.GetUserByEmailAsync(email);

            if (user == null) {
                return NotFound();
            }

            var token = await _userRepository.GeneratePasswordResetTokenAsync(user);

            return Ok(token);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpPatch]
    [Route("ResetPassword")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPasswordUser(ResetPassTokenDTO data)
    {
        try
        {
            var user = await _userRepository.GetUserByEmailAsync(data.Email);

            if (user == null) {
                return NotFound();
            }

            var result = await _userRepository.ResetPasswordAsync(user, data.Code, data.newPassword);

            if (!result.Succeeded) {
                return NotFound();
            }

            return Ok("Reset Password Successfully");
        }
        catch
        {
            return StatusCode(500, "ERROR");
        }
    }

    private async Task<AuthResult> VerifyAndGenerateToken(TokenRequestDTO tokenRequest)
    {
        var jwtTokenHanlder = new JwtSecurityTokenHandler();

        try
        {
            // Xác thực access token -> Trả về ClaimsPrinciple
            var tokenInVerification = jwtTokenHanlder.ValidateToken
                    (tokenRequest.Token, _tokenValidationParameters, out var validatedToken);

            // Kiểm tra xem validatedToken có phải là một JwtSecurityToken hay không. 
            // Nếu đúng, nó sẽ được gán cho biến jwtSecurityToken
            if (validatedToken is JwtSecurityToken jwtSecurityToken)
            {
                // Kiểm tra xem token có được mã hóa bằng HMACSHA256 không
                var result = jwtSecurityToken.Header
                                            .Alg
                                            .Equals(SecurityAlgorithms.HmacSha256,
                                                    StringComparison.InvariantCultureIgnoreCase);

                if (result == false)
                {
                    return null;
                }
            }

            return new AuthResult()
            {
                Result = false,
                Errors = new List<string>() {
                    "Access token is valid"
                }
            };
        }
        // Access token has expired -> Validate refresh token
        catch (SecurityTokenExpiredException)
        {
            try
            {
                var storedToken = await _refreshTokenRepository.GetByToken(tokenRequest.RefreshToken);

                // Kiểm tra token có tồn tại trong DB không
                if (storedToken == null)
                {
                    return new AuthResult()
                    {
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

                if (storedToken.JwtId != accessTokenJti)
                {
                    return new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>() {
                            "Invalid tokens"
                        }
                    };
                }

                // Kiểm tra token đã được sử dụng chưa
                if (storedToken.IsUsed)
                {
                    return new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>() {
                            "Tokens has been used"
                        }
                    };
                }

                // Token có bị thu hồi không
                if (storedToken.IsRevoked)
                {
                    return new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>() {
                            "Token has been revoked"
                        }
                    };
                }

                // Kiểm tra token hết hạn chưa
                if (storedToken.ExpiryDate < DateTime.UtcNow)
                {
                    return new AuthResult()
                    {
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
            catch
            {
                return null;
            }
        }
        catch (Exception ex)
        {
            return new AuthResult()
            {
                Result = false,
                Errors = new List<string>() {
                    ex.Message
                }
            };
        }
    }

    private async Task<AuthResult> generateJwtToken(ApplicationUser user)
    {
        // thằng xử lý và generate ra token
        var jwtTokenHanlder = new JwtSecurityTokenHandler();

        var key = Encoding.UTF8.GetBytes(_configuration.GetSection("JwtConfig:Secret").Value);

        // [Authorize] sẽ ủy quyền dựa trên các claims trong request token
        var claims = new List<Claim>() {
            new Claim("Id", user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),

            // JWT ID
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

            // Issued At Time - Chứa thời điểm Token được tạo
            new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUniversalTime().ToString())
        };

        // Xác định role của user
        var userRoles = await _userRepository.GetUserRoles(user);

        foreach (var role in userRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        // Token description
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            // Khai báo claims
            Subject = new ClaimsIdentity(claims),

            Expires = DateTime.UtcNow
                        .Add(TimeSpan.Parse(_configuration.GetSection("JwtConfig:ExpiryTimeFrame").Value)),

            // SymmetricSecurityKey - khóa đối xứng
            // mã hóa bằng thuật toán HMAC-SHA256
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)

        };

        var token = jwtTokenHanlder.CreateToken(tokenDescriptor);
        var jwtToken = jwtTokenHanlder.WriteToken(token);

        var refreshToken = new RefreshToken()
        {
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

        var result = new AuthResult()
        {
            Result = true,
            RefreshToken = refreshToken.Token,
            Token = jwtToken
        };

        return result;
    }
}