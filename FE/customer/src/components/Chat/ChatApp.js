import React, { useState } from 'react'
import Lobby from './Lobby'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const ChatApp = () => {
    const [connection, setConnection] = useState();

    const joinRoom = async (user, room) => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl("http://localhost:5102/chathub")
                .configureLogging(LogLevel.Information)
                .build();

            // Handler xử lí event `ReceiveMessage` từ server
            connection.on("ReceiveMessage", (user, message) => {
                console.log('message receive: ', message);
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
      <Lobby joinRoom={joinRoom} />
    </div>
  )
}

export default ChatApp
