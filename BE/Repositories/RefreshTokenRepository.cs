using BE.Models;
using MongoDB.Driver;

namespace BE.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly IMongoCollection<RefreshToken> _refreshTokenCollection;

    public RefreshTokenRepository(IConfiguration configuration) {
        var mongoClient = new MongoClient(configuration.GetConnectionString("DefaultConnection"));
        // Get Database
        var mongoDb = mongoClient.GetDatabase("SportCourts");
        // Get Collection
        _refreshTokenCollection = mongoDb.GetCollection<RefreshToken>("RefreshTokens");
    }

    public async Task<bool> Create(RefreshToken token)
    {
        await _refreshTokenCollection.InsertOneAsync(token);

        return true;
    }

    public async Task<RefreshToken> GetByToken(string token)
    {
        var storedToken = await _refreshTokenCollection.Find(r => r.Token == token).FirstOrDefaultAsync();

        return storedToken;
    }

    public async Task<bool> Update(string id, bool? isUsed)
    {
        var updateDefinitions = new List<UpdateDefinition<RefreshToken>>();

        if (isUsed != null) {
            updateDefinitions.Add(Builders<RefreshToken>.Update.Set(r => r.IsUsed, isUsed.Value));
        }

        var updateDefinition = Builders<RefreshToken>.Update.Combine(updateDefinitions);
        var filter = Builders<RefreshToken>.Filter.Eq(r => r.Id, id);

        var result = await _refreshTokenCollection.UpdateOneAsync(filter, updateDefinition);

        return result.IsAcknowledged;        
    }
}