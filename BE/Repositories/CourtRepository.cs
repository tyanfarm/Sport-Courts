using BE.Models;
using MongoDB.Driver;

namespace BE.Repositories;

public class CourtRepository : ICourtRepository
{
    private readonly IMongoCollection<Court> _courtCollection;
    private readonly IMongoCollection<Category> _categoryCollection;

    public CourtRepository(IConfiguration configuration) {
        var mongoClient = new MongoClient(configuration.GetConnectionString("DefaultConnection"));
        // Get Database
        var mongoDb = mongoClient.GetDatabase("SportCourts");
        // Get Collection
        _courtCollection = mongoDb.GetCollection<Court>("Courts");
        _categoryCollection = mongoDb.GetCollection<Category>("Categories");
    }

    public async Task<Court> Create(Court court)
    {
        // Check if catID of court is valid
        var isOccur = await _categoryCollection.Find(c => c.CatId == court.CatId).FirstOrDefaultAsync();

        if (isOccur == null) {
            return null;
        }

        await _courtCollection.InsertOneAsync(court);

        return court;
    }

    public async Task<bool> Delete(string id)
    {
        await _courtCollection.DeleteOneAsync(c => c.CourtId == id);

        return true;
    }

    public async Task<List<Court>> GetAllCourts()
    {
        var courts = await _courtCollection.Find(_ => true).ToListAsync();

        return courts;
    }

    public async Task<Court> GetById(string id)
    {
        var court = await _courtCollection.Find(c => c.CourtId == id).FirstOrDefaultAsync();
        
        return court;
    }

    public async Task<bool> Update(string id, string? name, string? description, int? price, int? discount, string? image, bool? active)
    {
        var updateDefinitions = new List<UpdateDefinition<Court>>();

        if (name != null) {
            updateDefinitions.Add(Builders<Court>.Update.Set(c => c.Name, name));
        }

        if (description != null) {
            updateDefinitions.Add(Builders<Court>.Update.Set(c => c.Description, description));
        }

        if (price != null) {
            updateDefinitions.Add(Builders<Court>.Update.Set(c => c.Price, price));
        }

        if (discount != null) {
            updateDefinitions.Add(Builders<Court>.Update.Set(c => c.Discount, discount));
        }

        if (image != null) {
            updateDefinitions.Add(Builders<Court>.Update.Set(c => c.Image, image));
        }

        if (active != null) {
            updateDefinitions.Add(Builders<Court>.Update.Set(c => c.Active, active.Value));
        }

        var updateDefinition = Builders<Court>.Update.Combine(updateDefinitions);

        // Filter for query court
        var filter = Builders<Court>.Filter.Eq(c => c.CourtId, id);

        var result = await _courtCollection.UpdateOneAsync(filter, updateDefinition);

        return result.IsAcknowledged;
    }
}