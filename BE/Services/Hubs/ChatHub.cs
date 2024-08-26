using Microsoft.AspNetCore.SignalR;

namespace BE.Services.Hubs;

public class ChatHub : Hub {
    // this method will send notification to all clients
    // if client have to commnunicate, it will call SendMessage() method
    // if client have to receive notification from server it will use ReceiveMessage() method
    public async Task SendMessage(string user, string message) {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    // Everyone will be notified except who have joined the chat
    public async Task JoinChat(string user, string message) {
        await Clients.Others.SendAsync("ReceiveMessage", user, message);
    }
}