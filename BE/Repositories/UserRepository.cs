using System.IdentityModel.Tokens.Jwt;
using BE.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using BE.Helper;

namespace BE.Repositories;

public class UserRepository : IUserRepository {
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IMongoCollection<ApplicationUser> _userCollection;
    
    public UserRepository(
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration
    ) {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;

        var mongoClient = new MongoClient(configuration.GetConnectionString("DefaultConnection"));
        // Get Database
        var mongoDb = mongoClient.GetDatabase("SportCourts");
        // Get Collection
        _userCollection = mongoDb.GetCollection<ApplicationUser>("Users");
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
    
    public async Task<bool> ChangePasswordUser(string token, string currentPassword, string newPassword) {
        var jwtTokenHanlder = new JwtSecurityTokenHandler();

        var userId = jwtTokenHanlder.ReadJwtToken(token)
                                    .Claims
                                    .FirstOrDefault(x => x.Type == "Id")?
                                    .Value;
        
        var user = await _userManager.FindByIdAsync(userId);
        bool result = await _userManager.CheckPasswordAsync(user, currentPassword);
        
        if (result == false) {
            return result;
        }

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

    public async Task<List<ApplicationUser>> SearchFullNameFilter(string searchString) {
        if (searchString.IsNullOrEmpty() == true) {
            return null;
        }

        // Tìm kiếm không phân biệt hoa thường bằng biểu thức chính quy (Regex)
        var filter = Builders<ApplicationUser>.Filter.Regex(u => u.FullName, new MongoDB.Bson.BsonRegularExpression(searchString, "i"));
        
        return await _userCollection.Find(filter).ToListAsync();
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

    public async Task<string> GeneratePasswordResetTokenAsync(ApplicationUser user) {
        return await _userManager.GeneratePasswordResetTokenAsync(user);
    }

    public async Task<IdentityResult> ResetPasswordAsync(ApplicationUser user, string code, string newPassword) {
        return await _userManager.ResetPasswordAsync(user, code, newPassword);
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