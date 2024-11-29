'use client';
// src/app/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Ya no necesitas cargar el estado
    const router = useRouter();

    // Simulamos que el usuario está autenticado automáticamente
    useEffect(() => {
        setIsAuthenticated(false);  // Mantenemos como no autenticado al principio
        setIsLoading(false);       // No necesitamos más control de carga
    }, []);

    const login = (userData) => {
        setUser(userData);  // Establece al usuario en el contexto
        setIsAuthenticated(true); // Marca al usuario como autenticado
    };

    const logout = () => {
        setUser(null); // Borra el usuario
        setIsAuthenticated(false); // Marca como no autenticado
        router.push('/'); // Redirige al inicio
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
