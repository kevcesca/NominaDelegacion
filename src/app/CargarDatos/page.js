// src/app/page.js
'use client'
import React, { useState } from 'react';
import styles from './page.module.css';
import TablaPostNomina from '../%Components/TablaPostNomina/TablaPostNomina'
import TablaResumenNomina from '../%Components/TablaResumenNomina/TablaResumenNomina';
import { ProgressBar } from 'primereact/progressbar';

export default function CargarDatos() {
    const [quincena, setQuincena] = useState('01');
    const [fecha, setFecha] = useState('01-01-2024');

    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Resumen de carga de datos</h1>
            <div className={styles.selectorContainer}>
                <button onClick={() => setQuincena('06')}>Quincena 06</button>
                <button onClick={() => setFecha('12-04-2024')}>Fecha 12-04-2024</button>
            </div>
            <div className={styles.progressContainer}>
                <h2>Progreso de datos</h2>
                <ProgressBar progress={35} />
            </div>
            <TablaPostNomina />
            <TablaResumenNomina />
            <div className={styles.buttonContainer}>
                <button className={styles.exportButton}>
                    <i className="pi pi-download"></i> Exportar
                </button>
            </div>
        </main>
    );
}