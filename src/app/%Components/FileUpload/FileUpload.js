// src/components/FileUpload/FileUpload.js
import React, { useState } from 'react';
import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './FileUpload.module.css';

export default function FileUpload({ onFileUpload }) {
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Simular carga de archivo
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        onFileUpload(file);
                        return 0;
                    }
                    return prev + 10;
                });
            }, 100);
        }
    };

    return (
        <div className={styles.fileUploadContainer}>
            <input type="file" onChange={handleFileChange} />
            <ProgressBar progress={progress} />
        </div>
    );
}
