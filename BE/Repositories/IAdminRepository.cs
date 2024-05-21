using BE.Models;

namespace BE.Repositories;

public interface IAdminRepository {
    Task<List<Admin>> GetAllAdmins();
    Task<Admin> GetById(string id); 
    Task<bool> Create(Admin admin);
    Task<bool> Update(string id, bool? active);
    Task<bool> Delete(string id);
}