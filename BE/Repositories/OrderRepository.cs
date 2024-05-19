using BE.Models;
using MongoDB.Driver;

namespace BE.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly IMongoCollection<Order> _orderCollection;
    private readonly IMongoCollection<Customer> _customerCollection;
    private readonly IMongoCollection<TransactStatus> _transactStatusCollection;

    public OrderRepository(IConfiguration configuration) {
        var mongoClient = new MongoClient(configuration.GetConnectionString("DefaultConnection"));
        // Get Database
        var mongoDb = mongoClient.GetDatabase("SportCourts");
        // Get Collection
        _orderCollection = mongoDb.GetCollection<Order>("Orders");
        _customerCollection = mongoDb.GetCollection<Customer>("Customers");
        _transactStatusCollection = mongoDb.GetCollection<TransactStatus>("TransactStatus");
    }

    public async Task<bool> Create(Order order)
    {
        // Check customerID & TransactStatusID
        var isCustomerOccur = await _customerCollection.Find(c => c.CustomerId == order.CustomerId).FirstOrDefaultAsync();
        var isStatusOccur = await _transactStatusCollection.Find(t => t.TransactStatusId == order.TransactStatusId).FirstOrDefaultAsync();

        if (isCustomerOccur == null || isStatusOccur == null) {
            return false;
        }

        // Set Order date
        order.OrderDate = DateTime.Now;

        await _orderCollection.InsertOneAsync(order);

        return true;
    }

    public async Task<bool> Delete(string id)
    {
        await _orderCollection.DeleteOneAsync(id);

        return true;
    }

    public async Task<List<Order>> GetAllOrders()
    {
        var orders = await _orderCollection.Find(_ => true).ToListAsync();

        return orders;
    }

    public async Task<Order> GetById(string id)
    {
        var order = await _orderCollection.Find(o => o.OrderId == id).FirstOrDefaultAsync();

        return order;
    }

    public Task<bool> Update(string id)
    {
        throw new NotImplementedException();
    }
}