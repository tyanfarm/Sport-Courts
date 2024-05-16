using BE.Models;
using BE.Repositories;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CategoryController : ControllerBase {
    private readonly ICategoryRepository _categoryRepository;
    private readonly IConfiguration _configuration;

    public CategoryController(ICategoryRepository categoryRepository, IConfiguration configuration) {
        _categoryRepository = categoryRepository;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCategories() {
        try {
            var categories = await _categoryRepository.GetAllCategories();

            if (categories == null) {
                return NotFound();
            }

            return Ok(categories);
        }
        catch {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpGet("{id:length(24)}")]
    public async Task<IActionResult> GetById(string id) {
        try {
            var category = await _categoryRepository.GetById(id);

            if (category == null) {
                return NotFound();
            }

            return Ok(category);
        }
        catch {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(Category category) {
        try {
            var result = await _categoryRepository.Create(category);

            if (result == false) {
                return NotFound();
            }

            return Ok(category);
        }
        catch {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpPatch("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, string? description, int? published, string? image) {
        try {
            var result = await _categoryRepository.Update(id, description, published, image);

            if (result == false) {
                return NotFound();
            }

            return Ok("Update successfully");
        }
        catch {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(string id) {
        try {
            var result = await _categoryRepository.Delete(id);

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