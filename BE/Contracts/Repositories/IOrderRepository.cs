using BE.Models;

namespace BE.Contracts.Repositories;

public interface IOrderRepository {
    Task<List<Order>> GetAllOrders();
    Task<Order> GetById(string id); 
    Task<List<Order>> GetByCustomerId(string customerId);
    Task<bool> Create(Order order);
    Task<bool> Update(string id, string? userId, string? transactStatusId, bool? paid, int? totalMoney);
    Task<bool> Delete(string id);
}