import React, { useEffect, useRef, useState } from 'react';
import LoadingMessage from '../../services/loadingMessage';

const MessageContainer = ({ messages, chatContainerRef, isMessageSent, isLoading }) => {

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        const chatContainer = chatContainerRef.current;

        if (isMessageSent === false) {
            if (chatContainer.scrollHeight > 2700) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight * 0.1;
            }
            else {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight * 0.2;
            }
        }

        // Only scroll to bottom if user is not scrolling upwards
        else if (isMessageSent === true && chatContainer) {
            scrollToBottom();
        }

    }, [messages, , isMessageSent]);

    return (
        <div
            ref={chatContainerRef}
            className='message-container'
        >
            {isLoading ? (
                <LoadingMessage/>
            ) : (
                messages.map((m, index) =>
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
                                    onLoad={() => {
                                        if (isMessageSent) { // Chỉ cuộn khi isMessageSent là true
                                            scrollToBottom();
                                        }
                                    }} // Scroll only when not scrolling up
                                />
                            </div>
                        )}
    
                        <div className='from-user'>{m.type === 'join' ? '' : m.user}</div>
                    </div>
                )
            )}
        </div>
    );
};

export default MessageContainer;
