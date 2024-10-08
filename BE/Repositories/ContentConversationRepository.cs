using BE.Models;
using MongoDB.Driver;

namespace BE.Repositories;

public class ContentConversationRepository : IContentConversationRepository
{
    private readonly IMongoCollection<ContentConversation> _contentCollection;

    public ContentConversationRepository(IConfiguration configuration) {
        var mongoClient = new MongoClient(configuration.GetConnectionString("DefaultConnection"));
        // Get Database
        var mongoDb = mongoClient.GetDatabase("SportCourts");
        // Get Collection
        _contentCollection = mongoDb.GetCollection<ContentConversation>("ContentConversations");
    }

    public async Task<bool> Create(ContentConversation content)
    {
        await _contentCollection.InsertOneAsync(content);

        return true;
    }

    public async Task<bool> Delete(string id)
    {
        await _contentCollection.DeleteOneAsync(c => c.ContentId == id);

        return true;
    }

    public async Task<List<ContentConversation>> GetAllContents()
    {
        var contents = await _contentCollection.Find(_ => true).ToListAsync();

        return contents;
    }

    public async Task<List<ContentConversation>> GetByConversationId(string conversationId, int pageNumber, int pageSize) {
        var contents = await _contentCollection.Find(c => c.ConversationId == conversationId)
                                                .SortByDescending(c => c.Time) 
                                                .Skip((pageNumber - 1) * pageSize)
                                                .Limit(pageSize)        
                                                .ToListAsync();

        return contents;
    }

    public async Task<long> CountByConversationId(string conversationId) {
        var count = await _contentCollection.CountDocumentsAsync(c => c.ConversationId == conversationId);

        return count;
    }
}