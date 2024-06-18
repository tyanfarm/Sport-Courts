import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/authContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { localhost } from '../../services/server';
import { formatDate, checkPassword } from '../../services/userService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [messageDisplayed, setMessageDisplayed] = useState(false);
    const { auth, logOut } = useContext(AuthContext);
    const token = localStorage.getItem('AT');
    const [user, setUser] = useState({});
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/login');
        }

        if (location.state && location.state.message && !messageDisplayed) {
            const { message } = location.state;
            toast.success(message);
            
            setMessageDisplayed(true);
        }
        
        fetchUser();
        fetchOrders();
    }, [auth.isAuthenticated])

    const requestOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    const fetchUser = async () => {
        fetch(`${localhost}/api/v1/User/${token}`, requestOptions)
            .then(res => res.json())
            .then(data => setUser(data));
    }

    const fetchOrders = async () => {
        fetch(`${localhost}/api/v1/Order`, requestOptions)
            .then(res => res.json())
            .then(data => setOrders(data));
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard user={user}  />;
            case 'orders':
                return <Orders orders={orders} />;
            case 'accountDetails':
                return <AccountDetails />;
            default:
                return <Dashboard user={user}  />;
        }
    };

    return (
        <div>
            <ToastContainer />
            <main className="profile-content">
                <div className="account-page-area section-space-y-axis-100">
                    <div className="profile-container">
                        <div className="row">
                            <div className="tab-content myaccount-tab-content" id="account-page-tab-content">
                                <ul className="nav myaccount-tab-trigger" id="account-page-tab" role="tablist">
                                    <li className="nav-item">
                                        <a onClick={() => setActiveTab('dashboard')} className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} id="account-dashboard-tab" data-bs-toggle="tab" role="tab" aria-controls="account-dashboard" aria-selected="true">Dashboard</a>
                                    </li>
                                    <li className="nav-item">
                                        <a onClick={() => setActiveTab('orders')} className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} id="account-orders-tab" data-bs-toggle="tab" role="tab" aria-controls="account-orders" aria-selected="false">Orders</a>
                                    </li>
                                    <li className="nav-item">
                                        <a onClick={() => setActiveTab('accountDetails')} className={`nav-link ${activeTab === 'accountDetails' ? 'active' : ''}`} id="account-details-tab" data-bs-toggle="tab" role="tab" aria-controls="account-details" aria-selected="false">Account Details</a>
                                    </li>
                                    <li className="nav-item">
                                        <a onClick={() => { logOut() }} className="nav-link nav-logout" id="account-logout-tab" href="/home" role="tab" aria-selected="false">Logout</a>
                                    </li>
                                </ul>
                                <div className='profile-content-area'>
                                    {renderContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

const Dashboard = ({ user }) => (
    <div style={{ paddingBottom: '200px' }} className="tab-pane fade show active" id="account-dashboard" role="tabpanel" aria-labelledby="account-dashboard-tab">
        <div className="myaccount-dashboard">
            <p>Hello <b>{user.userName} ---</b> Welcome to Cao Thu Cau Long.</p>
            <p>From your account dashboard you can view your recent orders, manage your shipping and
                billing addresses and <b>edit your password and account details</b>.</p>
        </div>
    </div>
);

const Orders = ({ orders }) => {
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const handleViewClick = (orderId) => {
        setSelectedOrderId(orderId === selectedOrderId ? null : orderId);
    };

    return (
        <div className="tab-pane fade" id="account-orders" role="tabpanel" aria-labelledby="account-orders-tab">
            <div className="myaccount-orders">
                <h4 className="small-title">MY ORDERS</h4>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <tbody>
                            <tr>
                                <th>PAYMENT</th>
                                <th>DATE</th>
                                <th>STATUS</th>
                                <th>TOTAL</th>
                                <th></th>
                            </tr>
                            {
                                orders.length === 0 ? (
                                    <h1 className='font-semibold uppercase'>You haven't had any order.</h1>
                                ) : (
                                    orders?.map(item => {
                                        return (
                                            <tr>
                                                <td><a className="account-order-id">{item.payment}</a></td>
                                                <td>{formatDate(item.orderDate)}</td>
                                                <td>{item.transactStatus.status}</td>
                                                <td>{item.totalMoney.toLocaleString('en-US')} VNĐ</td>
                                                <td>
                                                    <a href={`/orderdetails/orderId/${item.orderId}`} className="btn btn-secondary btn-primary-hover"><span>View</span></a>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AccountDetails = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const token = localStorage.getItem('AT');

    const validateForm = () => {
        if (!fullName) {
            toast.warning("FullName is required !");
            return false;
        }

        if (!email) {
            toast.warning("Email is required !");
            return false;
        }

        if (!currentPassword) {
            toast.warning("Current Password is required !");
            return false;
        }

        if (!newPassword) {
            toast.warning("New Password is required !");
            return false;
        }

        if (!checkPassword(newPassword)) {
            toast.warning("New Password must contain number, uppercase, symbol");
            return false;
        }

        if (!confirmNewPassword) {
            toast.warning("Confirm New Password is required !");
            return false;
        }

        if (newPassword != confirmNewPassword) {
            toast.warning("Confirm Password isn't correct !");
            return false;
        }

        return true;
    }

    const handleChangePassword = async () => {
        if (!validateForm()) {
            return;
        }
        console.log(currentPassword, newPassword, confirmNewPassword);
        console.log(token)

        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(`${localhost}/api/v1/Authentication/ChangePassword?token=${token}&currentPassword=${currentPassword}&newPassword=${newPassword}`, requestOptions);

            if (response.ok) {
                toast.success('Password reset successfully!');
            }
            else {
                toast.error('Failed to reset password.');
            }
        }
        catch {
            toast.error('An error occurred while resetting the password.');
        }
    }

    return (
        <div className="tab-pane fade" id="account-details" role="tabpanel" aria-labelledby="account-details-tab">
            <div className="myaccount-details">
                <form action="#" className="myaccount-form">
                    <div className="myaccount-form-inner">
                        <div className="single-input">
                            <label>Full Name*</label>
                            <input 
                                type="text" 
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div className="single-input">
                            <label>Email*</label>
                            <input 
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="single-input">
                            <label>Current Password</label>
                            <input 
                                type="password" 
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                        </div>
                        <div className="single-input">
                            <label>New Password</label>
                            <input
                                type="password" 
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="single-input">
                            <label>Confirm New Password</label>
                            <input
                                type="password" 
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="single-input">
                            <button onClick={() => handleChangePassword()} className="btn btn-custom-size lg-size btn-secondary btn-primary-hover rounded-0" type="submit">
                                <span>SAVE CHANGES</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Profile

