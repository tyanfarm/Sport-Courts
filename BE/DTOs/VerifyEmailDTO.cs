using System.ComponentModel.DataAnnotations;

namespace BE.DTOs;

public class VerifyEmailDTO {
    [Required]
    public string Email {get; set;} = null!;

    [Required]
    public string Url {get; set;} = null!;

}