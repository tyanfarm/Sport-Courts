using BE.Models;

namespace BE.Repositories;

public interface ICourtRepository {
    Task<List<Court>> GetAllCourts();
    Task<Court> GetById(string id); 
    Task<Court> Create(Court court);
    Task<bool> Update(string id, string? description, int? price, int? discount, string? image, int? active);
    Task<bool> Delete(string id);
}