using BE.Contracts.Services;
using Serilog;

namespace BE.Services;

public class DatabaseLogger : IDatabaseLoggingService
{
    private readonly Serilog.ILogger _fileLogger;

    public DatabaseLogger() {
        // Logger cho log vào file
        _fileLogger = new LoggerConfiguration()
            .WriteTo.File(
                "logs/Database/logDatabase.txt", 
                rollingInterval: RollingInterval.Day,
                outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
            .CreateLogger();
    }

    public void LogInfo(string message)
    {
        _fileLogger.Information(message);
    }
}