'use client';

import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Grid, Collapse } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh'; // Icono de refrescar
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as xlsx from 'xlsx';
import { saveAs } from 'file-saver';
import API_BASE_URL from "../%Config/apiConfig";
import ColumnSelector from '../%Components/ColumnSelector/ColumnSelector';
import styles from './page.module.css';

export default function EventTable({ anio, mes, onSaveEvent }) {
    const [data, setData] = useState([]); // Datos obtenidos de la API
    const [isLoading, setIsLoading] = useState(false); // Estado de carga
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        titulo_evento: true,
        descripcion: true,
        quincena: true,
        mes: true,
        anio: true,
        fecha: true,
    });
    const [collapseOpen, setCollapseOpen] = useState(false); // Estado de colapso de selector de columnas

    // Función para calcular el primer y último día del mes
    const getMonthRange = (yearMonth) => {
        const [year, month] = yearMonth.split('-');
        const startDate = new Date(year, month - 1, 1); // Primer día del mes
        const endDate = new Date(year, month, 0); // Último día del mes
        return { startDate, endDate };
    };

    // Función para hacer la llamada a la API
    const fetchData = async () => {
        setIsLoading(true); // Activar carga
        try {
            const { startDate, endDate } = getMonthRange(mes); // Obtener el rango de fechas

            const queryParams = `fechaInicio=${startDate.toISOString().split('T')[0]}&fechaFin=${endDate.toISOString().split('T')[0]}`;
            const response = await fetch(`${API_BASE_URL}/rangoFechas?${queryParams}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                setData(data);
            } else {
                setData([]); // Si no hay datos, se limpia el estado
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]); // Si hay error, se limpia el estado
        } finally {
            setIsLoading(false);
        }
    };

    // Llamar a fetchData cuando cambia el mes
    useEffect(() => {
        fetchData();
    }, [mes]); // Dependencia: cuando el mes cambie

    // Llamar a fetchData cuando cambia el año
    useEffect(() => {
        fetchData();
    }, [anio]); // Dependencia: cuando el año cambie

    // Función para manejar el cambio en la selección de columnas
    const handleColumnSelectionChange = (selectedColumns) => {
        setVisibleColumns(selectedColumns);
    };

    // Función para exportar a PDF
    const exportPDF = () => {
        const doc = new jsPDF();
        const columns = Object.keys(visibleColumns)
            .filter((key) => visibleColumns[key])
            .map((key) => ({ header: key, dataKey: key }));
        const rows = data.map(item =>
            Object.keys(visibleColumns).reduce((acc, key) => {
                if (visibleColumns[key]) {
                    acc[key] = item[key];
                }
                return acc;
            }, {}));
        doc.autoTable({
            columns,
            body: rows,
        });
        doc.save('eventos.pdf');
    };

    // Función para exportar a CSV
    const exportCSV = () => {
        const filteredData = data.map(item =>
            Object.keys(visibleColumns).reduce((acc, key) => {
                if (visibleColumns[key]) {
                    acc[key] = item[key];
                }
                return acc;
            }, {}));

        const csvData = filteredData.map((row) =>
            Object.values(row).map((value) => `"${value}"`).join(','));

        const header = Object.keys(visibleColumns)
            .filter((key) => visibleColumns[key])
            .join(',');

        const csvContent = [header, ...csvData].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'eventos.csv');
    };

    // Función para exportar a Excel
    const exportExcel = () => {
        const filteredData = data.map(item =>
            Object.keys(visibleColumns).reduce((acc, key) => {
                if (visibleColumns[key]) {
                    acc[key] = item[key];
                }
                return acc;
            }, {}));

        const worksheet = xlsx.utils.json_to_sheet(filteredData);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelBlob, 'eventos.xlsx');
    };

    return (
        <Box className={styles.tableContainer}>
            <Typography variant="h4" className={styles.title}>Eventos del Mes</Typography>
            
            <Box sx={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                {/* Botón de Refrescar con icono */}
                <Button
                    variant="outlined"
                    onClick={fetchData} // Llamar a fetchData para refrescar los datos
                    color="primary"
                    startIcon={<RefreshIcon />} // Ícono de refrescar
                    sx={{
                        marginRight: 2, // Espacio a la derecha
                        padding: '8px 16px', // Padding para que el botón se vea más grande
                    }}
                >
                    Refrescar
                </Button>
                
                {/* Botón para configurar columnas */}
                <Button
                    variant="outlined"
                    onClick={() => setCollapseOpen(!collapseOpen)}
                    color="primary"
                    sx={{
                        padding: '8px 16px', // Padding igual para el botón
                    }}
                >
                    Configurar Columnas
                </Button>
            </Box>

            <Collapse in={collapseOpen}>
                <Box className={styles.columnSelector}>
                    <ColumnSelector
                        availableColumns={[ 
                            { key: 'id', label: 'ID' },
                            { key: 'titulo_evento', label: 'Título' },
                            { key: 'descripcion', label: 'Descripción' },
                            { key: 'quincena', label: 'Quincena' },
                            { key: 'mes', label: 'Mes' },
                            { key: 'anio', label: 'Año' },
                            { key: 'fecha', label: 'Fecha' },
                        ]}
                        onSelectionChange={handleColumnSelectionChange}
                    />
                </Box>
            </Collapse>

            <Box className={styles.tableContainer}>
                {isLoading ? (
                    <Typography variant="body1">Cargando...</Typography>
                ) : (
                    <>
                        {data.length === 0 ? (
                            <Typography variant="body1">No hay eventos disponibles para el mes seleccionado.</Typography>
                        ) : (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={exportPDF}
                                    style={{ margin: '10px' }}
                                >
                                    Exportar a PDF
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={exportCSV}
                                    style={{ margin: '10px' }}
                                >
                                    Exportar a CSV
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={exportExcel}
                                    style={{ margin: '10px' }}
                                >
                                    Exportar a Excel
                                </Button>
                            </>
                        )}
                    </>
                )}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {Object.keys(visibleColumns).map(
                                (key) =>
                                    visibleColumns[key] && <th key={key}>{key}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((event) => (
                            <tr key={event.id}>
                                {Object.keys(visibleColumns).map(
                                    (key) =>
                                        visibleColumns[key] && <td key={key}>{event[key]}</td>
                                )}
                            </tr> ))} </tbody> </table> </Box> </Box> ); }
