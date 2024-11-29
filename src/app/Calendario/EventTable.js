// EventTable.js
'use client';

import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Grid, TextField, Collapse } from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as xlsx from 'xlsx';
import { saveAs } from 'file-saver';
import API_BASE_URL from "../%Config/apiConfig";
import ColumnSelector from '../%Components/ColumnSelector/ColumnSelector';
import styles from './page.module.css';
import theme from '../$tema/theme';

export default function EventTable({ onSaveEvent }) {
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
    const [anio, setAnio] = useState('2024'); // Año seleccionado
    const [mes, setMes] = useState('2024-11'); // Mes seleccionado
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
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Refrescar datos automáticamente cuando cambia el mes
    }, [mes]); // Dependencia: cuando el mes cambie

    useEffect(() => {
        fetchData(); // Refrescar datos cuando cambia el año
    }, [anio]); // Dependencia: cuando el año cambie

    // Función para manejar el cambio en la selección de columnas
    const handleColumnSelectionChange = (selectedColumns) => {
        setVisibleColumns(selectedColumns);
    };

    // Función para actualizar la tabla cuando se inserta un nuevo evento
    const handleSaveEvent = (newEvent) => {
        setData((prevData) => [newEvent, ...prevData]); // Añadir el nuevo evento a los datos ya existentes
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
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Año"
                        value={anio}
                        onChange={(e) => setAnio(e.target.value)} // Actualizar año
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Mes"
                        value={mes}
                        onChange={(e) => setMes(e.target.value)} // Actualizar mes
                        fullWidth
                        type="month"
                    />
                </Grid>
            </Grid>
            <Button
                variant="outlined"
                onClick={() => setCollapseOpen(!collapseOpen)}
                style={{ marginTop: '1rem' }}
            >
                Configurar Columnas
            </Button>
            
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
        </Box>
    );
}
