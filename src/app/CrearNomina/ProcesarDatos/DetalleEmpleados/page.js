'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Para obtener parámetros de la URL
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './page.module.css';
import API_BASE_URL from '../../../%Config/apiConfig';

export default function DetalleEmpleados() {
    const searchParams = useSearchParams();
    const anio = searchParams.get('anio');
    const quincena = searchParams.get('quincena');
    const nomina = searchParams.get('nomina');
    const banco = searchParams.get('banco');

    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/consultaEmpleados/especifico`, {
                    params: {
                        anio,
                        quincena,
                        nomina,
                        banco,
                    },
                });
                setEmpleados(response.data);
            } catch (error) {
                console.error('Error fetching empleados data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (anio && quincena && nomina && banco) {
            fetchEmpleados();
        }
    }, [anio, quincena, nomina, banco]);

    return (
        <main className={styles.main}>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className={`card ${styles.card}`}>
                <h2 className={styles.header}>DETALLE DE EMPLEADOS (QNA {quincena}/{anio})</h2>
                    <DataTable value={empleados} paginator rows={10} className="p-datatable-sm">
                        <Column field="ANIO" header="AÑO" sortable></Column>
                        <Column field="QUINCENA" header="QUINCENA" sortable></Column>
                        <Column field="NOMINA" header="NÓMINA" sortable></Column>
                        <Column field="BANCO" header="BANCO" sortable></Column>
                        <Column field="ID_EMPLEADO" header="ID EMPLEADO" sortable></Column>
                        <Column field="NOMBRE" header="NOMBRE" sortable></Column>
                        <Column field="APELLIDO_1" header="APELLIDO PATERNO" sortable></Column>
                        <Column field="APELLIDO_2" header="APELLIDO MATERNO" sortable></Column>
                        <Column field="PERCEPCIONES" header="PERCEPCIONES" sortable body={(rowData) => rowData.PERCEPCIONES.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                        <Column field="DEDUCCIONES" header="DEDUCCIONES" sortable body={(rowData) => rowData.DEDUCCIONES.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                        <Column field="LIQUIDO" header="LÍQUIDO" sortable body={(rowData) => rowData.LIQUIDO.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
                    </DataTable>
                </div>
            )}
        </main>
    );
}
