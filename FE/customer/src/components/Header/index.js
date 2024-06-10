import React from 'react'

const Header = () => {
    return (
        <header>
            <div className="inner">
                <div className="logo">
                    <img src="https://firebasestorage.googleapis.com/v0/b/sport-courts-ab2d8.appspot.com/o/logo-removebg.png?alt=media&token=c68ae97e-8d28-4c4d-96f5-44d40d669e49" alt="Google logo"/>
                </div>
                <h1 className="site-title">CAO THỦ CẦU LÔNG</h1>
                <nav>
                    <ul>
                        <li><a href="/home" className="buttonLogin">HOME PAGE</a></li>
                        <li><a href="" className="buttonLogin">MY ACCOUNT</a></li>
                        <li><a href="/login" className="buttonRegister">SIGN IN</a></li>
                        <li><a href="/register" className="buttonRegister">SIGN UP</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
