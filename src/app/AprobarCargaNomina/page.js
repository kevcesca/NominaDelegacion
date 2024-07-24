'use client'

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChequesResumen from '../%Components/TablasComparativasNomina/ChequesResumen';
import DepositoResumen from '../%Components/TablasComparativasNomina/DepositoResumen';
import styles from './page.module.css';

const Comparativa = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleConfirm = () => {
        const confirmed = window.confirm("¿Son correctos los datos?");
        if (confirmed) {
            setIsConfirmed(true);
            toast.success("Datos guardados correctamente");
        }
    };

    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Comparativa de Datos</h1>
            <div className={styles.grid}>
                <div className={styles.gridItem1}><ChequesResumen /></div>
                <div className={styles.gridItem1}><DepositoResumen /></div>
            </div>
            <button className={styles.button} onClick={handleConfirm}>Confirmar Datos</button>
            <ToastContainer />
        </main>
    );
};

export default Comparativa;
