using BE.Models;
using BE.Repositories;
using Microsoft.AspNetCore.Mvc;
using FirebaseAdmin.Messaging;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class FirebaseTokenController : ControllerBase
{
    private readonly IFirebaseTokenRepository _firebaseRepository;

    public FirebaseTokenController(IFirebaseTokenRepository firebaseRepository)
    {
        _firebaseRepository = firebaseRepository;
    }

    [HttpPost]
    [Route("Messaging")]
    public async Task<IActionResult> SendMessageAsync(MessageRequest request)
    {
        var message = new Message()
        {
            Notification = new Notification
            {
                Title = request.Title,
                Body = request.Body,
            },
            Token = request.DeviceToken
        };

        var messaging = FirebaseMessaging.DefaultInstance;
        var result = await messaging.SendAsync(message);

        if (!string.IsNullOrEmpty(result))
        {
            // Message was sent successfully
            return Ok("Message sent successfully!");
        }
        else
        {
            // There was an error sending the message
            throw new Exception("Error sending the message.");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTokens()
    {
        try
        {
            var tokens = await _firebaseRepository.GetAllTokens();

            if (tokens == null)
            {
                return NotFound();
            }

            return Ok(tokens);
        }
        catch
        {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetByUserId(string userId)
    {
        try
        {
            var token = await _firebaseRepository.GetByUserId(userId);

            if (token == null)
            {
                return NotFound();
            }

            return Ok(token);
        }
        catch
        {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(FirebaseToken data)
    {
        try
        {
            var token = await _firebaseRepository.Create(data);

            if (token == null)
            {
                return NotFound();
            }

            return Ok(token);
        }
        catch
        {
            return StatusCode(500, "ERROR");
        }
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var result = await _firebaseRepository.Delete(id);

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