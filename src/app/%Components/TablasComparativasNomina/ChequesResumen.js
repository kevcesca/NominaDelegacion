'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Tablas.module.css';

export default function ChequesResumen({ resumenData, anio, quincena }) {
    const router = useRouter();

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

    const chequesData = limpiarDatos(resumenData);
    const datosNormales = chequesData.filter(item => item.BANCO !== 'Total');
    const datosTotales = chequesData.filter(item => item.BANCO === 'Total');

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
                className="p-datatable-sm"
            >
                <Column field="ANIO" header="AÑO" sortable></Column>
                <Column field="QUINCENA" header="QUINCENA" sortable></Column>
                <Column field="NOMINA" header="NOMINA" sortable body={tipoNominaTemplate}></Column>
                <Column field="BANCO" header="BANCO" sortable></Column>
                <Column field="PERCEPCIONES" header="PERCEPCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'PERCEPCIONES')}></Column>
                <Column field="DEDUCCIONES" header="DEDUCCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'DEDUCCIONES')}></Column>
                <Column field="LIQUIDO" header="LIQUIDO" sortable body={(rowData) => currencyTemplate(rowData, 'LIQUIDO')}></Column>
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
                    <Column field="PERCEPCIONES" header="PERCEPCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'PERCEPCIONES')}></Column>
                    <Column field="DEDUCCIONES" header="DEDUCCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'DEDUCCIONES')}></Column>
                    <Column field="LIQUIDO" header="LIQUIDO" sortable body={(rowData) => currencyTemplate(rowData, 'LIQUIDO')}></Column>
                    <Column field="EMPLEADOS" header="EMPLEADOS" sortable></Column>
                </DataTable>
            </div>
        </div>
    );
}
