using BE.Contracts.Services;
using Serilog;

namespace BE.Services;

public class UserLogger : IUserLoggingService
{
    private readonly Serilog.ILogger _fileLogger;
    // private readonly ILogger _databaseLogger;

    public UserLogger() 
    {
        // Logger cho log vào file
        _fileLogger = new LoggerConfiguration()
            .WriteTo.File(
                "logs/Users/logUsers.txt", 
                rollingInterval: RollingInterval.Day,
                outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
            .CreateLogger();

        // // Logger cho log vào database (Giả định bạn đã thiết lập cách kết nối và lưu trữ vào database)
        // _databaseLogger = new LoggerConfiguration()
        //     .WriteTo.SqlServer("ConnectionString", "LogTable", 
        //         autoCreateTable: true)
        //     .CreateLogger();
    }

    public void LogInfo(string message)
    {
        _fileLogger.Information(message);
    }
}