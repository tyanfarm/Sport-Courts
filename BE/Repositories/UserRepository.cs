using System.IdentityModel.Tokens.Jwt;
using BE.Models;
using Microsoft.AspNetCore.Identity;

namespace BE.Repositories;

public class UserRepository : IUserRepository {
    private readonly UserManager<ApplicationUser> _userManager;
    
    public UserRepository(UserManager<ApplicationUser> userManager) {
        _userManager = userManager;
    }

    public async Task<ApplicationUser> GetUser(string token) {
        var jwtTokenHanlder = new JwtSecurityTokenHandler();

        var userId = jwtTokenHanlder.ReadJwtToken(token)
                                    .Claims
                                    .FirstOrDefault(x => x.Type == "Id")?
                                    .Value;
        
        var user = await _userManager.FindByIdAsync(userId);

        return user;
    }
    
    public async Task<ApplicationUser> GetUserByIdAsync(string userId) {
        return await _userManager.FindByIdAsync(userId);
    }

    public async Task<ApplicationUser> GetUserByEmailAsync(string email) {
        return await _userManager.FindByEmailAsync(email);
    }
    public async Task<IdentityResult> CreateUserAsync(ApplicationUser user, string password) {
        return await _userManager.CreateAsync(user, password);
    }

    public async Task<string> GenerateEmailConfirmationTokenAsync(ApplicationUser user) {
        return await _userManager.GenerateEmailConfirmationTokenAsync(user);
    }
    
    public async Task<IdentityResult> ConfirmEmailAsync(ApplicationUser user, string code) {
        return await _userManager.ConfirmEmailAsync(user, code);
    }

    public async Task<bool> CheckPasswordAsync(ApplicationUser user, string password) {
        return await _userManager.CheckPasswordAsync(user, password);
    }

    public async Task<IdentityResult> Delete(string id) {
        var user = await _userManager.FindByIdAsync(id);

        return await _userManager.DeleteAsync(user);
    }

}