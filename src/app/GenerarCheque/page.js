'use client'
import React from 'react';
import TablaEmpleados from '../%Components/Cheque/TablaEmpleados';

import styles from './page.module.css';

export default function GenerarCheque() {
    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Generar cheque</h1>
            <TablaEmpleados />
        </main>
    );
}
