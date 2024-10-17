using BE.Models;

namespace BE.Contracts.Services;

public interface ILoggingService {
    void LogInfo(string message);
    // void LogError(string message);
    // void LogWarning(string message);
}