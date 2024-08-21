'use client';

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Tablas.module.css';

export default function DepositoResumen({ resumenData, anio, quincena }) {
    // Limpia los datos para eliminar espacios en blanco y asegurar que las claves coincidan
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
    const depositoData = limpiarDatos(resumenData);

    const tipoNominaTemplate = (rowData) => {
        return <span className={styles.boldText}>{rowData.NOMINA}</span>;
    };

    const currencyTemplate = (rowData, field) => {
        return rowData[field].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className={`card ${styles.card}`}>
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className={styles.header}>DEPOSITO RESUMEN (QNA {quincena}/{anio})</h2>
            </div>
            <DataTable value={depositoData} paginator={false} rows={10} className="p-datatable-sm">
                <Column field="ANIO" header="AÑO" sortable></Column>
                <Column field="QUINCENA" header="QUINCENA" sortable></Column>
                <Column field="NOMINA" header="NOMINA" sortable body={tipoNominaTemplate}></Column>
                <Column field="BANCO" header="BANCO" sortable></Column>
                <Column field="PERCEPCIONES" header="BRUTO" sortable body={(rowData) => currencyTemplate(rowData, 'PERCEPCIONES')}></Column>
                <Column field="DEDUCCIONES" header="DEDUCCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'DEDUCCIONES')}></Column>
                <Column field="LIQUIDO" header="NETO" sortable body={(rowData) => currencyTemplate(rowData, 'LIQUIDO')}></Column>
                <Column field="EMPLEADOS" header="EMPLEADOS" sortable></Column>
            </DataTable>
        </div>
    );
}
