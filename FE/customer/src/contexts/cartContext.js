import React, { createContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');

        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart])      // đối số [cart] -> mỗi khi [cart] thay đổi thì sẽ run `useEffect()`

    const addToCart = (court, sport, time) => {
        const updatedCart = [...cart, { court, sport, time }];
        setCart(updatedCart);
    }

    const removeFromCart = (court, time) => {
        const updatedCart = cart.filter(item => item.court.courtId !== court.courtId || item.time != time);
        setCart(updatedCart);
        toast.info("Remove successfully");
    }

    const isInCart = (courtId, time) => {
        return cart.some(item => item.court.courtId === courtId && item.time === time);;
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart }}>
            {children}
        </CartContext.Provider>
    )
}

