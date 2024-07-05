import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/authContext'

const Header = () => {
    const { logOut } = useContext(AuthContext);
    return (
        <header>
            <div className="inner">
                <div className="logo">
                    <img src="https://firebasestorage.googleapis.com/v0/b/sport-courts-ab2d8.appspot.com/o/logo-removebg.png?alt=media&token=c68ae97e-8d28-4c4d-96f5-44d40d669e49" alt="Google logo" />
                </div>
                <h1 className="site-title">DASHBOARD</h1>
                <nav>
                    <ul>
                        <li><a href="/AdminLogin" className="buttonRegister">SIGN IN</a></li>
                        <li><a onClick={() => { logOut() }} href="/AdminLogin" className="buttonRegister">LOG OUT</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
