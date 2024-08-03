// src/app/CrearNomina/page.js

'use client'

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';
import ComparativaTable from '../%Components/TablaAceptacion/TablaAceptacion'; // Asegúrate de tener la ruta correcta
import styles from './page.module.css';

const Comparativa = () => {
    const { data: session } = useSession();

    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Comparativa de Datos</h1>
            {session && <ComparativaTable />}
            <ToastContainer />
        </main>
    );
};

export default Comparativa;
