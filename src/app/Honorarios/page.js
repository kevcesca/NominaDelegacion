'use client'
import React from 'react';
import styles from './page.module.css';
import UploadForm from '../%Components/HonorariosTable/HonorariosTable';

export default function CargarDatos() {
    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Honorarios</h1>
            <UploadForm />
        </main>
    );
}
