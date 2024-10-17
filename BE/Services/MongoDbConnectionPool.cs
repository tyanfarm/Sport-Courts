using BE.Contracts.Services;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;

namespace BE.Services;

public class MongoDbConnectionPool {
    private readonly IMongoClient _mongoClient;
    private readonly IDatabaseLoggingService _logger;

    public MongoDbConnectionPool(IConfiguration configuration, IDatabaseLoggingService logger) {
        _logger = logger;

        // Tạo ClusterSettings với event listener cho pool kết nối
        var settings = MongoClientSettings.FromConnectionString(configuration.GetConnectionString("DefaultConnection"));

        settings.ClusterConfigurator = cb =>
        {
            // Mở các pool connection
            cb.Subscribe<ConnectionPoolOpenedEvent>(e =>
                _logger.LogInfo($"Connection pool opened for server: {e.ServerId}, Max size: {e.ConnectionPoolSettings.MaxConnections}")
            );

            // Đóng pool
            cb.Subscribe<ConnectionPoolClosedEvent>(e =>
                _logger.LogInfo($"Connection pool closed for server: {e.ServerId}")
            );

            // Tạo connection nếu pool chưa có connection nào (tạo trên pool)
            cb.Subscribe<ConnectionCreatedEvent>(e =>
                _logger.LogInfo($"New connection created. Server: {e.ConnectionId.ServerId}, ConnectionId: {e.ConnectionId.LocalValue}")
            );

            // Kết nối được đóng và xóa khỏi pool
            cb.Subscribe<ConnectionClosedEvent>(e =>
                _logger.LogInfo($"Connection closed. Server: {e.ConnectionId.ServerId}")
            );

            // Yêu cầu kết nối từ pool
            cb.Subscribe<ConnectionPoolCheckingOutConnectionEvent>(e =>
                _logger.LogInfo($"Checking out connection from pool for server: {e.ServerId}")
            );

            // Checkout thành công, connection có thể được lấy ra để truy vấn
            cb.Subscribe<ConnectionPoolCheckedOutConnectionEvent>(e =>
                _logger.LogInfo($"Connection checked out from pool for server: {e.ServerId}")
            );

            // Sử dụng connection xong thì checkin (trả về lại cho pool)
            cb.Subscribe<ConnectionPoolCheckedInConnectionEvent>(e =>
                _logger.LogInfo($"Connection checked in to pool for server: {e.ServerId}")
            );
        };

        _mongoClient = new MongoClient(settings);
    }

    public IMongoDatabase GetDatabase(string dbName) {
        return _mongoClient.GetDatabase(dbName);
    }
}