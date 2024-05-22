using System.ComponentModel.DataAnnotations;

namespace BE.DTOs;

public class UserDTO {
    [Required]
    public string Name {get; set;} = null!;

    [Required]
    public string Email {get; set;} = null!;

    [Required]
    public string Password {get; set;} = null!;
}