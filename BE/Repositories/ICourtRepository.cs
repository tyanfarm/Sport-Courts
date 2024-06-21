using BE.DTOs;
using BE.Models;
using MongoDB.Bson;

namespace BE.Repositories;

public interface ICourtRepository {
    Task<List<Court>> GetAllCourts();
    Task<Court> GetById(string id); 
    Task<List<Court>> GetByCatId(string catId, int pageNumber, int pageSize);
    Task<List<Court>> GetBySportName(string sportname, int pageNumber, int pageSize);
    Task<Court> Create(Court court);
    Task<bool> Update(string id, string? name, string? description, string? address, int? price, int? discount, string? image, bool? active);
    Task<bool> Delete(string id);
}