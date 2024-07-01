// src/app/CargarDatos/page.js
'use client'
import React, { useState } from 'react';
import styles from './page.module.css';
import TablaPostNomina from '../%Components/TablaPostNomina/TablaPostNomina';
import TablaResumenNomina from '../%Components/TablaResumenNomina/TablaResumenNomina';
import { ProgressBar } from 'primereact/progressbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CargarDatos() {
    const [quincena, setQuincena] = useState('01');
    const [fecha, setFecha] = useState(new Date());
    const [progressPostNomina, setProgressPostNomina] = useState(0);
    const [progressResumenNomina, setProgressResumenNomina] = useState(0);

    const handleDateChange = (date) => {
        setFecha(date);
    };

    const handleFileUploadPostNomina = () => {
        setProgressPostNomina(0);
        setTimeout(() => {
            let progressInterval = setInterval(() => {
                setProgressPostNomina((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prevProgress + 10;
                });
            }, 300);
        }, 100);
    };

    const handleFileUploadResumenNomina = () => {
        setProgressResumenNomina(0);
        setTimeout(() => {
            let progressInterval = setInterval(() => {
                setProgressResumenNomina((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prevProgress + 10;
                });
            }, 300);
        }, 100);
    };

    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Resumen de carga de datos</h1>
            <div className={styles.selectorContainer}>
                <select value={quincena} onChange={(e) => setQuincena(e.target.value)}>
                    {[...Array(24).keys()].map(n => (
                        <option key={n + 1} value={(n + 1).toString().padStart(2, '0')}>Quincena {(n + 1).toString().padStart(2, '0')}</option>
                    ))}
                </select>
                <DatePicker selected={fecha} onChange={handleDateChange} dateFormat="dd-MM-yyyy" className={styles.datePicker} portalId="root-portal" />
            </div>
            <h2 className={styles.h2}>Post Nomina</h2>
            <div className={styles.progressContainer}>
                <p>Progreso de datos</p>
                <ProgressBar value={progressPostNomina} className={styles.progressBar} />
            </div>
            <input type="file" onChange={handleFileUploadPostNomina} className={styles.uploadButton} />
            <TablaPostNomina />
            <h2 className={styles.h2}>Resumen de Nomina</h2>
            <div className={styles.progressContainer}>
                <ProgressBar value={progressResumenNomina} className={styles.progressBar} />
            </div>
            <input type="file" onChange={handleFileUploadResumenNomina} className={styles.uploadButton} />
            <TablaResumenNomina />
            <div className={styles.buttonContainer}>
                <button className={styles.exportButton}>
                    Procesar datos
                </button>
            </div>
        </main>
    );
}