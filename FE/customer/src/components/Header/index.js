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
                        <li><a href="" className="buttonLogin">ĐẶT SÂN</a></li>
                        <li><a href="" className="buttonLogin">CỬA HÀNG DỤNG CỤ</a></li>
                        <li><a href="" className="buttonRegister">ĐĂNG NHẬP / ĐĂNG KÝ</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
