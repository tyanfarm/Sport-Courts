using BE.Models;

namespace BE.Repositories;

public interface IRefreshTokenRepository {
    Task<bool> Create(RefreshToken token);
    Task<RefreshToken> GetById(string id); 
}