using BE.Models;
using BE.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace BE.Services.Hubs;

public class ChatHub : Hub 
{
    private readonly string _botUser;   
    private readonly IDictionary<string, UserConnection> _connections;
    private readonly IConversationRepository _conversationRepository;
    private readonly IContentConversationRepository _contentRepository;

    public ChatHub(
        IDictionary<string, UserConnection> connections,
        IConversationRepository conversationRepository,
        IContentConversationRepository contentRepository
    ) 
    {
        _botUser = "Chat Bot";
        _connections = connections;
        _conversationRepository = conversationRepository;
        _contentRepository = contentRepository;
    }

    public async Task SendMessage(string message) 
    {
        // kiểm tra client hiện tại có lưu trong Dict không
        if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection)) 
        {
            // Save message to database


            await Clients.Caller.SendAsync("ReceiveMessageForSender", userConnection.User, message);

            await Clients.OthersInGroup(userConnection.Room)
                        .SendAsync("ReceiveMessageForOthers", userConnection.User, message); 
        }
    }

    public async Task SendImage(string base64Image) {
        if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection)) {
            await Clients.Caller.SendAsync("ReceiveImageForSender", userConnection.User, base64Image);

            await Clients.OthersInGroup(userConnection.Room)
                        .SendAsync("ReceiveImageForOthers", userConnection.User, base64Image);
        }
    }

    // Tạo các room chat riêng biệt
    public async Task JoinRoom(UserConnection userConnection) 
    {
        // Thêm client vào nhóm (xác định bằng connectionId)
        await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);

        _connections[Context.ConnectionId] = userConnection;

        // Thông báo tới các client ở trong nhóm
        await Clients.Group(userConnection.Room).SendAsync("ReceiveMessageJoinRoom", _botUser, 
                $"{userConnection.User} has joined {userConnection.Room}");
    }
}