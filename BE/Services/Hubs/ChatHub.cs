using BE.Models;
using Microsoft.AspNetCore.SignalR;

namespace BE.Services.Hubs;

public class ChatHub : Hub 
{
    private readonly string _botUser;

    public ChatHub() 
    {
        _botUser = "Chat Bot";
    }

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

    public async Task JoinRoom(UserConnection userConnection) 
    {
        // Thêm client vào nhóm (xác định bằng connectionId)
        await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);

        // Thông báo tới các client ở trong nhóm
        await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, 
                $"{userConnection.User} has joined {userConnection.Room}");
    }
}