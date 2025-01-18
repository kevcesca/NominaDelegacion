'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta si es necesario
import { useRouter } from 'next/navigation';

const PasswordCheckGuard = ({ children }) => {
    const { user, isAuthenticated, checkPasswordForEmployee } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkPassword = async () => {
            setIsLoading(true);
            if (isAuthenticated && user && user.id_empleado) {
                // checkPasswordForEmployee ahora devuelve true si la contraseña NO es la predeterminada
                const isDefaultPassword = await checkPasswordForEmployee(user.id_empleado);
                if (isDefaultPassword) {
                    // Si la contraseña es la predeterminada, permite el acceso
                    setIsLoading(false);
                } else {
                    // Si la contraseña no es la predeterminada, redirige
                    router.push('/'); // Cambia '/' por la ruta a la que quieres redirigir
                }
            } else if (!isAuthenticated) {
                // Si no está autenticado, redirige a la página de inicio de sesión o maneja según sea necesario
                router.push('/');
            } else {
                setIsLoading(false);
            }
        };

        checkPassword();
    }, [user, isAuthenticated, checkPasswordForEmployee, router]);

    if (isLoading) {
        return <div>Cargando...</div>; // O algún otro indicador de carga
    }

    return <>{children}</>;
};

export default PasswordCheckGuard;