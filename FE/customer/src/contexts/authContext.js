import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({
        // GetItem để khởi tạo giá trị ban đầu
        token: localStorage.getItem('AT'),
        refreshToken: localStorage.getItem('RT'),
        isAuthenticated: !!localStorage.getItem('AT') && !!localStorage.getItem('RT')
    });

    useEffect(() => {
        if (auth.token) {
            localStorage.setItem('AT', auth.token);
            localStorage.setItem('RT', auth.refreshToken);
        }
        else {
            localStorage.removeItem('AT');
            localStorage.removeItem('RT');
        }
    }, [auth.token, auth.refreshToken])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider
