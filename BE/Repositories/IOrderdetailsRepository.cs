using BE.Models;

namespace BE.Repositories;

public interface IOrderdetailsRepository {
    Task<List<Orderdetails>> GetAllDetails();
    Task<Orderdetails> GetById(string id); 
    Task<bool> Create(Orderdetails orderdetails);
    Task<bool> Update(string id, string? orderId, string? courtId, int? totalMoney, string? usedDate);
    Task<bool> Delete(string id);
}