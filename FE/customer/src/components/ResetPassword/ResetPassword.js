import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { localhost } from '../../services/server';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../services/loadingSpinner';
import { checkPassword } from '../../services/userService';

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const handleVerify = async () => {
        if (!password) {
            toast.error('Password is required');
            return;
        }

        if (!checkPassword(password)) {
            toast.error('Password must contain at least 1 letter, 1 number and 1 symbol');
            return;
        }

        setIsLoading(true); // Set loading state to true when the request starts

        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        try {

            
        }
        catch {
        }
        
    }

    return (
        <div className="login-area">
            {isLoading && <LoadingSpinner />} {/* Show the spinner when loading */}
            <ToastContainer/>
            <div className="login-container">
                <h2 className="login-title">Reset Password</h2>
                <div className="input-group">
                    <input type={isShowPassword === true ? "text" : "password"} placeholder="New Password"
                        value={password} onChange={(event) => setPassword(event.target.value)} />
                    <i className={isShowPassword === true ? "fa-solid fa-eye eye-icon" : "fa-solid fa-eye eye-icon"}
                        onClick={() => setIsShowPassword(!isShowPassword)}
                    ></i>
                </div>

                <button type="submit" className='login-button'
                onClick={() => handleVerify()}>Reset Password</button>

            </div>
        </div>
    )
}

export default ResetPassword
