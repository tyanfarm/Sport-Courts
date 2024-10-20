using BE.Models;

namespace BE.Contracts.Repositories;

public interface ICategoryRepository {
    Task<List<Category>> GetAllCategories();
    Task<List<Category>> GetAllUniqueSportName();
    Task<List<string>> GetAllTypes(string sportname);
    Task<string> GetBySportsAndType(string sportname, string type);
    Task<Category> GetById(string id); 
    Task<bool> Create(Category category);
    Task<bool> Update(string id, string? sportname, string? type, string? description, bool? published, string? image);
    Task<bool> Delete(string id);
}