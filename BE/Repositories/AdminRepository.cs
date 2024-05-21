using BE.Models;
using MongoDB.Driver;

namespace BE.Repositories;

public class AdminRepository : IAdminRepository
{
    private readonly IMongoCollection<Admin> _adminCollection;

    public AdminRepository(IConfiguration configuration) {
        var mongoClient = new MongoClient(configuration.GetConnectionString("DefaultConnection"));
        // Get Database
        var mongoDb = mongoClient.GetDatabase("SportCourts");
        // Get Collection
        _adminCollection = mongoDb.GetCollection<Admin>("Admin");
    }

    public async Task<bool> Create(Admin admin)
    {
        admin.CreateDate = DateTime.Now;
        
        await _adminCollection.InsertOneAsync(admin);

        return true;
    }

    public async Task<bool> Delete(string id)
    {
        await _adminCollection.DeleteOneAsync(a => a.AdminId == id);

        return true;
    }

    public async Task<List<Admin>> GetAllAdmins()
    {
        var admins = await _adminCollection.Find(_ => true).ToListAsync();

        return admins;
    }

    public async Task<Admin> GetById(string id)
    {
        var admin = await _adminCollection.Find(a => a.AdminId == id).FirstOrDefaultAsync();

        return admin;
    }

    public async Task<bool> Update(string id, bool? active)
    {
        var updateDefinitions = new List<UpdateDefinition<Admin>>();

        if (active != null) {
            updateDefinitions.Add(Builders<Admin>.Update.Set(a => a.Active, active.Value));
        }

        var updateDefinition = Builders<Admin>.Update.Combine(updateDefinitions);
        var filter = Builders<Admin>.Filter.Eq(a => a.AdminId, id);

        var result = await _adminCollection.UpdateOneAsync(filter, updateDefinition);

        return result.IsAcknowledged;
    }
}