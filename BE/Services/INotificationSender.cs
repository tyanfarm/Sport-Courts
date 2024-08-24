using BE.Models;

namespace BE.Services;

public interface INotificationSender {
    Task<bool> SendNotification(MessageRequest request);
}