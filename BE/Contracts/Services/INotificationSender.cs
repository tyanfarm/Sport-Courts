using BE.Models;

namespace BE.Contracts.Services;

public interface INotificationSender {
    Task<bool> SendNotification(MessageRequest request);
}