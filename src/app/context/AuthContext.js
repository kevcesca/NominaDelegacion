'use client';
// src/app/context/AuthContext.js

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const login = () => {
        setIsLoggedIn(true);
        localStorage.setItem('authToken', 'dummy_token'); // Simulate a token
        router.push('/');
    };

    const logout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('authToken');
        router.push('/RecuperarContra');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
