using BE.Models;
using BE.Repositories;
using BE.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CourtController : ControllerBase {
    private readonly ICourtRepository _courtRepository;
    private readonly IImageUploader _imageUploader;

    public CourtController(ICourtRepository courtRepository, IImageUploader imageUploader) {
        _courtRepository = courtRepository;
        _imageUploader = imageUploader;
    }

    // [Authorize(AuthenticationSchemes = "Bearer")]
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

    [HttpGet]
    [Route("category/{catId:length(24)}")]
    public async Task<IActionResult> GetByCatId(string catId, int pageNumber = 1, int pageSize = 9) {
        try {
            var courts = await _courtRepository.GetByCatId(catId, pageNumber, pageSize);

            if (courts == null) {
                return NotFound();
            }

            return Ok(courts);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpGet("category/{sportname}")]
    public async Task<IActionResult> GetBySportName(string sportname, int pageNumber = 1, int pageSize = 9) {
        try {
            var courts = await _courtRepository.GetBySportName(sportname, pageNumber, pageSize);

            if (courts == null) {
                return NotFound();
            }

            return Ok(courts);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    // [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
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
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create(IFormFile file, [FromForm] Court court) {
        try {
            var imageUrl = await _imageUploader.Upload(file, "courts", court.Name);

            court.Image = imageUrl;

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
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(IFormFile? file, string id, string? name, string? description, string? address, int? price, int? discount, bool? active) {
        try {
            if (file != null & name == null)
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>() {
                    "Court Name is required !"
                }
                });
            }

            string? image = null;

            if (file != null) {
                image = await _imageUploader.Upload(file, "courts", name);
            }

            var result = await _courtRepository.Update(id, name, description, address, price, discount, image, active);

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