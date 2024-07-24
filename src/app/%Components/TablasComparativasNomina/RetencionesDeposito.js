"use client"

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Tablas.module.css';

export default function RetencionesDeposito() {
    const retencionesData = [
        { empleado: 0, retenciones: '-', totalReal: 2033707.98 },
        { empleado: 0, retenciones: '-', totalReal: 234699.23 },
        { empleado: 12, retenciones: 55759.84, totalReal: 18305527.56 },
        { empleado: 14, retenciones: 41855.83, totalReal: 2892475.08 },
        { empleado: 28, retenciones: 104119.51, totalReal: 27090063.98 }
    ];

    const empleadoTemplate = (rowData) => {
        return <span className={styles.boldText}>{rowData.empleado}</span>;
    };

    const totalRealTemplate = (rowData) => {
        return <span className={styles.boldText}>{rowData.totalReal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>;
    };

    return (
        <div className={`card ${styles.card}`}>
            <div className="flex justify-content-between align-items-center mb-4 mt-4">
                <h2 className={styles.header} >RETENCIONES</h2>
            </div>
            <DataTable value={retencionesData} paginator={false} rows={10} className="p-datatable-sm">
                <Column field="empleado" header="EMPL." sortable body={empleadoTemplate}></Column>
                <Column field="retenciones" header="RETENCIONES" sortable body={data => data.retenciones.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                <Column field="totalReal" header="TOTAL REAL" sortable body={totalRealTemplate}></Column>
            </DataTable>
        </div>
    );
}
