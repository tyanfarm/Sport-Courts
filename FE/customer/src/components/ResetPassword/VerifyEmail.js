import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { localhost } from '../../services/server';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../services/loadingSpinner';
import { encodeToken } from '../../services/userService';

const VerifyEmail = () => {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const handleVerify = async () => {
        if (!email) {
            toast.error('Email is required');
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

        // Get Reset Password Token
        const res = await fetch(`${localhost}/api/v1/Authentication/ResetPasswordToken?email=${email}`, requestOptions);
        const data = await res.json();
        if (data == null) {
            return;
        }

        // Encode token
        const encoded = await encodeToken(data);
        
        try {
            // Đưa token và email vào url
            const url = `${window.location.protocol}//${window.location.host}/resetPassword/${encoded}/${email}`;

            // Thiết lập để gửi email với nội dung là 1 url chứa email kèm token cho user
            const requestVerify = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email,
                    url: url
                })
            }
            const response = await fetch(`${localhost}/api/v1/Authentication/VerifyEmail`, requestVerify);
            
            setIsLoading(false); // Set loading state to true when the request starts

            if (response.ok) {
                toast.success('Email sent');
                toast.info('Check your email and open the link we sent to continue');
            }
            else {
                toast.error('Failed to send email');
            }
        }
        catch {
            toast.error('An error occurred while send email');
        }

    }



    return (
        <div className="login-area">
            {isLoading && <LoadingSpinner />} {/* Show the spinner when loading */}
            <ToastContainer />
            <div className="login-container">
                <h2 className="login-title">Verify Email</h2>
                <div className="input-group">
                    <input type="email" placeholder="Email or username"
                        value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>

                <button type="submit" className='login-button'
                    onClick={() => handleVerify()}>Send link to email</button>

            </div>
        </div>
    )
}

export default VerifyEmail
