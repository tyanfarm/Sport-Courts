using BE.Contracts.Repositories;
using BE.Contracts.Services;
using BE.Models;
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
    public async Task<IActionResult> GetByCatId(string catId) {
        try {
            var courts = await _courtRepository.GetByCatId(catId);

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
    public async Task<IActionResult> GetBySportName(string sportname) {
        try {
            var courts = await _courtRepository.GetBySportName(sportname);

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

    [HttpGet]
    [Route("SearchFilter")]
    public async Task<IActionResult> SearchFilter(string searchString) {
        try {
            var courts = await _courtRepository.SearchFilter(searchString);

            if (courts == null) {
                return NotFound();
            }

            return Ok(courts);
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
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
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    public async Task<IActionResult> Update(IFormFile? file, Court court) {
        try {
            if (file != null & court.Name == null)
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
                image = await _imageUploader.Upload(file, "courts", court.Name);
            }

            var result = await _courtRepository.Update(court.CourtId, court.Name, court.Description, court.Address, court.Price, court.Discount, court.Image, court.Active);

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
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
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