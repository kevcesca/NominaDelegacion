"use client"

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Tablas.module.css';

export default function Retensiones() {
    const retensionesData = [
        { empleado: 0, retensiones: '-', totalReal: 262809.82 },
        { empleado: 1, retensiones: 3489.39, totalReal: 3258376.91 },
        { empleado: 1, retensiones: 3014.45, totalReal: 102467.40 },
        { empleado: 'TOTAL', retensiones: '3,623,654.13', totalReal: '3,623,654.13' }
    ];

    const empleadoTemplate = (rowData) => {
        return <span className={styles.boldText}>{rowData.empleado}</span>;
    };

    return (
        <div className={`card ${styles.card}`}>
            <div className="flex justify-content-between align-items-center mb-4 mt-4">
                <h2 className={styles.header}>RETENSIONES</h2>
            </div>
            <DataTable value={retensionesData} paginator={false} rows={10} className="p-datatable-sm">
                <Column field="empleado" header="EMPL." sortable body={empleadoTemplate}></Column>
                <Column field="retensiones" header="RETENSIONES" sortable body={data => data.retensiones.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                <Column field="totalReal" header="TOTAL REAL" sortable body={data => data.totalReal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
            </DataTable>
        </div>
    );
}
