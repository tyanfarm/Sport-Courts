using BE.Models;

namespace BE.Repositories;

public interface IContentConversationRepository {
    Task<List<ContentConversation>> GetAllContents();
    Task<bool> Create(ContentConversation conversation);
    Task<bool> Delete(string id);
} 