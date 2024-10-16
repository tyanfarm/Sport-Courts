using AutoMapper;
using BE.Contracts.Repositories;
using BE.DTOs;
using BE.Models;

namespace BE.Mapping;

// IValueResolver - Interface hỗ trợ logic tùy chỉnh cho mapping
public class UserEmailResolver : IValueResolver<ContentConversation, ContentConversationDTO, string> 
{
    private readonly IUserRepository _userRepository;

    public UserEmailResolver(IUserRepository userRepository) {
        _userRepository = userRepository;
    }

    public string Resolve(ContentConversation source, ContentConversationDTO destination, string destMember, ResolutionContext context) {
        var email =  _userRepository.GetEmailByIdAsync(source.CustomerId).Result;

        return email ?? string.Empty;
    }
}