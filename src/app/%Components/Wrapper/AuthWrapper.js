'use client';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Wrapper from './Wrapper';
import Login from '../Login/Login';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#4389a9',
            main: '#146C94',
            dark: '#0e4b67',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#AFD3E2',
            dark: '#7a939e',
            contrastText: '#000',
        },
    },
});

const AuthWrapper = ({ children }) => {
    const { isLoggedIn } = useAuth();

    return (
        <ThemeProvider theme={theme}>
            {isLoggedIn ? (
                <Wrapper>
                    {children}
                </Wrapper>
            ) : (
                <Login />
            )}
        </ThemeProvider>
    );
};

export default AuthWrapper;