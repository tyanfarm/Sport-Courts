import React, { useContext } from 'react'
import { CartContext } from '../../contexts/cartContext'
import { AuthContext } from '../../contexts/authContext';

const Header = () => {

    const { cart } = useContext(CartContext);
    const { auth } = useContext(AuthContext);

    return (
        <header>
            <div className="inner">
                <div className="logo">
                    <img src="https://firebasestorage.googleapis.com/v0/b/sport-courts-ab2d8.appspot.com/o/logo-removebg.png?alt=media&token=c68ae97e-8d28-4c4d-96f5-44d40d669e49" alt="Google logo" />
                </div>
                <h1 className="site-title">TYANIPO</h1>
                <nav>
                    <ul>
                        <li><a href="/home" className="buttonLogin">HOME PAGE</a></li>
                        {
                            auth.isAuthenticated === true ? (
                                <React.Fragment>
                                    <li><a href="/profile" className="buttonLogin">MY ACCOUNT</a></li>
                                </React.Fragment>
                            )
                            : 
                            (
                                <React.Fragment>
                                    <li><a href="/login" className="buttonRegister">LOG IN</a></li>
                                    <li><a href="/register" className="buttonRegister">SIGN UP</a></li>
                                </React.Fragment>
                            )
                        }
                    </ul>
                </nav>
            </div>
                    <a href="/cart" className="cart-button">
                        <img src="https://firebasestorage.googleapis.com/v0/b/sport-courts-ab2d8.appspot.com/o/cart.png?alt=media&token=f6cb50e1-b111-463e-8197-4eca147924a1" alt="Cart" className="cart-icon" />
                        <span className="cart-count">{cart.length}</span>
                    </a>
        </header>
    )
}

export default Header
