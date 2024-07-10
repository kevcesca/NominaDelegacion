// src/%Components/ProtectedRoute/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import Wrapper from '../Wrapper/Wrapper'; // Asegúrate de ajustar la ruta si es necesario
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const router = useRouter();

    useIsomorphicLayoutEffect(() => {
        if (typeof window !== 'undefined' && !user && !['/login', '/creacuenta', '/cambiarcontra'].includes(router.pathname)) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user && !['/login', '/creacuenta', '/cambiarcontra'].includes(router.pathname)) {
        return null; // Muestra nada mientras redirige
    }

    if (['/login', '/creacuenta', '/cambiarcontra'].includes(router.pathname)) {
        return children; // No envuelve con el Wrapper en las páginas de autenticación
    }

    return <Wrapper>{children}</Wrapper>;
};

export default ProtectedRoute;