// src/app/%Components/Wrapper/AppBar.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';  // Importa el contexto de autenticación
import { TabMenu } from 'primereact/tabmenu';
import styles from './AppBar.module.css';
import Image from 'next/image';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Assessment from '@mui/icons-material/Assessment';

export default function AppBar() {
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const { logout } = useAuth();  // Usa la función logout del contexto

    const items = [
        { 
            label: 'Inicio', 
            icon: <HomeIcon />, 
            command: () => router.push('/') 
        },
        { 
            label: 'Nómina', 
            icon: <Assessment />, 
            command: () => router.push('/CrearNomina') 
        },
        { 
            label: 'Empleados', 
            icon: <GroupIcon />, 
            command: () => router.push('/Empleados') 
        },
        { 
            label: 'Cerrar Sesión', 
            icon: <ExitToAppIcon />, 
            command: () => logout()  // Llama a la función logout del contexto
        }
    ];

    useEffect(() => {
        if (!router.isReady) return;

        // Establecer el índice activo basado en la ruta actual
        switch (router.pathname) {
            case '/':
                setActiveIndex(0);
                break;
            case '/CrearNomina':
                setActiveIndex(1);
                break;
            case '/Empleados':
                setActiveIndex(2);
                break;
            case '/logout':
                setActiveIndex(3);
                break;
            default:
                setActiveIndex(0);
        }
    }, [router.isReady, router.pathname]);

    return (
        <div className={styles.appBarContainer}>
            <div className={styles.navbar}>
                <Image src="/logo.png" alt="Logotipo Alcaldia Azcapotzalco" width={1000} height={500} className={styles.image} />
            </div>
            <TabMenu 
                model={items} 
                activeIndex={activeIndex} 
                onTabChange={(e) => setActiveIndex(e.index)} 
                className={styles.customTabMenu}
                pt={{
                    menu: { className: styles.customTabMenuNav },
                    menuitem: { className: styles.customTabMenuItem },
                    action: { className: styles.customTabMenuItemLink }
                }}
            />
        </div>
    );
}
