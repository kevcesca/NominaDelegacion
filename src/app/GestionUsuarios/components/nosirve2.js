// src/pages/components/Actions.js
import React from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import styles from '../page.module.css';

export default function Actions({ handleAddUser }) {
    return (
        <div className={styles.buttonContainer}>
            <button className={styles.uploadButton}>
                <UploadFileIcon className={styles.uploadIcon} /> Cargar
            </button>
            <button className={styles.addButton} onClick={handleAddUser}>
                <PersonAddIcon className={styles.addIcon} /> Añadir Usuario
            </button>
        </div>
    );
}
