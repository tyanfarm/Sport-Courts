using BE.Models;
using MongoDB.Driver;

namespace BE.Repositories;

public class OrderdetailsRepository : IOrderdetailsRepository
{
    private readonly IMongoCollection<Orderdetails> _orderdetailsCollection;
    private readonly IMongoCollection<Order> _orderCollection;
    private readonly IMongoCollection<Court> _courtCollection;

    public OrderdetailsRepository(IConfiguration configuration) {
        var mongoClient = new MongoClient(configuration.GetConnectionString("DefaultConnection"));
        // Get Database
        var mongoDb = mongoClient.GetDatabase("SportCourts");
        // Get Collection
        _orderdetailsCollection = mongoDb.GetCollection<Orderdetails>("OrderDetails");
        _orderCollection = mongoDb.GetCollection<Order>("Orders");
        _courtCollection = mongoDb.GetCollection<Court>("Courts");
    }

    public async Task<bool> Create(Orderdetails orderdetails)
    {
        // Check OrderId & CourtId
        var isOrderOccur = await _orderCollection.Find(o => o.OrderId == orderdetails.OrderId)
                                                .FirstOrDefaultAsync();

        var isCourtOccur = await _courtCollection.Find(c => c.CourtId == orderdetails.CourtId)
                                                .FirstOrDefaultAsync();

        if (isOrderOccur == null || isCourtOccur == null) {
            return false;
        }

        await _orderdetailsCollection.InsertOneAsync(orderdetails);

        return true;
    }

    public async Task<bool> Delete(string id)
    {
        await _orderdetailsCollection.DeleteOneAsync(id);

        return true;
    }

    public async Task<List<Orderdetails>> GetAllDetails()
    {
        var details = await _orderdetailsCollection.Find(_ => true).ToListAsync();

        return details;
    }

    public async Task<List<Orderdetails>> GetByOrderId(string orderId) {
        var aggregate = _orderdetailsCollection.Aggregate()
            .Match(orderdetails => orderdetails.OrderId == orderId)
            .Lookup<Orderdetails, Court, Orderdetails>(
                _courtCollection,
                orderdetails => orderdetails.CourtId,
                court => court.CourtId,
                orderdetails => orderdetails.Court
            )
            .Unwind<Orderdetails, Orderdetails>(orderdetails => orderdetails.Court)
            .As<Orderdetails>();

        return await aggregate.ToListAsync();
    }


    public async Task<Orderdetails> GetById(string id)
    {
        var detail = await _orderdetailsCollection.Find(d => d.OrderdetailsId == id)
                                                .FirstOrDefaultAsync();

        return detail;
    }

    public async Task<bool> Update(string id, string? orderId, string? courtId, int? totalMoney, string? usedDate)
    {
        Order? isOrderOccur = null;
        Court? isCourtOccur = null;

        // Check customerID & TransactStatusID
        if (orderId != null) {
            isOrderOccur = await _orderCollection.Find(c => c.OrderId == orderId)
                                                            .FirstOrDefaultAsync();
        }
        
        if (courtId != null) {
            isCourtOccur = await _courtCollection.Find(t => t.CourtId == courtId)
                                                                .FirstOrDefaultAsync();
        }

        // In case wrong input orderID & courtID
        if (courtId != null && isCourtOccur == null) {
            return false;
        }

        if (orderId != null && isCourtOccur == null) {
            return false;
        }

        var updateDefinitions = new List<UpdateDefinition<Orderdetails>>();

        if (orderId != null) {
            updateDefinitions.Add(Builders<Orderdetails>.Update.Set(o => o.OrderId, orderId));
        }

        if (courtId != null) {
            updateDefinitions.Add(Builders<Orderdetails>.Update.Set(o => o.CourtId, courtId));
        }

        if (totalMoney != null) {
            updateDefinitions.Add(Builders<Orderdetails>.Update.Set(o => o.TotalMoney, totalMoney.Value));
        }

        if (usedDate != null) {
            updateDefinitions.Add(Builders<Orderdetails>.Update.Set(o => o.UsedDate, usedDate));
        }

        var updateDefinition = Builders<Orderdetails>.Update.Combine(updateDefinitions);
        var filter = Builders<Orderdetails>.Filter.Eq(o => o.OrderdetailsId, id);

        var result = await _orderdetailsCollection.UpdateOneAsync(filter, updateDefinition);

        return result.IsAcknowledged;
    }
}