using BE.Models;

namespace BE.Repositories;

public interface IOrderRepository {
    Task<List<Order>> GetAllOrders();
    Task<Order> GetById(string id); 
    Task<bool> Create(Order order);
    Task<bool> Update(string id);
    Task<bool> Delete(string id);
}