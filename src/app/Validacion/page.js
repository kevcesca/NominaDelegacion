'use client'
import React from 'react';
import ComparativeTable from '../%Components/ComparativeTable/ComparativeTable';
import ComparativeTable2 from '../%Components/ComparativeTable/ComparativeTable2';

import styles from './page.module.css';
import Link from 'next/link';
import { Button } from '@mui/material';

export default function Validacion() {
    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Validación de registros base vs post base</h1>
            <div className={styles.tableContainer}>
                <ComparativeTable />
                <h2 className={styles.table2}>Tabla 2</h2>
                <ComparativeTable2 />
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendColor} ${styles.noCoinciden}`}></span>
                    No coinciden los valores de líquido VS post
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendColor} ${styles.cambioCuenta}`}></span>
                    Cambió el número de cuenta
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendColor} ${styles.incompleto}`}></span>
                    No se encuentran los registros completos
                </div>
            </div>
            <Link href={`/CrearNomina/ProcesarDatos`} passHref>
                <Button variant="contained" color="primary" className={styles.exportButton}>
                    Válidar datos
                </Button>
            </Link>
        </main>
    );
}
