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

    public async Task<Category> GetById(string id)
    {
        var category = await _categoryCollection.Find(c => c.CatId == id).FirstOrDefaultAsync();

        return category;
    }

    public async Task<bool> Update(string id, string? description, int? published, string? image)
    {
        var category = await _categoryCollection.Find(c => c.CatId == id).FirstOrDefaultAsync();

        if (description != null) {
            category.Description = description;
        }

        if (published != null) {
            category.Published = published.Value;
        }

        if (image != null) {
            category.Image = image;
        }

        var filter = Builders<Category>.Filter.Eq(c => c.CatId, id);

        await _categoryCollection.ReplaceOneAsync(filter, category);

        return true;
    }
}