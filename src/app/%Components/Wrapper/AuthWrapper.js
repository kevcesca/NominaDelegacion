'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Wrapper from './Wrapper';
import Login from '../../Login/page';
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
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const publicRoutes = ['/RecuperarContra', '/Registrarse', '/login'];

    if (!mounted) {
        return null; // O muestra un cargando, si prefieres
    }

    if (!isLoggedIn && !publicRoutes.includes(router.pathname)) {
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