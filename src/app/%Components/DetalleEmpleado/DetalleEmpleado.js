'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSearchParams } from 'next/navigation'; // Para obtener parámetros de la URL
import styles from './DetalleEmpleado.module.css';

export default function DetalleEmpleado() {
    const [empleadosData, setEmpleadosData] = useState([]);
    const searchParams = useSearchParams();

    const anio = searchParams.get('anio');
    const quincena = searchParams.get('quincena');
    const nomina = searchParams.get('nomina');
    const banco = searchParams.get('banco');

    useEffect(() => {
        if (anio && quincena && nomina && banco) {
            fetchEmpleadosData();
        }
    }, [anio, quincena, nomina, banco]);

    const fetchEmpleadosData = async () => {
        try {
            const response = await axios.get('/consultaEmpleados/especifico', {
                params: {
                    anio,
                    quincena,
                    nomina,
                    banco
                }
            });
            setEmpleadosData(response.data);
        } catch (error) {
            console.error('Error fetching empleados data', error);
        }
    };

    const currencyTemplate = (rowData, field) => {
        return rowData[field].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className={`card ${styles.card}`}>
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className={styles.header}>DETALLE DE EMPLEADOS</h2>
            </div>
            <DataTable value={empleadosData} paginator rows={10} className="p-datatable-sm">
                <Column field="ID_EMPLEADO" header="ID EMPLEADO" sortable></Column>
                <Column field="NOMBRE" header="NOMBRE" sortable></Column>
                <Column field="APELLIDO_1" header="APELLIDO PATERNO" sortable></Column>
                <Column field="APELLIDO_2" header="APELLIDO MATERNO" sortable></Column>
                <Column field="PERCEPCIONES" header="PERCEPCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'PERCEPCIONES')}></Column>
                <Column field="DEDUCCIONES" header="DEDUCCIONES" sortable body={(rowData) => currencyTemplate(rowData, 'DEDUCCIONES')}></Column>
                <Column field="LIQUIDO" header="NETO" sortable body={(rowData) => currencyTemplate(rowData, 'LIQUIDO')}></Column>
            </DataTable>
        </div>
    );
}
