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

            // Handler xử lí event `ReceiveMessage` từ server
            connection.on("ReceiveMessage", (user, message) => {
                console.log('message receive: ', message);
                setMessages(messages => [...messages, {user, message}]);
            });

            await connection.start();

            // Gọi phương thức `JoinRoom của ChatHub` từ server
            await connection.invoke("JoinRoom", {user, room});  

            setConnection(connection);
        } catch (e) {
            console.log(e);
        }
    }

  return (
    <div className='chatapp'>
      <h2>TYANICHAT</h2>
      <hr/>
      {!connection
        ? <Lobby joinRoom={joinRoom} />
        : <Chat messages={messages} />
      }
      
    </div>
  )
}

export default ChatApp
