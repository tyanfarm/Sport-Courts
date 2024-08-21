using BE.Models;

namespace BE.Repositories;

public interface IFirebaseTokenRepository {
    Task<List<FirebaseToken>> GetAllTokens();
    Task<FirebaseToken> GetByUserId(string userId);
    Task<FirebaseToken> Create(FirebaseToken data);
    Task<bool> Delete(string id);
}