using System.IdentityModel.Tokens.Jwt;
using BE.Models;
using Microsoft.AspNetCore.Identity;

namespace BE.Repositories;

public class UserRepository : IUserRepository {
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    
    public UserRepository(
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        SignInManager<ApplicationUser> signInManager
    ) {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
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

    public async Task<List<ApplicationUser>> GetAllUsers() {
        return _userManager.Users.ToList();
    }
    
    public async Task<bool> ChangePasswordUser(string token, string newPassword) {
        var jwtTokenHanlder = new JwtSecurityTokenHandler();

        var userId = jwtTokenHanlder.ReadJwtToken(token)
                                    .Claims
                                    .FirstOrDefault(x => x.Type == "Id")?
                                    .Value;
        
        var user = await _userManager.FindByIdAsync(userId);

        await _userManager.RemovePasswordAsync(user);
        await _userManager.AddPasswordAsync(user, newPassword);

        return true;
    }

    public async Task<ApplicationUser> GetUserByIdAsync(string userId) {
        return await _userManager.FindByIdAsync(userId);
    }

    public async Task<ApplicationUser> GetUserByEmailAsync(string email) {
        return await _userManager.FindByEmailAsync(email);
    }

    public async Task<ApplicationUser> GetUserByNameAsync(string userName) {
        return await _userManager.FindByNameAsync(userName);
    }

    public async Task<IdentityResult> CreateUserAsync(ApplicationUser user, string password) {
        return await _userManager.CreateAsync(user, password);
    }

    public async Task<IdentityResult> CreateRoleAsync(ApplicationRole role) {
        return await _roleManager.CreateAsync(role);
    }

    public async Task<IdentityResult> AddRoleToUserAsync(ApplicationUser user, string role) {
        return await _userManager.AddToRoleAsync(user, role);
    }

    public async Task<IList<string>> GetUserRoles(ApplicationUser user) {
        return await _userManager.GetRolesAsync(user);
    }


    public async Task<bool> RoleExistsAsync(string role) {
        return await _roleManager.RoleExistsAsync(role);
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