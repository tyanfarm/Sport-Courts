using BE.Models;

namespace BE.Repositories;

public interface IConversationRepository {
    Task<List<Conversation>> GetAllConversations();
    Task<List<Conversation>> GetConversationsByCustomerId(string customerId);
    Task<Conversation> GetOrCreate(Conversation conversation);
    Task<bool> Delete(string id);
}