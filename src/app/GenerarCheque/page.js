'use client'
import React from 'react';
import ComparativeTable from '../%Components/ComparativeTable/ComparativeTable';
import ComparativeTable2 from '../%Components/ComparativeTable/ComparativeTable2';
import Cheque from '../%Components/Cheque/Cheque'

import styles from './page.module.css';

export default function GenerarCheque() {
    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Generar cheque</h1>
            <Cheque
                polizaNo="5360"
                noDe="108345"
                noEmpleado="1168954"
                nombreBeneficiario="Juan Perez"
                importeLetra="DOS MIL NOVECIENTOS CINCUENTA Y OCHO PESOS 35/100 M.N."
                conceptoPago="2da. Qna. Abril 2024"
                rfc="VALP"
                tipoNomina="1"
                percepciones="3463.93"
                deducciones="505.58"
                liquido="2958.35"
                nombre="Juan Perez"
                fecha="15/04/2024"
            />

            <Cheque
                polizaNo="5360"
                noDe="108345"
                noEmpleado="1168954"
                nombreBeneficiario="Juan Perez"
                importeLetra="DOS MIL NOVECIENTOS CINCUENTA Y OCHO PESOS 35/100 M.N."
                conceptoPago="2da. Qna. Abril 2024"
                rfc="VALP"
                tipoNomina="1"
                percepciones="3463.93"
                deducciones="505.58"
                liquido="2958.35"
                nombre="Fidel Perez"
                fecha="15/04/2024"
            />
        </main>
    );
}
