// src/components/AuthGuard.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const AuthGuard = ({ children, publicRoutes }) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user && !publicRoutes.includes(router.pathname)) {
            router.push('/login');
        }
        if (user && publicRoutes.includes(router.pathname)) {
            router.push('/');
        }
    }, [user, router, publicRoutes]);

    if (!user && !publicRoutes.includes(router.pathname)) {
        return null; // O muestra un cargador
    }

    return children;
};

export default AuthGuard;
