import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { localhost } from '../services/server';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({
        // GetItem để khởi tạo giá trị ban đầu
        token: localStorage.getItem('AT'),
        refreshToken: localStorage.getItem('RT'),
        isAuthenticated: !!localStorage.getItem('AT') && !!localStorage.getItem('RT')
    });

    // Check Access token expiry
    const isTokenExpired = (token) => {
        if (!token) return true;

        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decoded.exp < currentTime;
    }

    // Refresh token
    const refreshAuthToken = async (token, refreshToken) => {
        const response = await fetch(`${localhost}/api/v1/Authentication/RefreshToken`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                token: token,
                refreshToken: refreshToken
            })
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();

        return data;
    }

    const checkAndRefreshToken = async () => {
        if (isTokenExpired(auth.token)) {
            try {
                const data = await refreshAuthToken(auth.token, auth.refreshToken);
                console.log(data);
                setAuth({
                    token: data.token,
                    refreshToken: data.refreshToken,
                    isAuthenticated: true
                });
            } catch (error) {
                console.log(`${error} CON CAC`);

                setAuth({
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false
                });
            }
        }
    }

    useEffect(() => {
        const intervalId = setInterval(checkAndRefreshToken, 25 * 60 * 1000); // Check every 25 minutes

        if (auth.token) {
            localStorage.setItem('AT', auth.token);
            localStorage.setItem('RT', auth.refreshToken);
        }
        else {
            localStorage.removeItem('AT');
            localStorage.removeItem('RT');
        }

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [auth.token, auth.refreshToken])

    

    const logOut = () => {
        localStorage.removeItem('AT');
        localStorage.removeItem('RT');
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider
