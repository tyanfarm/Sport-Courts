import React, { useEffect, useRef, useState } from 'react';

const MessageContainer = ({ messages, chatContainerRef }) => {

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        // Only scroll to bottom if user is not scrolling upwards
        if (chatContainer) {
            scrollToBottom();
        }
    }, [messages]);

    return (
        <div
            ref={chatContainerRef}
            className='message-container'
        >
            {messages.map((m, index) =>
                <div key={index} className={`user-message ${m.type}`}>
                    {m.message ? (
                        <div className={`message ${m.type === 'sender' ? 'bg-primary' : (m.type === 'others' ? 'bg-secondary' : '')}`}>
                            {m.message}
                        </div>
                    ) : (
                        <div className={`message-file ${m.type}`}>
                            <img
                                src={m.image}
                                alt="Sent Image"
                                className="message-image"
                                onLoad={() => scrollToBottom()} // Scroll only when not scrolling up
                            />
                        </div>
                    )}

                    <div className='from-user'>{m.type === 'join' ? '' : m.user}</div>
                </div>
            )}
        </div>
    );
};

export default MessageContainer;
