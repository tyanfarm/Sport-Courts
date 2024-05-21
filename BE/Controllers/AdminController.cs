using BE.Models;
using BE.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AdminController : ControllerBase {
    private readonly IAdminRepository _adminRepository;

    public AdminController(IAdminRepository adminRepository) {
        _adminRepository = adminRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAdmins() {
        try {
            var admins = await _adminRepository.GetAllAdmins();

            if (admins == null) {
                return NotFound();
            }

            return Ok(admins);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpGet("{id:length(24)}")]
    public async Task<IActionResult> GetById(string id) {
        try {
            var admin = await _adminRepository.GetById(id);

            if (admin == null) {
                return NotFound();
            }

            return Ok(admin);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(Admin admin) {
        try {
            var result = await _adminRepository.Create(admin);

            if (result == false) {
                return NotFound();
            }

            return Ok(admin);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, bool? active) {
        try {
            var result = await _adminRepository.Update(id, active);

            if (result == false) {
                return NotFound();
            }

            return Ok("Update Successfully");
        } 
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpDelete]
    public async Task<IActionResult> Delete (string id) {
        try {
            var result = await _adminRepository.Delete(id);

            if (result == false) {
                return NotFound();
            }

            return Ok("Delete Successfully");
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }
}