using BE.Models;
using BE.Contracts.Repositories;
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

    public async Task<Conversation> GetOrCreate(Conversation conversation)
    {
        // Kiểm tra xem đã tồn tại conversation với danh sách CustomersId này chưa
        var existingConversation = await _conversationCollection.Find(c => c.CustomersId != null
                                            && c.CustomersId.Count == conversation.CustomersId.Count
                                            && c.CustomersId.All(id => conversation.CustomersId.Contains(id)))
                                        .FirstOrDefaultAsync();

        // Nếu đã tồn tại Convesation thì trả về false
        if (existingConversation != null) {
            return existingConversation;
        }

        await _conversationCollection.InsertOneAsync(conversation);

        return conversation;
    }

    public async Task<bool> Delete(string id)
    {
        await _conversationCollection.DeleteOneAsync(c => c.ConversationId == id);

        return true;
    }
}