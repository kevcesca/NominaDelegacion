// src/app/%Components/Wrapper/AuthWrapper.js
'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import Wrapper from './Wrapper';
import Login from '../Login/Login';
import Registrarse from '../Registrarse/Registrarse';
import RecuperarContra from '../RecuperarContra/RecuperarContra';
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
    const { data: session, status } = useSession();
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

    console.log("Session:", session);
    console.log("Pathname:", pathname);

    const publicRoutes = ['/RecuperarContra', '/Registrarse', '/Login'];

    if (status === 'loading') {
        return <div>Loading...</div>; // O un spinner de carga, si prefieres
    }

    if (!session) {
        switch (pathname) {
            case '/Registrarse':
                return (
                    <ThemeProvider theme={theme}>
                        <Registrarse />
                    </ThemeProvider>
                );
            case '/RecuperarContra':
                return (
                    <ThemeProvider theme={theme}>
                        <RecuperarContra />
                    </ThemeProvider>
                );
            case '/Login':
                return (
                    <ThemeProvider theme={theme}>
                        <Login />
                    </ThemeProvider>
                );
            default:
                return (
                    <ThemeProvider theme={theme}>
                        <Login />
                    </ThemeProvider>
                );
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Wrapper session={session}>
                {children}
            </Wrapper>
        </ThemeProvider>
    );
};

export default AuthWrapper;
