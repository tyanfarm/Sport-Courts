import React, { useState, useRef } from 'react'

const SendMessageForm = ({ sendMessage, sendImage }) => {
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            sendMessage(message);
            setMessage('');
        }
        if (file) {
            sendImage(file);
            setFile(null);
            fileInputRef.current.value = null; // Reset the file input
        }
    };

    return (
        <form className="send-message-form"
            onSubmit={handleSubmit}>
            <div className="input-group-chat">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    onChange={e => setMessage(e.target.value)}
                    value={message}
                />
                <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    ref={fileInputRef}  // Attach ref to the file input
                    className="input-file"
                />
                <button
                    type="submit"
                    className="send-button"
                    disabled={!message && !file}
                >
                    Send
                </button>
            </div>
        </form>
    );
}

export default SendMessageForm
