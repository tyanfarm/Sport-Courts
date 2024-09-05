import React from 'react'
import MessageContainer from './MessageContainer'
import SendMessageForm from './SendMessageForm'

const Chat = ({ messages, sendMessage, sendImage }) => {
    return (
        <div className='chat'>
            <MessageContainer messages={messages} />
            <SendMessageForm sendMessage={sendMessage} sendImage={sendImage} />
        </div>
    )
}

export default Chat
