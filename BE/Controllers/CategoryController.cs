using BE.Models;
using BE.Private;
using BE.Repositories;
using BE.Services;
using Firebase.Auth;
using Firebase.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IImageUploader _imageUploader;

    public CategoryController
    (
        ICategoryRepository categoryRepository,
        IImageUploader imageUploader
    )
    {
        _categoryRepository = categoryRepository;
        _imageUploader = imageUploader;
    }

    // [HttpPost]
    // [Route("Upload")]
    // public async Task<IActionResult> Upload(IFormFile file)
    // {
    //     try
    //     {
    //         var imageUrl = await _imageUploader.Upload(file, "categories", "temp");

    //         return Ok(imageUrl);
    //     }
    //     catch (Exception ex)
    //     {
    //         return StatusCode(500, $"Internal server error: {ex.Message} {_firebaseInfo.AuthPassword}");
    //     }
    // }

    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        try
        {
            var categories = await _categoryRepository.GetAllCategories();

            if (categories == null)
            {
                return NotFound();
            }

            return Ok(categories);
        }
        catch
        {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpGet("{id:length(24)}")]
    public async Task<IActionResult> GetById(string id)
    {
        try
        {
            var category = await _categoryRepository.GetById(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }
        catch
        {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpGet]
    [Route("sports")]
    public async Task<IActionResult> GetAllUniqueSportName() {
        try
        {
            var categories = await _categoryRepository.GetAllUniqueSportName();

            if (categories == null)
            {
                return NotFound();
            }

            return Ok(categories);
        }
        catch
        {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpGet]
    [Route("types/{sportname}")]
    public async Task<IActionResult> GetAllTypes(string sportname) {
        try
        {
            var types = await _categoryRepository.GetAllTypes(sportname);

            if (types == null)
            {
                return NotFound();
            }

            return Ok(types);
        }
        catch
        {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpGet]
    [Route("getId/{sportname}/{type}")]
    public async Task<IActionResult> GetBySportsAndType(string sportname, string type) {
        try
        {
            var catId = await _categoryRepository.GetBySportsAndType(sportname, type);

            if (catId == null)
            {
                return NotFound();
            }

            return Ok(catId);
        }
        catch
        {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    public async Task<IActionResult> Create(IFormFile file, [FromForm] Category category)
    {
        try
        {
            var imageUrl = await _imageUploader.Upload(file, "categories", category.SportName + category.Type);

            category.Image = imageUrl;

            var result = await _categoryRepository.Create(category);

            if (result == false)
            {
                return NotFound();
            }

            return Ok(category);
        }
        catch
        {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpPatch("{id:length(24)}")]
    [Consumes("multipart/form-data")]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    public async Task<IActionResult> Update(IFormFile? file, string id, string? sportname, string? type, string? description, bool? published)
    {
        try
        {
            if (file != null & (sportname == null || type == null))
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>() {
                    "Sportname / Type is required !"
                }
                });
            }

            string? image = null;

            if (file != null) {
                image = await _imageUploader.Upload(file, "categories", sportname + type);
            }

            var result = await _categoryRepository.Update(id, sportname, type, description, published, image);

            if (result == false)
            {
                return NotFound();
            }

            return Ok("Update successfully");
        }
        catch
        {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpDelete]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var result = await _categoryRepository.Delete(id);

            if (result == false)
            {
                return NotFound();
            }

            return Ok("Delete successfully");
        }
        catch
        {
            return StatusCode(500, "ERROR");
        }
    }
}