"use client"

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Tablas.module.css';

export default function Totales({ totalesData }) {
    const chequesTemplate = (rowData) => {
        return <span className={styles.boldText}>{rowData.cheques}</span>;
    };

    return (
        <div className={`card ${styles.card}`}>
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className={styles.header}>TOTALES</h2>
            </div>
            <DataTable value={totalesData} paginator={false} rows={10} className="p-datatable-sm">
                <Column field="cheques" header="CHEQUES" sortable body={chequesTemplate}></Column>
                <Column field="percepciones" header="PERCEPCIONES" sortable body={data => data.percepciones.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                <Column field="deducciones" header="DEDUCCIONES" sortable body={data => data.deducciones.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                <Column field="importeLiquido" header="IMPORTE LIQUIDO" sortable body={data => data.importeLiquido.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                <Column field="empleados" header="EMPLEADOS" sortable></Column>
            </DataTable>
        </div>
    );
}
