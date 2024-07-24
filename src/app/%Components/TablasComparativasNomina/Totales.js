"use client"

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Tablas.module.css';

export default function Totales() {
    const totalesData = [
        { cheques: 'ESTRUCTURA', percepciones: 3325486.00, deducciones: 794268.97, importeLiquido: 2531217.03, empleados: 187 },
        { cheques: 'BASE', percepciones: 30667317.21, deducciones: 9044163.51, importeLiquido: 21623153.70, empleados: 3664 },
        { cheques: 'NOM. 8', percepciones: 3682534.77, deducciones: 642722.01, importeLiquido: 3039812.76, empleados: 877 },
        { cheques: 'TOTAL', percepciones: 37675337.98, deducciones: 10481154.49, importeLiquido: 27194183.49, empleados: 4728 },
    ];

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
