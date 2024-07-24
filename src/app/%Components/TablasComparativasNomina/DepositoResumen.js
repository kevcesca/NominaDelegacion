"use client"

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Tablas.module.css';

export default function DepositoResumen() {
    const resumenData = [
        { tipoNomina: 'ESTRUCTURA', bruto: 3563493.50, deducciones: 93539.68, neto: 262809.82, empleados: 18 },
        { tipoNomina: 'ESTRUCTURA(SPEI)', bruto: 4618518.46, deducciones: 1356652.16, neto: 3261866.30, empleados: 521 },
        { tipoNomina: 'BASE', bruto: 125772.35, deducciones: 20290.50, neto: 105481.85, empleados: 31 },
        { tipoNomina: 'NOM. 8', bruto: 5100640.31, deducciones: 1470482.34, neto: 3630157.97, empleados: 570 },
        { tipoNomina: 'TOTAL', bruto: 5100640.31, deducciones: 1470482.34, neto: 3630157.97, empleados: 570 },
    ];

    const tipoNominaTemplate = (rowData) => {
        return <span className={styles.boldText}>{rowData.tipoNomina}</span>;
    };

    return (
        <div className={`card ${styles.card}`}>
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className={styles.header}>DEPOSITO RESUMEN (QNA 06/2024)</h2>
            </div>
            <DataTable value={resumenData} paginator={false} rows={10} className="p-datatable-sm">
                <Column field="tipoNomina" header="TIPO NOMINA" sortable body={tipoNominaTemplate}></Column>
                <Column field="bruto" header="BRUTO" sortable body={data => data.bruto.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                <Column field="deducciones" header="DEDUCCIONES" sortable body={data => data.deducciones.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                <Column field="neto" header="NETO" sortable body={data => data.neto.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                <Column field="empleados" header="EMPLEADOS" sortable></Column>
            </DataTable>
        </div>
    );
}
