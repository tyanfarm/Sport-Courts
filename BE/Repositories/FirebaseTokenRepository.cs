using BE.Models;
using BE.Contracts.Repositories;
using MongoDB.Driver;
using BE.Services;

namespace BE.Repositories;

public class FirebaseTokenRepository : IFirebaseTokenRepository {
    private readonly IMongoCollection<FirebaseToken> _firebaseCollection;

    public FirebaseTokenRepository(MongoDbConnectionPool mongoDbConnectionPool) {
        var mongoDb = mongoDbConnectionPool.GetDatabase("SportCourts");

        _firebaseCollection = mongoDb.GetCollection<FirebaseToken>("FirebaseTokens");
    }

    public async Task<List<FirebaseToken>> GetAllTokens() {
        var tokens = await _firebaseCollection.Find(_ => true).ToListAsync();

        return tokens;
    }

    public async Task<FirebaseToken> GetByUserId(string userId) {
        var token = await _firebaseCollection.Find(c => c.UserId == userId)
                                            .SingleOrDefaultAsync();
        
        return token;
    }

    public async Task<FirebaseToken> Create(FirebaseToken data) {
        var result = await _firebaseCollection.Find(c => c.Token == data.Token).FirstOrDefaultAsync();

        // If token is already existed -> return null
        if (result == null) {
            await _firebaseCollection.InsertOneAsync(data);
            return data;
        }

        return null;
    }

    public async Task<bool> Delete(string userId) {
        await _firebaseCollection.DeleteManyAsync(c => c.UserId == userId);

        return true;
    }
}