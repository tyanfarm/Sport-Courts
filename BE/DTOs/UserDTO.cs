using System.ComponentModel.DataAnnotations;

namespace BE.DTOs;

public class UserDTO {
    public string? UserName {get; set;}
    public string? FullName {get; set;}

    public string? Email {get; set;}

    public string? Phone {get; set;}

    public string? Address {get; set;}

    [Required]
    public string Password {get; set;} = null!;
}