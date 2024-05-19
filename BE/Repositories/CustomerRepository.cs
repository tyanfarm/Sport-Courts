using BE.Models;
using MongoDB.Driver;

namespace BE.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly IMongoCollection<Customer> _customerCollection;

    public CustomerRepository(IConfiguration configuration) {
        var mongoClient = new MongoClient(configuration.GetConnectionString("DefaultConnection"));
        // Get Database
        var mongoDb = mongoClient.GetDatabase("SportCourts");
        // Get Collection
        _customerCollection = mongoDb.GetCollection<Customer>("Customers");
    }

    public async Task<bool> Create(Customer customer)
    {
        customer.CreateDate = DateTime.Now;
        
        await _customerCollection.InsertOneAsync(customer);

        return true;
    }

    public async Task<bool> Delete(string id)
    {
        await _customerCollection.DeleteOneAsync(c => c.CustomerId == id);

        return true;
    }

    public async Task<List<Customer>> GetAllCustomers()
    {
        var customers = await _customerCollection.Find(_ => true).ToListAsync();

        return customers;
    }

    public async Task<Customer> GetById(string id)
    {
        var customer = await _customerCollection.Find(c => c.CustomerId == id).FirstOrDefaultAsync();

        return customer;
    }

    public async Task<bool> Update(string id, string? fullname, string? address, string? phone, bool? emailconfirmed)
    {
        var updateDefinitions = new List<UpdateDefinition<Customer>>();

        if (fullname != null) {
            updateDefinitions.Add(Builders<Customer>.Update.Set(c => c.FullName, fullname));
        }

        if (address != null) {
            updateDefinitions.Add(Builders<Customer>.Update.Set(c => c.Address, address));
        }

        if (phone != null) {
            updateDefinitions.Add(Builders<Customer>.Update.Set(c => c.Phone, phone));
        }

        if (emailconfirmed != null) {
            updateDefinitions.Add(Builders<Customer>.Update.Set(c => c.EmailConfirmed, emailconfirmed.Value));
        }

        var updateDefinition = Builders<Customer>.Update.Combine(updateDefinitions);
        var filter = Builders<Customer>.Filter.Eq(c => c.CustomerId, id);

        var result = await _customerCollection.UpdateOneAsync(filter, updateDefinition);

        return result.IsAcknowledged;
    }
}