'use client';
// src/app/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_USERS_URL } from '../%Config/apiConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Control de carga inicial
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async (retryCount = 3, delay = 1000) => {
            let attempts = 0;
    
            const attemptVerification = async () => {
                try {
                    console.log(`Intentando verificar token... Intento ${attempts + 1}`);
                    const response = await fetch(`${API_USERS_URL}/verify-token`, {
                        method: 'GET',
                        credentials: 'include',
                    });
    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Usuario autenticado:', data.user);
                        setUser(data.user); // Asegúrate de que `data.user` contiene el `id_empleado`
                        setIsAuthenticated(true);
                        setIsLoading(false); // Finaliza la carga si es exitoso
                        return;
                    } else {
                        console.warn('Token inválido o no autenticado');
                        attempts++;
                        if (attempts < retryCount) {
                            console.log(`Reintentando en ${delay} ms...`);
                            setTimeout(attemptVerification, delay);
                        } else {
                            setUser(null);
                            setIsAuthenticated(false);
                            setIsLoading(false); // Finaliza la carga después de los reintentos
                        }
                    }
                } catch (error) {
                    console.error('Error al verificar el token:', error);
                    attempts++;
                    if (attempts < retryCount) {
                        console.log(`Reintentando en ${delay} ms...`);
                        setTimeout(attemptVerification, delay);
                    } else {
                        setUser(null);
                        setIsAuthenticated(false);
                        setIsLoading(false); // Finaliza la carga después de los reintentos
                    }
                }
            };
    
            attemptVerification();
        };
    
        checkAuth(); // Inicia el proceso de verificación con reintentos
    }, []);
    
    const login = (userData) => {
        setUser(userData);  // Guarda el usuario en el contexto
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await fetch(`${API_USERS_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        setUser(null);
        setIsAuthenticated(false);
        router.push('/');
    };

    // Nueva función para verificar la contraseña del empleado
    const checkPasswordForEmployee = async (idEmpleado) => {
        try {
            const response = await fetch(`${API_USERS_URL}/check-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_empleado: idEmpleado,
                    password: 'Azcapotzalco1!',  // Suponiendo que esta es la contraseña a verificar
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Contraseña verificada correctamente:', data.message);
                return true;
            } else {
                console.error('Error al verificar la contraseña:', data.message);
                return false;
            }
        } catch (error) {
            console.error('Error en la verificación de la contraseña:', error);
            return false;
        }
    };

    // Mostrar un indicador de carga mientras se verifica el estado de autenticación
    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setUser: login, logout, checkPasswordForEmployee }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
