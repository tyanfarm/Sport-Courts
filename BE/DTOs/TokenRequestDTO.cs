using System.ComponentModel.DataAnnotations;

namespace BE.DTOs;

public class TokenRequestDTO {
    [Required]
    public string Token {get; set;} = null!;

    [Required]
    public string RefreshToken {get; set;} = null!;
}