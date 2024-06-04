using BE.DTOs;
using BE.Models;
using Microsoft.AspNetCore.Identity;

namespace BE.Repositories;

public interface IUserRepository {
    Task<ApplicationUser> GetUser(string token);
    Task<ApplicationUser> GetUserByIdAsync(string userId);
    Task<ApplicationUser> GetUserByEmailAsync(string email);
    Task<IdentityResult> CreateUserAsync(ApplicationUser user, string password);
    Task<string> GenerateEmailConfirmationTokenAsync(ApplicationUser user);
    Task<IdentityResult> ConfirmEmailAsync(ApplicationUser user, string code);
    Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
    Task<IdentityResult> Delete(string id);
}