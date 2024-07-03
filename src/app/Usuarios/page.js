'use client'
import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import TablaUsuarios from '../%Components/TablaUsuarios/TablaUsuarios'; // Asegúrate de que la ruta sea correcta

export default function CrearNomina() {
    return (
        <main className={styles.main}>
            <div className={styles.buttonContainer}>
                <Link href="/Usuarios/CrearUsuario" passHref>
                    <button className={styles.createButton}>
                        <i className="pi pi-user-plus"></i> + Crear nuevo usuario
                    </button>
                </Link>
            </div>
            <TablaUsuarios />
            <div className={styles.buttonContainer}>
                <button className={styles.exportButton}>
                    <i className="pi pi-download"></i> Exportar
                </button>
            </div>
        </main>
    );
}
