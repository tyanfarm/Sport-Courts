using BE.Models;
using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;

namespace BE.Repositories;

public class FirebaseTokenRepository : IFirebaseTokenRepository {
    private readonly IMongoCollection<FirebaseToken> _firebaseCollection;

    public FirebaseTokenRepository(
        IConfiguration configuration
    ) {
        var mongoClient = new MongoClient(configuration.GetConnectionString("DefaultConnection"));
        // Get Database
        var mongoDb = mongoClient.GetDatabase("SportCourts");
        // Get Collection
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
        // userId must be unique
        var isOccur = await _firebaseCollection.Find(c => c.UserId == data.UserId).FirstOrDefaultAsync();

        if (isOccur != null) {
            var updateDefinition = Builders<FirebaseToken>.Update.Set(c => c.UserId, data.UserId);
            var filter = Builders<FirebaseToken>.Filter.Eq(c => c.Id, isOccur.Id);
            var result = await _firebaseCollection.UpdateOneAsync(filter, updateDefinition);
        }
        else {
            await _firebaseCollection.InsertOneAsync(data);
        }

        return data;
    }

    public async Task<bool> Delete(string id) {
        await _firebaseCollection.DeleteOneAsync(c => c.Id == id);

        return true;
    }
}