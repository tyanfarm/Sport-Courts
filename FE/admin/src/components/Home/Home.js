import React, { useState, useEffect } from 'react';
import NotificationModal from '../Modal/NotificationModal';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Hiển thị modal khi vào trang home
        setIsModalOpen(true);
    }, []);

    return (
        <div className="admin-container">
            <div className="home-container">
                <div className="welcome-box">
                    <h1 className="welcome-title">Welcome to Admin Dashboard!</h1>
                    <p className="welcome-text">We are glad to have you here. Explore and enjoy our services.</p>
                </div>
                <NotificationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </div>
    );
}

export default Home;
