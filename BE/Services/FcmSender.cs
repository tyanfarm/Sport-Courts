using BE.Models;
using FirebaseAdmin.Messaging;

namespace BE.Services;

public class FcmSender : INotificationSender {
    public async Task<bool> SendNotification(MessageRequest request) {
        var message = new Message() 
        {
            Notification = new Notification
            {
                Title = request.Title,
                Body = request.Body,
            },
            Token = request.DeviceToken
        };

        var messaging = FirebaseMessaging.DefaultInstance;
        var result = await messaging.SendAsync(message);

        if (!string.IsNullOrEmpty(result))
        {
            // Message was sent successfully
            return true;
        }
        else
        {
            // There was an error sending the message
            return false;
        }
    }
}