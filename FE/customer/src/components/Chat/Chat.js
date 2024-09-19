import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import MessageContainer from './MessageContainer'
import { localhost } from '../../services/server';
import SendMessageForm from './SendMessageForm'

const Chat = ({ messages, sendMessage, sendImage }) => {
    const [listUsers, setListUsers] = useState([]);
    const [info, setInfo] = useState({});
    const { auth, logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const [token, setToken] = useState("");

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/login');
        }

        const storedToken = localStorage.getItem('AT');
        if (storedToken) {
            setToken(storedToken);
        }

    }, [auth.token, auth.isAuthenticated])


    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                await fetchInfo();  // Fetch User Info first
            }
        };
    
        fetchData();
    }, [token])

    useEffect(() => {
        const fetchData = async () => {
            if (info.id) {
                await fetchUsers(info.id);  // Fetch users after info.id is available
            }
        };
    
        fetchData();
    }, [info.id]);  // Trigger when info.id changes


    const fetchInfo = async () => {
        try {
            const response = await axios.get(`${localhost}/api/v1/User/${token}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            setInfo(data);
            console.log(data);  
        }
        catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    const fetchUsers = async (userId) => {
        try {
            const response = await axios.get(`${localhost}/api/v1/Chat/conversations/otherUser/${userId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setListUsers(response.data);
        } 
        catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    const handleSearchChange = (event) => {
        const value = event.target.value;
        
        if (value === '') {
            // If search term is empty, fetch all courts
            fetchUsers(info.id);
        } else {
            searchUser(value);
        }
    }

    const searchUser = async (searchString) => {
        try {
            const response = await axios.get(`${localhost}/api/v1/User/Filter?searchString=${searchString}`);
            setListUsers(response.data);
        }
        catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    return (
        <div className='chat-container'>
            <div className='client-list'>
                <div className='search-chat-area'>
                    <input
                        type="text"
                        placeholder="Search"
                        // value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                        style={{ margin: "0" }}
                    />
                    <i className="fas fa-search search-icon"></i>
                </div>
                <ul>
                    {listUsers.map(user => (
                        <li key={user.email} >
                            <i style={{ paddingRight: "8px" }} class='fas fa-user-alt'></i>
                            {user.fullName}
                        </li>
                    ))}
                </ul>
            </div>

            <div className='chat'>
                <MessageContainer messages={messages} />
                <SendMessageForm sendMessage={sendMessage} sendImage={sendImage} />
            </div>
        </div>
    )
}

export default Chat
