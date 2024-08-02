'use client';

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Tablas.module.css';

export default function DepositoResumen({ resumenData, anio, quincena }) {
    const start = resumenData.findIndex(data => !data.ANIO) + 1;
    const end = resumenData.findIndex((data, index) => index > start && !data.ANIO);
    const depositoData = resumenData.slice(start, end);

    const tipoNominaTemplate = (rowData) => {
        return <span className={styles.boldText}>{rowData.NOMINA}</span>;
    };

    return (
        <div className={`card ${styles.card}`}>
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className={styles.header}>DEPOSITO RESUMEN (QNA {quincena}/{anio})</h2>
            </div>
            <DataTable value={depositoData} paginator={false} rows={10} className="p-datatable-sm">
                <Column field="ANIO" header="ANIO" sortable></Column>
                <Column field="QUINCENA" header="QUINCENA" sortable></Column>
                <Column field="NOMINA" header="NOMINA" sortable body={tipoNominaTemplate}></Column>
                <Column field="BANCO" header="BANCO" sortable></Column>
                <Column field="PERCEPCIONES" header="BRUTO" sortable body={data => parseFloat(data.PERCEPCIONES ? data.PERCEPCIONES.replace(/,/g, '') : 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                <Column field="DEDUCCIONES" header="DEDUCCIONES" sortable body={data => parseFloat(data.DEDUCCIONES ? data.DEDUCCIONES.replace(/,/g, '') : 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                <Column field="LIQUIDO" header="NETO" sortable body={data => parseFloat(data.LIQUIDO ? data.LIQUIDO.replace(/,/g, '') : 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                <Column field="EMPLEADOS" header="EMPLEADOS" sortable></Column>
            </DataTable>
        </div>
    );
}
