using BE.Models;

namespace BE.Repositories;

public interface ICategoryRepository {
    Task<List<Category>> GetAllCategories();
    Task<Category> GetById(string id); 
    Task<bool> Create(Category category);
    Task<bool> Update(string id, string? description, int? published, string? image);
    Task<bool> Delete(string id);
}