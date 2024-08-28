import React, { useState } from 'react'
import Lobby from './Lobby'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Chat from './Chat';

const ChatApp = () => {
    const [connection, setConnection] = useState();
    const [messages, setMessages] = useState([]);

    const joinRoom = async (user, room) => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl("http://localhost:5102/chathub")
                .configureLogging(LogLevel.Information)
                .build();

            // Handler xử lí event `ReceiveMessageJoinRoom` từ server
            connection.on("ReceiveMessageJoinRoom", (user, message) => {
                console.log('message receive (join): ', message);
                setMessages(messages => [...messages, {user, message, type: 'join'}]);
            });

            // Handler xử lí event `ReceiveMessageFromSender` từ server
            connection.on("ReceiveMessageForSender", (user, message) => {
                console.log('message receive (sender): ', message);
                setMessages(messages => [...messages, {user, message, type: 'sender'}]);
            });

            // Handler xử lí event `ReceiveMessageFromOthers` từ server
            connection.on("ReceiveMessageForOthers", (user, message) => {
                console.log('message receive (others): ', message);
                setMessages(messages => [...messages, {user, message, type: 'others'}]);
            });

            await connection.start();

            // Gọi phương thức `JoinRoom của ChatHub` từ server
            await connection.invoke("JoinRoom", {user, room});  

            setConnection(connection);
        } catch (e) {
            console.log(e);
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

  return (
    <div className='chatapp'>
      <h2>TYANICHAT</h2>
      <hr/>
      {!connection
        ? <Lobby joinRoom={joinRoom} />
        : <Chat messages={messages} sendMessage={sendMessage} />
      }
      
    </div>
  )
}

export default ChatApp
