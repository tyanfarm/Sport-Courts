using System.ComponentModel.DataAnnotations;

namespace BE.DTOs;

public class UserDTO {
    public string? Name {get; set;}

    public string? Email {get; set;}

    [Required]
    public string Password {get; set;} = null!;
}