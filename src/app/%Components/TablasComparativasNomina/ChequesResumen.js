'use client';

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Tablas.module.css';

export default function ChequesResumen({ resumenData, anio, quincena }) {
    // Limpia los datos para asegurar que las claves coincidan y elimina espacios en blanco
    const limpiarDatos = (data) => {
        return data.map(item => ({
            ANIO: item.ANIO.trim(),
            QUINCENA: item.QUINCENA.trim(),
            NOMINA: item.nomina.trim(),
            BANCO: item.banco.trim(),
            PERCEPCIONES: parseFloat(item.PERCEPCIONES.trim().replace(/,/g, '')),
            DEDUCCIONES: parseFloat(item.DEDUCCIONES.trim().replace(/,/g, '')),
            LIQUIDO: parseFloat(item.LIQUIDO.trim().replace(/,/g, '')),
            EMPLEADOS: parseInt(item.empleados.trim(), 10)
        }));
    };

    // Limpia los datos recibidos
    const chequesData = limpiarDatos(resumenData.slice(0, resumenData.findIndex(data => !data.ANIO)));

    const tipoNominaTemplate = (rowData) => {
        return <span className={styles.boldText}>{rowData.NOMINA}</span>;
    };

    const currencyTemplate = (rowData, field) => {
        return rowData[field].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className={`card ${styles.card}`}>
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className={styles.header}>CHEQUES RESUMEN (QNA {quincena}/{anio})</h2>
            </div>
            <DataTable value={chequesData} paginator={false} rows={10} className="p-datatable-sm">
                <Column field="ANIO" header="AÑO" sortable></Column>
                <Column field="QUINCENA" header="QUINCENA" sortable></Column>
                <Column field="NOMINA" header="NOMINA" sortable body={tipoNominaTemplate}></Column>
                <Column field="BANCO" header="BANCO" sortable></Column>
                <Column field="PERCEPCIONES" header="PERCEPCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'PERCEPCIONES')}></Column>
                <Column field="DEDUCCIONES" header="DEDUCCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'DEDUCCIONES')}></Column>
                <Column field="LIQUIDO" header="LIQUIDO" sortable body={(rowData) => currencyTemplate(rowData, 'LIQUIDO')}></Column>
                <Column field="EMPLEADOS" header="EMPLEADOS" sortable></Column>
            </DataTable>
        </div>
    );
}
