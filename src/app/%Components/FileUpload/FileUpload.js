// src/app/%Components/FileUpload/FileUpload.js
'use client';
import React, { useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import styles from './FileUpload.module.css';

export default function FileUpload({ onFileUpload }) {
    const [progress, setProgress] = useState(0);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            onFileUpload(file);
            setProgress(0);

            // Simular el progreso de carga
            const interval = setInterval(() => {
                setProgress(prevProgress => {
                    if (prevProgress >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prevProgress + 2;
                });
            }, 10); // Ajusta el intervalo para una carga más rápida
        }
    };

    return (
        <div className={styles.fileUploadContainer}>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className={styles.uploadButton} />
            <div className={styles.progressContainer}>
                <ProgressBar className={styles.progressBar} value={progress} displayValueTemplate={(value) => `${value}%`} />
            </div>
        </div>
    );
}
