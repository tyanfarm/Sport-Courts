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
                        <li><a href="/home" className="buttonLogin">TRANG CHỦ</a></li>
                        <li><a href="" className="buttonLogin">TÀI KHOẢN</a></li>
                        <li><a href="/login" className="buttonRegister">ĐĂNG NHẬP</a></li>
                        <li><a href="/register" className="buttonRegister">ĐĂNG KÝ</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
