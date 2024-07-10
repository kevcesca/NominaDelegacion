// src/app/%Components/ProtectedRoute/ProtectedRoute.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const publicRoutes = ['/login', '/RecuperarContra', '/Registrarse'];

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const isPublicRoute = publicRoutes.includes(router.pathname);
        console.log(router.pathname)

        if (!isLoggedIn && !isPublicRoute) {
            router.push('/login');
        }
        if (isLoggedIn && isPublicRoute) {
            router.push('/');
        }
    }, [isLoggedIn, router]);

    const isPublicRoute = publicRoutes.includes(router.pathname);
    if (!isLoggedIn && !isPublicRoute) {
        return null; // O muestra un cargador
    }

    return children;
};

export default ProtectedRoute;
