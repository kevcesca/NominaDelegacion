'use client';
import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../$tema/theme';  // Asegúrate de que la ruta es correcta

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
