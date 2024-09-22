using AutoMapper;
using BE.DTOs;
using BE.Models;

namespace BE.Mapping;

public class MappingProfile : Profile {
    public MappingProfile() 
    {
        CreateMap<ApplicationUser, UserDTO>();

        CreateMap<ContentConversation, ContentConversationDTO>()
            .ForMember(dest => dest.CustomerEmail,
                        opt => opt.MapFrom<UserEmailResolver>());
    }
}