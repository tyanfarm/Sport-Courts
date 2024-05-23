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

    public async Task<RefreshToken> GetById(string id)
    {
        var token = await _refreshTokenCollection.Find(r => r.Id.ToString() == id).FirstOrDefaultAsync();

        return token;
    }
}