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

    public async Task<bool> Update(string id, string? customerId, string? transactStatusId, bool? paid, int? totalMoney) 
    {
        Customer? isCustomerOccur = null;
        TransactStatus? isStatusOccur = null;

        // Check customerID & TransactStatusID
        if (customerId != null) {
            isCustomerOccur = await _customerCollection.Find(c => c.CustomerId == customerId)
                                                            .FirstOrDefaultAsync();
        }
        
        if (transactStatusId != null) {
            isStatusOccur = await _transactStatusCollection.Find(t => t.TransactStatusId == transactStatusId)
                                                                .FirstOrDefaultAsync();
        }

        // In case wrong input customerID & transactStatusID
        if (isCustomerOccur == null && customerId != null) {
            return false;
        }

        if (isStatusOccur == null && transactStatusId != null) {
            return false;
        }

        var updateDefinitions = new List<UpdateDefinition<Order>>();

        if (customerId != null) {
            updateDefinitions.Add(Builders<Order>.Update.Set(o => o.CustomerId, customerId));
        }

        if (transactStatusId != null) {
            updateDefinitions.Add(Builders<Order>.Update.Set(o => o.TransactStatusId, transactStatusId));
        }

        if (paid != null) {
            updateDefinitions.Add(Builders<Order>.Update.Set(o => o.Paid, paid.Value));
        }

        if (totalMoney != null) {
            updateDefinitions.Add(Builders<Order>.Update.Set(o => o.TotalMoney, totalMoney.Value));
        }

        var updateDefinition = Builders<Order>.Update.Combine(updateDefinitions);
        var filter = Builders<Order>.Filter.Eq(o => o.OrderId, id);

        var result = await _orderCollection.UpdateOneAsync(filter, updateDefinition);

        return result.IsAcknowledged;
    }
}