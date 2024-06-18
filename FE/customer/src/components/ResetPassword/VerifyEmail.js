import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { localhost } from '../../services/server';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../services/loadingSpinner';

const VerifyEmail = () => {
    const [email, setEmail] = useState("");
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
        const url = `https://github.com/tyanfarm`;

        try {
            const response = await fetch(`${localhost}/api/v1/Authentication/VerifyEmail?email=${email}&url=${url}`, requestOptions);

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
            <ToastContainer/>
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
