// src/app/%Components/Wrapper/AuthWrapper.js

'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
    const { data: session, status } = useSession();
    const router = useRouter();

    const publicRoutes = ['/RecuperarContra', '/Registrarse'];

    if (status === 'loading') {
        return <div>Loading...</div>; // O un spinner de carga, si prefieres
    }

    if (!session && !publicRoutes.includes(router.pathname)) {
        return (
            <ThemeProvider theme={theme}>
                <Login />
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Wrapper>
                {children}
            </Wrapper>
        </ThemeProvider>
    );
};

export default AuthWrapper;
