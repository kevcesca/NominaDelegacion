'use client'
import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import TablaPostNomina from '../%Components/TablaPostNomina/TablaPostNomina'; // Asegúrate de que la ruta sea correcta

export default function CargarDatos() {
    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Resumen de carga de datos</h1>
            <TablaPostNomina />
            <div className={styles.buttonContainer}>
                <button className={styles.exportButton}>
                    <i className="pi pi-download"></i> Exportar
                </button>
            </div>
        </main>
    );
}
