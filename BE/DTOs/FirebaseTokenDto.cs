using System.ComponentModel.DataAnnotations;

namespace BE.DTOs;

public class FirebaseTokenDto {
    public string? FirebaseToken {get; set;}

    [Required]
    public string UserToken {get; set;} = null!;
}