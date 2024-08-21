'use client';

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Tablas.module.css';

export default function Totales({ resumenData, anio, quincena }) {
    // Limpieza de los datos
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

    // Separar los datos normales de los totales
    const datosLimpios = limpiarDatos(resumenData);
    const datosNormales = datosLimpios.filter(item => item.BANCO !== 'Total');
    const datosTotales = datosLimpios.filter(item => item.BANCO === 'Total');

    const chequesTemplate = (rowData) => {
        return <span className={styles.boldText}>{rowData.NOMINA}</span>;
    };

    const currencyTemplate = (rowData, field) => {
        return rowData[field].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className={`card ${styles.card}`}>
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className={styles.header}>TOTALES (QNA {quincena}/{anio})</h2>
            </div>
            
            {/* Tabla de datos normales */}
            <DataTable value={datosNormales} paginator={false} rows={10} className="p-datatable-sm">
                <Column field="ANIO" header="AÑO" sortable></Column>
                <Column field="QUINCENA" header="QUINCENA" sortable></Column>
                <Column field="NOMINA" header="CHEQUES" sortable body={chequesTemplate}></Column>
                <Column field="BANCO" header="BANCO" sortable></Column>
                <Column field="PERCEPCIONES" header="PERCEPCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'PERCEPCIONES')}></Column>
                <Column field="DEDUCCIONES" header="DEDUCCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'DEDUCCIONES')}></Column>
                <Column field="LIQUIDO" header="IMPORTE LÍQUIDO" sortable body={(rowData) => currencyTemplate(rowData, 'LIQUIDO')}></Column>
                <Column field="EMPLEADOS" header="EMPLEADOS" sortable></Column>
            </DataTable>
            
            {/* Separador */}
            <hr className={styles.separador} />

            {/* Tabla de datos totales */}
            <div className={styles.totalTable}>
                <DataTable value={datosTotales} paginator={false} rows={10} className="p-datatable-sm">
                    <Column field="ANIO" header="AÑO" sortable></Column>
                    <Column field="QUINCENA" header="QUINCENA" sortable></Column>
                    <Column field="NOMINA" header="CHEQUES" sortable body={chequesTemplate}></Column>
                    <Column field="BANCO" header="BANCO" sortable></Column>
                    <Column field="PERCEPCIONES" header="PERCEPCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'PERCEPCIONES')}></Column>
                    <Column field="DEDUCCIONES" header="DEDUCCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'DEDUCCIONES')}></Column>
                    <Column field="LIQUIDO" header="IMPORTE LÍQUIDO" sortable body={(rowData) => currencyTemplate(rowData, 'LIQUIDO')}></Column>
                    <Column field="EMPLEADOS" header="EMPLEADOS" sortable></Column>
                </DataTable>
            </div>
        </div>
    );
}
