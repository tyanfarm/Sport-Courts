import React, { useState } from 'react';

const Lobby = ({ joinRoom }) => {
    const [user, setUser] = useState('');
    const [room, setRoom] = useState('');

    return (
        <form
            className='lobby'
            onSubmit={e => {
                e.preventDefault();
                joinRoom(user, room);
            }}
        >
            <div className='form-group'>
                <input
                    type="text"
                    placeholder="Name"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    className='form-control'
                />
                <input
                    type="text"
                    placeholder="Room"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    className='form-control'
                />
            </div>
            <button type="submit" className='btn' disabled={!user || !room}>
                Join
            </button>
        </form>
    )
}

export default Lobby;
