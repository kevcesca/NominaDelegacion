'use client'
import React from 'react';
import styles from './page.module.css';
import UploadForm from '../%Components/UploadForm/UploadForm';

export default function CargarDatos() {
    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Subir una evidencia</h1>
            <UploadForm />
        </main>
    );
}
