// src/components/ProgressBar/ProgressBar.js
import React from 'react';
import styles from './ProgressBar.module.css';

export default function ProgressBar({ progress }) {
    return (
        <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}>
                {progress}%
            </div>
        </div>
    );
}
