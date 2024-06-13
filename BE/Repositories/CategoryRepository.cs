using BE.Models;
using MongoDB.Driver;

namespace BE.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly IMongoCollection<Category> _categoryCollection;

    public CategoryRepository(IConfiguration configuration) {
        var mongoClient = new MongoClient(configuration.GetConnectionString("DefaultConnection"));
        // Get Database
        var mongoDb = mongoClient.GetDatabase("SportCourts");
        // Get Collection
        _categoryCollection = mongoDb.GetCollection<Category>("Categories");
    }

    public async Task<bool> Create(Category category)
    {
        await _categoryCollection.InsertOneAsync(category);

        return true;
    }

    public async Task<bool> Delete(string id)
    {
        await _categoryCollection.DeleteOneAsync(c => c.CatId == id);

        return true;
    }

    public async Task<List<Category>> GetAllCategories()
    {
        return await _categoryCollection.Find(_ => true).ToListAsync();
    }

    public async Task<List<Category>> GetAllUniqueSportName() {
        // Lấy ra tất cả các category từ collection
        var allCategories = await _categoryCollection.Find(_ => true).ToListAsync();

        // Lọc và lấy ra tất cả các category với điều kiện mỗi category có sportname chỉ lấy 1 lần
        var distinctCategories = allCategories.GroupBy(c => c.SportName)
                                                .Select(group => group.First())
                                                .ToList();

        return distinctCategories;
    }

    public async Task<List<string>> GetAllTypes(string sportname) {
        var categories = await _categoryCollection.Find(c => c.SportName == sportname).ToListAsync();

        var types = categories.Select(c => c.Type).ToList();

        return types;  
    }

    public async Task<string> GetBySportsAndType(string sportname, string type) {
        var category = await _categoryCollection.Find(c => c.SportName == sportname && c.Type == type).FirstOrDefaultAsync();

        return category.CatId;
    }


    public async Task<Category> GetById(string id)
    {
        var category = await _categoryCollection.Find(c => c.CatId == id).FirstOrDefaultAsync();

        return category;
    }

    public async Task<bool> Update(string id, string? sportname, string? type, string? description, bool? published, string? image)
    {
        var updateDefinitions = new List<UpdateDefinition<Category>>();

        if (sportname != null) {
            updateDefinitions.Add(Builders<Category>.Update.Set(c => c.SportName, sportname));
        }

        if (type != null) {
            updateDefinitions.Add(Builders<Category>.Update.Set(c => c.Type, type));
        }

        if (description != null) {
            updateDefinitions.Add(Builders<Category>.Update.Set(c => c.Description, description));
        }

        if (published != null) {
            updateDefinitions.Add(Builders<Category>.Update.Set(c => c.Published, published.Value));
        }

        if (image != null) {
            updateDefinitions.Add(Builders<Category>.Update.Set(c => c.Image, image));
        }

        var updateDefinition = Builders<Category>.Update.Combine(updateDefinitions);
        var filter = Builders<Category>.Filter.Eq(c => c.CatId, id);

        var result = await _categoryCollection.UpdateOneAsync(filter, updateDefinition);

        return result.IsAcknowledged;
    }
}