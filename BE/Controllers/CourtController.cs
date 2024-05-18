using BE.Models;
using BE.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CourtController : ControllerBase {
    private readonly ICourtRepository _courtRepository;

    public CourtController(ICourtRepository courtRepository) {
        _courtRepository = courtRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCourts() {
        try {
            var courts = await _courtRepository.GetAllCourts();

            if (courts == null) {
                return NotFound();
            }

            return Ok(courts);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpGet("{id:length(24)}")]
    public async Task<IActionResult> GetById(string id) {
        try {
            var court = await _courtRepository.GetById(id);

            if (court == null) {
                return NotFound();
            }

            return Ok(court);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(Court court) {
        try {
            var result = await _courtRepository.Create(court);

            if (result == null) {
                return NotFound();
            }

            return Ok(result);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, string? description, int? price, int? discount, string? image, int? active) {
        try {
            var result = await _courtRepository.Update(id, description, price, discount, image, active);

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
    public async Task<IActionResult> Delete(string id) {
        try {
            var result = await _courtRepository.Delete(id);

            if (result == false) {
                return NotFound();
            }

            return Ok("Delete successfully");
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }
}