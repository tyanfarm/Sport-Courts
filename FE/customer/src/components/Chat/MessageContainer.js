import React, { useEffect, useRef } from 'react'
// useRef là 1 hook để lưu trữ và truy cập trực tiếp các phần tử DOM mà không cần re-render cả page

const MessageContainer = ({ messages }) => {
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            // đặt `scrolllTop = scrollHeight` để cuộn phần tử xuống cuối
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
                            <img src={m.image} alt="Sent Image" className="message-image" />
                        </div>
                    )}

                    <div className='from-user'>{m.type === 'join' ? '' : m.user}</div>
                </div>
            )}
        </div>
    )
}

export default MessageContainer;
