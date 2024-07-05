using BE.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class UserController : ControllerBase {
    private readonly IUserRepository _userRepository;

    public UserController(IUserRepository userRepository) {
        _userRepository = userRepository;
    }

    [HttpGet]
    [Route("{token}")]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Customer")]
    public async Task<IActionResult> GetUser(string token) {
        var user = await _userRepository.GetUser(token);

        if (user == null) {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpGet]             
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    public async Task<IActionResult> GetAllUsers() {
        var user = await _userRepository.GetAllUsers();

        if (user == null) {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpDelete]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    public async Task<IActionResult> Delete(string id) {
        try {
            var result = await _userRepository.Delete(id);

            if (result.Succeeded == false) {
                return NotFound();
            }

            return Ok("Delete successfully");
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }
}