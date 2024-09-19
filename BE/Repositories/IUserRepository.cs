using BE.DTOs;
using BE.Models;
using Microsoft.AspNetCore.Identity;

namespace BE.Repositories;

public interface IUserRepository {
    Task<ApplicationUser> GetUser(string token);
    // Task<bool> UpdateUser(string token);
    Task<List<ApplicationUser>> GetAllUsers();
    Task<bool> ChangePasswordUser(string token, string currentPassword, string newPassword);
    Task<ApplicationUser> GetUserByIdAsync(string userId);
    Task<ApplicationUser> GetUserByEmailAsync(string email);
    Task<ApplicationUser> GetUserByNameAsync(string userName);
    Task<List<ApplicationUser>> SearchFullNameFilter(string searchString);
    Task<IdentityResult> CreateUserAsync(ApplicationUser user, string password);
    Task<IdentityResult> CreateRoleAsync(ApplicationRole role);
    Task<IdentityResult> AddRoleToUserAsync(ApplicationUser user, string role);
    Task<IList<string>> GetUserRoles(ApplicationUser user);
    Task<bool> RoleExistsAsync(string role);
    Task<string> GenerateEmailConfirmationTokenAsync(ApplicationUser user);
    Task<string> GeneratePasswordResetTokenAsync(ApplicationUser user);
    Task<IdentityResult> ConfirmEmailAsync(ApplicationUser user, string code);
    Task<IdentityResult> ResetPasswordAsync(ApplicationUser user, string code, string newPassword);
    Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
    Task<IdentityResult> Delete(string id);
}