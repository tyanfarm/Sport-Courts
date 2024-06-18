using System.ComponentModel.DataAnnotations;

namespace BE.DTOs;

public class ResetPassTokenDTO {
    [Required]
    public string Email {get; set;} = null!;

    [Required]
    public string Code {get; set;} = null!;

    [Required]
    public string newPassword {get; set;} = null!;
}