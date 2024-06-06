import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);

    // Get API
    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Email/Password is required");
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email,
                password: password
            })
        };
        fetch('http://localhost:5102/api/v1/Authentication/Login', requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.result == true && data.token != null) {
                    localStorage.setItem("token", data.token);
                }
            });
    }

    return (
        <div className="login-area">
            <div className="login-container">
                <h2 className="login-title">Login</h2>
                <div className="input-group">
                    <input type="text" placeholder="Email or username"
                        value={email} onChange={(event) => setEmail(event.target.value)} />
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
                <div className="forgot-link">
                    <a href="#">Forgot Password?</a>
                </div>

                <button type="submit" className='login-button'
                    disabled={email && password ? false : true}
                    onClick={() => handleLogin()}>LOGIN</button>

                <div className="signup-link">
                    <a href="#">Sign up!</a>
                </div>

            </div>
        </div>
    )
}

export default Login
