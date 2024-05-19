using BE.Models;

namespace BE.Repositories;

public interface ICustomerRepository {
    Task<List<Customer>> GetAllCustomers();
    Task<Customer> GetById(string id); 
    Task<bool> Create(Customer customer);
    Task<bool> Update(string id, string? fullname, string? address, string? phone, bool? emailconfirmed);
    Task<bool> Delete(string id);
}