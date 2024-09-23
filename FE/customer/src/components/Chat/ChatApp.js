import React, { useState, useEffect, useContext, useRef } from 'react'
import Lobby from './Lobby'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { ToastContainer, toast } from 'react-toastify';
import Chat from './Chat';
import { localhost } from '../../services/server';
import axios from 'axios';

// useState không cập nhật giá trị ngay lập tức mà sau khi render component
// useRep - thay đổi ngay lập tức, không re-render
const ChatApp = () => {
    const [connection, setConnection] = useState();
    const [messages, setMessages] = useState([]);
    const currentRoomRef = useRef("");
    const currentUserRef = useRef("");

    const chatContainerRef = useRef(null);
    const [pageNumber, setPageNumber] = useState(1); // Quản lý số trang để tải thêm dữ liệu
    const [hasMoreMessages, setHasMoreMessages] = useState(true); // Kiểm soát xem có còn tin nhắn để tải không


    useEffect(() => {
        // Lắng nghe sự kiện cuộn
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasMoreMessages, pageNumber]);

    // Phát hiện cuộn lên đầu để tải thêm lịch sử
    const handleScroll = async () => {
        if (chatContainerRef.current.scrollTop === 0 && hasMoreMessages) {
            const newPage = pageNumber + 1;
            const additionalMessages = await fetchAndMapChatHistory(currentRoomRef.current, currentUserRef, newPage);
            if (additionalMessages.length > 0) {
                setMessages(prevMessages => [...additionalMessages, ...prevMessages]);
                setPageNumber(newPage); // Tăng số trang lên
            } else {
                setHasMoreMessages(false); // Hết tin nhắn
            }
        }
    };

    const joinRoom = async (user, room) => {
        try {
            console.log(currentRoomRef);
            console.log(room);

            // Nếu đã có kết nối, chỉ cần gọi JoinRoom
            if (connection) {
                // Kiểm tra xem có phải room khác không
                if (currentRoomRef.current !== room) {
                    // Reset messages
                    setMessages([]);

                    // Cập nhật messages từ chatHistory một lần
                    const historyMessages = await fetchAndMapChatHistory(room, currentUserRef);

                    // Cập nhật state với lịch sử chat
                    setMessages(historyMessages);
                    currentRoomRef.current = room;
                }

                await connection.invoke("JoinRoom", { user, room });
                return;
            }

            // Cập nhật messages từ chatHistory một lần
            const historyMessages = await fetchAndMapChatHistory(room, currentUserRef);

            // Cập nhật state với lịch sử chat
            setMessages(historyMessages);

            currentRoomRef.current = room;

            // Kết nối SignalR
            const newConnection = new HubConnectionBuilder()
                .withUrl(`${localhost}/chathub`)
                .configureLogging(LogLevel.Information)
                .build();

            // Handler xử lí event `ReceiveMessageJoinRoom` từ server
            newConnection.on("ReceiveMessageJoinRoom", (user, message) => {
                console.log('message receive (join): ', message);
                setMessages(messages => [...messages, { user, message, type: 'join' }]);
            });

            // Handler xử lí event `ReceiveMessageFromSender` từ server
            newConnection.on("ReceiveMessageForSender", (user, message) => {
                console.log('message receive (sender): ', message);
                setMessages(messages => [...messages, { user, message, type: 'sender' }]);
            });

            // Handler xử lí event `ReceiveMessageFromOthers` từ server
            newConnection.on("ReceiveMessageForOthers", (user, message) => {
                if (user === currentUserRef.current) {
                    // Đây là message của chính sender
                    console.log('message receive (sender): ', message);
                    setMessages(messages => [...messages, { user, message, type: 'sender' }]);
                }
                else {
                    console.log('message receive (others): ', message);
                    setMessages(messages => [...messages, { user, message, type: 'others' }]);
                }
            });

            // Handle receiving images
            newConnection.on("ReceiveImageForSender", (user, base64Image) => {
                setMessages(messages => [...messages, { user, image: base64Image, type: 'sender' }]);
            });

            newConnection.on("ReceiveImageForOthers", (user, base64Image) => {
                if (user === currentUserRef.current) {
                    setMessages(messages => [...messages, { user, image: base64Image, type: 'sender' }]);
                }
                else {
                    setMessages(messages => [...messages, { user, image: base64Image, type: 'others' }]);
                }
            });

            await newConnection.start();

            // Gọi phương thức `JoinRoom của ChatHub` từ server
            await newConnection.invoke("JoinRoom", { user, room });

            setConnection(newConnection);       // Lưu kết nối mới vào state
        } catch (e) {
            console.log(e);
        }
    }

    // Lấy lịch sử chat
    const getChatHistory = async (room, pageNumber, pageSize) => {
        try {
            const response = await axios.get(`${localhost}/api/v1/Chat/contentConversations/${room}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        // 'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        }
        catch (error) {
            console.error('Error get chat history:', error);
        }
    }

    // Load lịch sử chat vào [messages]
    const fetchAndMapChatHistory = async (room, currentUserRef, pageNumber = 1) => {
        const chatHistory = await getChatHistory(room, pageNumber, 6);

        // Cập nhật messages từ chatHistory
        const historyMessages = [];
        chatHistory.contents.forEach((element) => {
            const email = element.customerEmail;
            const content = element.content;

            // Kiểm tra nếu content chứa "base64" để phân biệt là hình ảnh hay tin nhắn văn bản
            if (content.includes("base64")) {
                historyMessages.unshift({
                    user: email,
                    image: content,   // Nếu content chứa "base64", trả về thuộc tính image
                    type: email === currentUserRef.current ? 'sender' : 'others'
                });
            } else {
                historyMessages.unshift({
                    user: email,
                    message: content,  // Nếu không chứa "base64", trả về thuộc tính message
                    type: email === currentUserRef.current ? 'sender' : 'others'
                });
            }
        });

        return historyMessages;
    };

    const sendMessage = async (message) => {
        try {
            // Gọi phương thức `SendMessage của ChatHub` từ server
            await connection.invoke("SendMessage", message);
        }
        catch (e) {
            console.log(e);
        }
    }

    const sendImage = async (file) => {
        if (file.size > 1024 * 1024)     // 1MB 
        {
            toast.warn("File size exceeds 1MB");
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64Image = reader.result;
                await connection.invoke("SendImage", base64Image);
            };
            reader.readAsDataURL(file);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className='chatapp'>
            <ToastContainer />
            <h2>TYANICHAT</h2>
            <hr />
            <Chat messages={messages} sendMessage={sendMessage} sendImage={sendImage} setMessages={setMessages}
                joinRoom={joinRoom} chatContainerRef={chatContainerRef} setCurrentUser={(user) => currentUserRef.current = user} />

        </div>
    )
}

export default ChatApp
