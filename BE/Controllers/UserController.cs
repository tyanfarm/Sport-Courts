using BE.Repositories;
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
    public async Task<IActionResult> GetUser(string token) {
        var user = await _userRepository.GetUser(token);

        if (user == null) {
            return NotFound();
        }

        return Ok(user);
    }
}