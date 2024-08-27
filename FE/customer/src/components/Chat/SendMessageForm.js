import React, {useState} from 'react'

const SendMessageForm = ({ sendMessage }) => {
    const [message, setMessage] = useState('');

    return (
        <form className="send-message-form"
            onSubmit={e => {
                e.preventDefault();
                sendMessage(message);
                setMessage('');
            }}>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    onChange={e => setMessage(e.target.value)}
                    value={message}
                />
                <button
                    type="submit"
                    className="send-button"
                    disabled={!message}
                >
                    Send
                </button>
            </div>
        </form>
    );
}

export default SendMessageForm
