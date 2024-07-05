import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../services/loadingSpinner';
import { localhost } from '../../services/server';

const Login = () => {

    const { auth } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const { setAuth } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) {
            window.scrollTo(0, 0);
            window.location.replace("/home");
        }
    })

    // Get API
    const handleLogin = async () => {
        if (!username || !password) {
            toast.error("Username/Password is required");
            return;
        }
        setIsLoading(true); // Set loading state to true when the request starts
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: username,
                password: password
            })
        };
        fetch(localhost + '/api/v1/Authentication/AdminLogin', requestOptions)
            .then(res => res.json())
            .then(data => {
                setIsLoading(false);
                if (data.result === true && data.token !== null && data.refreshToken !== null) {
                    setAuth({token: data.token, refreshToken: data.refreshToken, isAuthenticated: true});
                    // toast.success("Login successfully");
                    window.location.replace("/home");
                }
                else {
                    toast.error(data.errors[0]);
                }
            });
    }

    return (
        <div className="login-area">
            {isLoading && <LoadingSpinner />} {/* Show the spinner when loading */}
            <ToastContainer/>
            <div className="login-container">
                <h2 className="login-title">Login</h2>
                <div className="input-group">
                    <input type="text" placeholder="username or username"
                        value={username} onChange={(event) => setUsername(event.target.value)} />
                </div>
                <div className="input-group">
                    <input
                        type={isShowPassword === true ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <i className={isShowPassword === true ? "fa-solid fa-eye eye-icon" : "fa-solid fa-eye eye-icon"}
                        onClick={() => setIsShowPassword(!isShowPassword)}
                    ></i>
                </div>

                <button type="submit" className='login-button'
                    onClick={() => handleLogin()}>LOGIN</button>

            </div>
        </div>
    )
}

export default Login
