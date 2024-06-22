using System.ComponentModel.DataAnnotations;

namespace BE.DTOs;

public class ChangePasswordDTO {
    [Required]
    public string token {get; set;} = null!;

    [Required]
    public string currentPassword {get; set;} = null!;

    [Required]
    public string newPassword {get; set;} = null!;
}