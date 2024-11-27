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
        const checkAuth = async (retryCount = 3, delay = 3000) => {
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
                        setUser(data.user);
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
        setUser(userData);
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

    // Mostrar un indicador de carga mientras se verifica el estado de autenticación
    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setUser: login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
