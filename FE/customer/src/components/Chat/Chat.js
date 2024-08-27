import React from 'react'
import MessageContainer from './MessageContainer'

const Chat = ({ messages }) => {
    return (
        <div className='chat'>
            <MessageContainer messages={messages} />
        </div>
    )
}

export default Chat
