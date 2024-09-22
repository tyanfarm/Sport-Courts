using AutoMapper;
using BE.DTOs;
using BE.Models;
using BE.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ChatController : ControllerBase {
    private readonly IMapper _mapper;
    private readonly IConversationRepository _conversationRepository;
    private readonly IContentConversationRepository _contentRepository;
    private readonly IUserRepository _userRepository;

    public ChatController
    (
        IConversationRepository conversationRepository,
        IContentConversationRepository contentRepository,
        IUserRepository userRepository,
        IMapper mapper
    )
    {
        _conversationRepository = conversationRepository;
        _contentRepository = contentRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllConversations() {
        try
        {
            var conversations = await _conversationRepository.GetAllConversations();

            if (conversations == null)
            {
                return NotFound();
            }

            return Ok(conversations);
        }
        catch
        {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpGet]
    [Route("contentConversations/{conversationId}")]
    public async Task<IActionResult> GetContentsByConversationId(string conversationId) {
        try
        {
            var contents = await _contentRepository.GetByConversationId(conversationId);

            var contentsDto = _mapper.Map<List<ContentConversationDTO>>(contents);

            if (contentsDto == null)
            {
                return NotFound();
            }

            return Ok(contentsDto);
        }
        catch
        {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpGet]
    [Route("conversations/otherUser/{customerId}")]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Customer")]
    public async Task<IActionResult> GetOtherCustomerInConversation(string customerId) {
        try
        {
            // Find all conversations that customer has joined
            var conversations = await _conversationRepository.GetConversationsByCustomerId(customerId);

            var otherCustomers = new List<OtherCustomerDTO>();

            foreach (var conversation in conversations) {
                // Get different customerId with input Id
                var otherCustomerId = conversation.CustomersId?.FirstOrDefault(id => id != customerId);

                if (otherCustomerId != null) {
                    var user = await _userRepository.GetUserByIdAsync(otherCustomerId);

                    if (user != null)
                    {
                        otherCustomers.Add(new OtherCustomerDTO {
                            ConversationId = conversation.ConversationId,
                            FullName = user.FullName,
                            Email = user.Email
                        });
                    }
                }
            }

            if (otherCustomers == null)
            {
                return NotFound();
            }

            return Ok(otherCustomers);
        }
        catch
        {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpPost]
    [Route("conversations")]
    public async Task<IActionResult> CreateConversation(string emailUser1, string emailUser2)
    {
        try
        {
            var user1 = await _userRepository.GetUserByEmailAsync(emailUser1);
            var user2 = await _userRepository.GetUserByEmailAsync(emailUser2);

            var conversation = new Conversation {
                CustomersId = new List<string> {user1.Id.ToString(), user2.Id.ToString()}
            };

            var result = await _conversationRepository.GetOrCreate(conversation);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }
        catch
        {
            return StatusCode(500, "ERROR !");
        }
    }

    [HttpPost]
    [Route("contentConversations")]
    public async Task<IActionResult> CreateContentConversation(ContentConversation data)
    {
        try
        {
            var result = await _contentRepository.Create(data);

            if (result != true)
            {
                return NotFound();
            }

            return Ok(data);
        }
        catch
        {
            return StatusCode(500, "ERROR !");
        }
    }
}