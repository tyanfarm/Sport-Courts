using BE.Models;

namespace BE.Repositories;

public interface IRefreshTokenRepository {
    Task<bool> Create(RefreshToken token);
    Task<RefreshToken> GetByToken(string token); 
    Task<bool> Update(string id, bool? isUsed);
}