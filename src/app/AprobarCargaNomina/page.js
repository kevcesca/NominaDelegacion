// src/app/CrearNomina/page.js

'use client'

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ComparativaTable from '../%Components/TablaAceptacion/TablaAceptacion';
import styles from './page.module.css';

const Comparativa = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleConfirm = () => {
        const confirmed = window.confirm("¿Son correctos los datos?");
        if (confirmed) {
            setIsConfirmed(true);
            toast.success("Datos guardados correctamente");
            // Aquí puedes añadir lógica adicional para actualizar el estado de aprobado/cancelado
        }
    };

    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Comparativa de Datos</h1>
            <ComparativaTable />
            <button className={styles.button} onClick={handleConfirm}>Confirmar Datos</button>
            <ToastContainer />
        </main>
    );
};

export default Comparativa;
