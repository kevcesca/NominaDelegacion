import React from 'react';
import styles from './page.module.css';
import ChequesResumen from '../../%Components/TablasComparativasNomina/ChequesResumen';
import Retensiones from '../../%Components/TablasComparativasNomina/Retensiones'
import DepositoResumen from '../../%Components/TablasComparativasNomina/DepositoResumen'
import RetensionesDeposito from '../../%Components/TablasComparativasNomina/RetensionesDeposito'
import Totales from '../../%Components/TablasComparativasNomina/Totales'
import ImporteLiquido from '../../%Components/TablasComparativasNomina/ImporteLiquido'

export default function CargarDatos() {
    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Procesar datos</h1>
            <ChequesResumen/>
            <Retensiones/>
            <DepositoResumen/>
            <RetensionesDeposito/>
            <Totales/>
            <ImporteLiquido/>
        </main>
    );
}
