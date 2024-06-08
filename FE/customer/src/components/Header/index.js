import React from 'react'

const Header = () => {
    return (
        <header>
            <div className="inner">
                <div className="logo">
                    <img src="assets/logo-removebg.png" alt="Google logo"/>
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
