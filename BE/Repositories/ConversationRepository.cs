using BE.Models;
using MongoDB.Driver;

namespace BE.Repositories;

public class ConversationRepository : IConversationRepository {
    private readonly IMongoCollection<Conversation> _conversationCollection;

    public ConversationRepository(IConfiguration configuration) {
        var mongoClient = new MongoClient(configuration.GetConnectionString("DefaultConnection"));
        // Get Database
        var mongoDb = mongoClient.GetDatabase("SportCourts");
        // Get Collection
        _conversationCollection = mongoDb.GetCollection<Conversation>("Conversations");
    }

    public async Task<List<Conversation>> GetAllConversations()
    {
        var conversations = await _conversationCollection.Find(_ => true).ToListAsync();

        return conversations;
    }

    public async Task<List<Conversation>> GetConversationsByCustomerId(string customerId) {
        var conversations = await _conversationCollection.Find(c => c.CustomersId.Contains(customerId))
                                                        .ToListAsync();

        return conversations;
    }

    public async Task<bool> Create(Conversation conversation)
    {
        await _conversationCollection.InsertOneAsync(conversation);

        return true;
    }

    public async Task<bool> Delete(string id)
    {
        await _conversationCollection.DeleteOneAsync(c => c.ConversationId == id);

        return true;
    }
}