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
    const currentUserRef = useRef("");

    const joinRoom = async (user, room) => {
        try {
            // Nếu đã có kết nối, chỉ cần gọi JoinRoom
            if (connection) {
                await connection.invoke("JoinRoom", { user, room });
                return;
            }

            const chatHistory = await getChatHistory(room);
            chatHistory.map((element) => {
                const email = element.customerEmail;
                const content = element.content;

                if (email === currentUserRef) {
                    console.log(email, content);
                    setMessages(messages => [...messages, { email, content, type: 'sender' }]);
                    console.log(messages);
                }
                else {
                    console.log(email, content);
                    setMessages(messages => [...messages, { email, content, type: 'others' }]);
                    console.log(messages);
                }
            })
            

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

    const getChatHistory = async (room) => {
        try {
            const response = await axios.get(`${localhost}/api/v1/Chat/contentConversations/${room}`,
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
            {/* {!connection
                ? <Lobby joinRoom={joinRoom} />
                : <Chat messages={messages} sendMessage={sendMessage} sendImage={sendImage} setMessages={setMessages}
                    token={token} handleUserClick={handleUserClick}/>
            } */}
            <Chat messages={messages} sendMessage={sendMessage} sendImage={sendImage} setMessages={setMessages}
                joinRoom={joinRoom} setCurrentUser={(user) => currentUserRef.current = user}/>

        </div>
    )
}

export default ChatApp
