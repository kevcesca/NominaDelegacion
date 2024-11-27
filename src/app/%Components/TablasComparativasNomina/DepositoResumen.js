'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Importamos useRouter
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Tablas.module.css';

export default function DepositoResumen({ resumenData, anio, quincena }) {
    const router = useRouter(); // Instancia de useRouter

    // Limpia los datos para eliminar espacios en blanco y asegurar que las claves coincidan
    const limpiarDatos = (data) => {
        return data.map((item) => ({
            ANIO: (item.ANIO || '').trim(),
            QUINCENA: (item.QUINCENA || '').trim(),
            NOMINA: (item.nomina || '').trim(),
            BANCO: (item.banco || '').trim(),
            PERCEPCIONES: parseFloat((item.PERCEPCIONES || '0').trim().replace(/,/g, '')),
            DEDUCCIONES: parseFloat((item.DEDUCCIONES || '0').trim().replace(/,/g, '')),
            LIQUIDO: parseFloat((item.LIQUIDO || '0').trim().replace(/,/g, '')),
            EMPLEADOS: parseInt((item.empleados || '0').trim(), 10),
        }));
    };

    // Depuración: detectar datos problemáticos
    const problematicItems = resumenData.filter((item) =>
        Object.values(item).some((value) => value === null || value === undefined)
    );
    if (problematicItems.length > 0) {
        console.warn('Datos problemáticos detectados:', problematicItems);
    }

    const depositoData = limpiarDatos(resumenData);
    const datosNormales = depositoData.filter((item) => item.BANCO !== 'Total');
    const datosTotales = depositoData.filter((item) => item.BANCO === 'Total');

    const handleEmpleadosClick = (rowData) => {
        const { ANIO, QUINCENA, NOMINA, BANCO } = rowData;
        router.push(`/CrearNomina/ProcesarDatos/DetalleEmpleados?anio=${ANIO}&quincena=${QUINCENA}&nomina=${NOMINA}&banco=${BANCO}`);
    };

    const tipoNominaTemplate = (rowData) => {
        return <span className={styles.boldText}>{rowData.NOMINA}</span>;
    };

    const currencyTemplate = (rowData, field) => {
        return rowData[field].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const empleadosTemplate = (rowData) => {
        return (
            <span
                className={styles.empleadosLink}
                onClick={() => handleEmpleadosClick(rowData)}
            >
                {rowData.EMPLEADOS}
            </span>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            {/* Tabla de datos normales */}
            <DataTable
                value={datosNormales}
                paginator={false}
                rows={10}
            >
                <Column field="ANIO" header="AÑO" sortable></Column>
                <Column field="QUINCENA" header="QUINCENA" sortable></Column>
                <Column field="NOMINA" header="NOMINA" sortable body={tipoNominaTemplate}></Column>
                <Column field="BANCO" header="BANCO" sortable></Column>
                <Column field="PERCEPCIONES" header="BRUTO" sortable body={(rowData) => currencyTemplate(rowData, 'PERCEPCIONES')}></Column>
                <Column field="DEDUCCIONES" header="DEDUCCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'DEDUCCIONES')}></Column>
                <Column field="LIQUIDO" header="NETO" sortable body={(rowData) => currencyTemplate(rowData, 'LIQUIDO')}></Column>
                <Column field="EMPLEADOS" header="EMPLEADOS" sortable body={empleadosTemplate}></Column>
            </DataTable>

            {/* Separador */}
            <hr className={styles.separador} />

            {/* Tabla de datos totales */}
            <div className={styles.totalTable}>
                <DataTable
                    value={datosTotales}
                    paginator={false}
                    rows={10}
                    className="p-datatable-sm"
                >
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
        </div>
    );
}
