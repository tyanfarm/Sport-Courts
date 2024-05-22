using BE.DTOs;
using BE.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthenticationController : ControllerBase {
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthenticationController(UserManager<ApplicationUser> userManager) {
        _userManager = userManager;
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

            return Ok(result);
        }

        return BadRequest();
    }

}