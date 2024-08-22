import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const NotificationModal = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const allowNoti = localStorage.getItem('AllowNoti');

    useEffect(() => {
        if (allowNoti === null) {
            setModalOpen(true);
        }
    }, []);

    const handleAllow = () => {
        setModalOpen(false);
        localStorage.setItem('AllowNoti', true);
    };

    const handleDeny = () => {
        setModalOpen(false);
        localStorage.setItem('AllowNoti', false);
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
