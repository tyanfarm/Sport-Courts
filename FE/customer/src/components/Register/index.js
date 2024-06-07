import React from 'react'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkPassword } from '../../services/userService';

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [confirmPass, setConfirmPass] = useState("");
    const [isShowConfirmPass, setIsShowConfirmPass] = useState(false);

    // Get API
    const handleRegister = async () => {
        if (!email || !password) {
            toast.error("Email/Password is required");
            return;
        }
        if (password !== confirmPass) {
            toast.error("Confirm Password isn't correct");
            return;
        }
        if (checkPassword(password) == false) {
            toast.error("Password must contain number, uppercase, symbol");
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                address: address,
                password: password
            })
        };
        
        fetch('http://localhost:5102/api/v1/Authentication/Register', requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.result === false)  {
                    toast.error(data.errors[0]);
                    return;
                }
                toast.success("Register Successfully");
            })
            .catch((error) => {
                console.log(error);
            })
    }
    return (
        <div className="login-area">
            <ToastContainer/>
            <div className="login-container">
                <h2 className="login-title">Register</h2>
                <div className="input-group">
                    <input type="text" placeholder="Full Name"
                        value={name} onChange={(event) => setName(event.target.value)} />
                </div>
                <div className="input-group">
                <input type="text" placeholder="Email"
                    value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
                <div className="input-group">
                    <input type="text" placeholder="Phone Number"
                        value={phone} onChange={(event) => setPhone(event.target.value)} />
                </div>
                <div className="input-group">
                    <input type="text" placeholder="Address"
                        value={address} onChange={(event) => setAddress(event.target.value)} />
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
                <div className="input-group">
                    <input
                        type={isShowConfirmPass === true ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPass}
                        onChange={(event) => setConfirmPass(event.target.value)}
                    />
                    <i className={isShowConfirmPass === true ? "fa-solid fa-eye eye-icon" : "fa-solid fa-eye eye-icon"}
                        onClick={() => setIsShowConfirmPass(!isShowConfirmPass)}
                    ></i>
                </div>

                <button type="submit" className='login-button'
                    // disabled={email && password ? false : true}
                    onClick={() => handleRegister()}>SIGN UP</button>

                <div className="signup-link">
                    <a href="#">Already have an account? Log in!</a>
                </div>

            </div>
        </div>
    )
}

export default Register
