using BE.Models;
using Microsoft.AspNetCore.SignalR;

namespace BE.Services.Hubs;

public class ChatHub : Hub 
{
    private readonly string _botUser;
    private readonly IDictionary<string, UserConnection> _connections;

    public ChatHub(IDictionary<string, UserConnection> connections) 
    {
        _botUser = "Chat Bot";
        _connections = connections;
    }

    public async Task SendMessage(string message) 
    {
        // kiểm tra client hiện tại có lưu trong Dict không
        if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection)) 
        {
            await Clients.Caller.SendAsync("ReceiveMessageForSender", userConnection.User, message);

            await Clients.OthersInGroup(userConnection.Room)
                        .SendAsync("ReceiveMessageForOthers", userConnection.User, message);
            // // Lấy ra hết các user trong room mà client đang sử dụng
            // await Clients.Group(userConnection.Room)            
            //             // gửi message đến tất cả các user trong room
            //             // lúc này bên FE sẽ xử lí tự lắng nghe từ method `ReceiveMessage`
            //             .SendAsync("ReceiveMessage", userConnection.User, message);     
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