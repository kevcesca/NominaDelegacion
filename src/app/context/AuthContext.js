'use client';
// src/app/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Función para verificar si existe un token en las cookies
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:3001/verify-token', {
                    method: 'GET',
                    credentials: 'include', // Incluir cookies
                });
        
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user); // Aquí incluimos también "nombre_usuario"
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error al verificar la autenticación:", error);
                setUser(null);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await fetch('http://localhost:3001/logout', {
            method: 'POST',
            credentials: 'include'
        });

        setUser(null);
        setIsAuthenticated(false);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setUser: login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
