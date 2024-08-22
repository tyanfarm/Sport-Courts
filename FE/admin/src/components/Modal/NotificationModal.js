import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { generateToken } from '../../notifications/firebase';

const NotificationModal = () => {
    const localhost = `http://localhost:5102`;
    const token = localStorage.getItem('AT');
    const [modalOpen, setModalOpen] = useState(false);
    const allowNoti = localStorage.getItem('AllowNoti');

    useEffect(() => {
        if (allowNoti === null) {
            setModalOpen(true);
        }
    }, []);

    const postFirebaseToken = async () => {
        // Get Device token
        const firebaseToken = await generateToken();

        console.log(firebaseToken);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ 
                firebaseToken: firebaseToken,
                userToken: token
            })
        };

        console.log(requestOptions.body);

        fetch(localhost + `/api/v1/FirebaseToken/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });
    }

    const deleteFirebaseToken = async () => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ 
                userToken: token
            })
        };

        console.log(requestOptions.body);

        fetch(localhost + `/api/v1/FirebaseToken/`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });
    }

    const handleAllow = async () => {
        setModalOpen(false);
        localStorage.setItem('AllowNoti', true);

        postFirebaseToken();
    };

    const handleDeny = () => {
        setModalOpen(false);
        localStorage.setItem('AllowNoti', false);

        deleteFirebaseToken();
    };

    if (!modalOpen) return null;

    return (
        <div className="noti-modal">
            <div className="noti-modal-content">
                <span className="close" onClick={() => { setModalOpen(false) }}>&times;</span>
                <h1>Allow Notification?</h1>
                <p>We would like to send you notifications. Do you allow?</p>
                <div className="noti-modal-actions">
                    <button className="btn allow-btn" onClick={handleAllow}>Allow</button>
                    <button className="btn deny-btn" onClick={handleDeny}>Deny</button>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
