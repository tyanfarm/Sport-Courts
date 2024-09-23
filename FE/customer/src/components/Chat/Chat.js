import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import MessageContainer from './MessageContainer'
import { AuthContext } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { localhost } from '../../services/server';
import SendMessageForm from './SendMessageForm'

const Chat = ({ messages, sendMessage, sendImage, setMessages, joinRoom, setCurrentUser }) => {
    const [defaultListUsers, setDefaultListUsers] = useState([]);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [listUsers, setListUsers] = useState([]);
    const [info, setInfo] = useState({});

    // Lấy token từ localStorage
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


    // Lấy thông tin người dùng hiện tại 
    // LƯU Ý: CẦN MAPPER QUA DTO Ở BE
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
        }
        catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    // Tìm kiếm trong bảng Conversations
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
            setDefaultListUsers(response.data);
        } 
        catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    const handleSearchChange = (event) => {
        const value = event.target.value;
        
        if (value === '') {
            // If search term is empty, fetch all courts
            setListUsers(defaultListUsers);
        } else {
            searchUser(value);
        }
    }

    // Khởi tạo room Conversation bằng email của 2 user
    const createConversation = async (user1, user2) => {
        try {
            const response = await axios.post(`${localhost}/api/v1/Chat/conversations?emailUser1=${user1}&emailUser2=${user2}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        }
        catch (error) {
            console.error('Error creating conversation:', error);
        }
    }

    // Xử lý joinRoom khi click vào user list 
    // -> lấy email hiện tại của client với email của client được click
    const handleUserClick = async (currentUserEmail, clickedUserEmail) => {
        // Tạo Conversation giữa currentUser và clickedUser
        const conversation = await createConversation(currentUserEmail, clickedUserEmail);

        if (conversation) {
            // Tham gia vào room của conversation
            joinRoom(currentUserEmail, conversation.conversationId);
            setCurrentUser(currentUserEmail);
            
            setListUsers(defaultListUsers);
        }
    }

    // Tìm kiếm trong bảng User
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
                        onChange={handleSearchChange}
                        className="search-input"
                        style={{ margin: "0" }}
                    />
                    <i className="fas fa-search search-icon"></i>
                </div>
                <ul>
                    {listUsers.map(user => (
                        <li key={user.email} onClick={() => handleUserClick(info.email, user.email)} >
                            <i style={{ paddingRight: "8px" }} class='fas fa-user-alt'></i>
                            {user.fullName} {user.email}
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
