using BE.Models;

namespace BE.Repositories;

public interface IContentConversationRepository {
    Task<List<ContentConversation>> GetAllContents();
    Task<List<ContentConversation>> GetByConversationId(string conversationId, int pageNumber, int pageSize);
    Task<long> CountByConversationId(string conversationId);
    Task<bool> Create(ContentConversation conversation);
    Task<bool> Delete(string id);
} 