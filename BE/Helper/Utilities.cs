using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BE.Models;
using BE.Repositories;
using Microsoft.IdentityModel.Tokens;

namespace BE.Helper;

public static class Utilities {

    public static string GenerateRandomString(int length) {
        var random = new Random();
        var chars = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwertyuiopasdfghjklzxcvbnm_";

        return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
    }

    
}