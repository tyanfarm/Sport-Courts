using BE.Models;

namespace BE.Repositories;

public interface IOrderRepository {
    Task<List<Order>> GetAllOrders();
    Task<Order> GetById(string id); 
    Task<bool> Create(Order order);
    Task<bool> Update(string id, string? userId, string? transactStatusId, bool? paid, int? totalMoney);
    Task<bool> Delete(string id);
}