'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TabMenu } from 'primereact/tabmenu';
import styles from './AppBar.module.css';
import Image from 'next/image';

export default function AppBar() {
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();

    const items = [
        { label: 'Inicio', icon: 'pi pi-home', command: () => router.push('/') },
        { label: 'Mi Cuenta', icon: 'pi pi-user', command: () => router.push('/Perfil') },
        { label: 'Crear Nomina', icon: 'pi pi-chart-line', command: () => router.push('/CrearNomina') },

    ];

    useEffect(() => {
        if (!router.isReady) return;
        // Establecer el índice activo basado en la ruta actual
        switch (router.pathname) {
            case '/':
                setActiveIndex(0);
                break;
            case '/Perfil':
                setActiveIndex(1);
                break;
            case '/CrearNomina':
                setActiveIndex(2);
                break;
            default:
                setActiveIndex(0);
        }
    }, [router.isReady, router.pathname]);

    return (
            <div>
                <div className={styles.navbar}><Image src="logo" alt="Logotipo Alcaldia Azcapotzalco" width={1000} height={500} className={styles.image} /></div>
                
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
