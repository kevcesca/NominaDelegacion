// src/app/%Components/TablasComparativasNomina/DeduccionesTabla.js
'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterService } from 'primereact/api';
import axios from 'axios';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Tablas.module.css';
import API_BASE_URL from '../../%Config/apiConfig';

export default function DeduccionesTabla({ anio, quincena, nombreNomina }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        sectpres: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nomina: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        id_concepto1: { value: null, matchMode: FilterMatchMode.EQUALS },
        nombre_concepto: { value: null, matchMode: FilterMatchMode.CONTAINS },
        deducciones: { value: null, matchMode: FilterMatchMode.CUSTOM }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        if (anio && quincena && nombreNomina) {
            fetchData(anio, quincena, nombreNomina);
        }
    }, [anio, quincena, nombreNomina]);

    const fetchData = async (anio, quincena, nombreNomina) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/NominaCtrl/DeduccionesSeparadas`, {
                params: {
                    anio,
                    quincena,
                    nombre: nombreNomina,
                    cancelado: false,
                    completado: true,
                },
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data', error);
        }
        setLoading(false);
    };

    // Calcular el total de deducciones
    const totalDeducciones = data.reduce((total, item) => {
        const deduccion = parseFloat(item.deducciones.replace(/,/g, ''));
        return total + (isNaN(deduccion) ? 0 : deduccion);
    }, 0);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </span>
            </div>
        );
    };

    const currencyTemplate = (rowData) => {
        return parseFloat(rowData.deducciones.replace(/,/g, '')).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const header = renderHeader();

    return (
        <div className={`card ${styles.card}`}>
            
            <DataTable 
                value={data} 
                paginator 
                rows={10} 
                loading={loading}
                filters={filters} 
                filterDisplay="row" 
                globalFilterFields={['sectpres', 'nomina', 'nombre_concepto']} 
                header={header} 
                emptyMessage="No se encontraron datos."
                className="p-datatable-sm"
            >
                <Column field="sectpres" header="Sector Presupuestal" filter filterPlaceholder="Buscar..." sortable />
                <Column field="nomina" header="Nómina" filter filterPlaceholder="Buscar..." sortable />
                <Column field="id_concepto1" header="ID Concepto" filter filterPlaceholder="Buscar..." sortable />
                <Column field="nombre_concepto" header="Nombre Concepto" filter filterPlaceholder="Buscar..." sortable />
                <Column field="deducciones" header="Deducciones" body={currencyTemplate} sortable />
            </DataTable>
            {/* Sección de total */}
            <div className={styles.totalContainer}>
                <h3>Total Deducciones: {totalDeducciones.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h3>
            </div>
        </div>
    );
}
