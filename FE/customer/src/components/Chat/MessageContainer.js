import React from 'react'

const MessageContainer = ({ messages }) => {
  return (
    <div className='message-container'>
        {messages.map((m, index) => 
            <div key={index} className={`user-message ${m.type}`}>
                <div className={`message ${m.type === 'sender' ? 'bg-primary' : (m.type === 'others' ? 'bg-secondary' : '')}`}>
                    {m.message}
                </div>
                <div className='from-user'>{m.type === 'join' ? '' : m.user}</div>
            </div>
        )}
    </div>
  )
}

export default MessageContainer;
