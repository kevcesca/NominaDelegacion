'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TextField, Typography, Box, Collapse, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import API_BASE_URL from "../%Config/apiConfig";
import ColumnSelector from '../%Components/ColumnSelector/ColumnSelector'; // Asegúrate de tener este componente
import styles from './page.module.css';
import theme from '../$tema/theme';
import * as xlsx from 'xlsx';
import { saveAs } from 'file-saver';
import AsyncButton from '../%Components/AsyncButton/AsyncButton'; // Importa AsyncButton

export default function EventTable() {
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
    const [anio, setAnio] = useState('2024'); // Año seleccionado
    const [mes, setMes] = useState('2024-11'); // Mes seleccionado (formato YYYY-MM)
    const toast = useRef(null); // Ref para mostrar errores

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
            
            // Verificar que la respuesta sea válida y convertirla en JSON
            const data = await response.json();
            
            // Solo actualizar el estado si la respuesta es un array
            if (Array.isArray(data)) {
                setData(data);
            } else {
                setData([]); // Si la respuesta no es un array, limpiar los datos
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los datos.' });
            setData([]); // Limpiar los datos en caso de error
        } finally {
            setIsLoading(false); // Desactivar carga
        }
    };

    // useEffect para refrescar datos cuando cambia el mes
    useEffect(() => {
        fetchData(); // Refrescar datos automáticamente cuando cambia el mes
    }, [mes]); // Dependencia: cuando el mes cambie

    useEffect(() => {
        fetchData(); // Refrescar datos cuando cambia el año (si es necesario)
    }, [anio]); // Dependencia: cuando el año cambie

    // Función para manejar el cambio en la selección de columnas
    const handleColumnSelectionChange = (selectedColumns) => {
        setVisibleColumns(selectedColumns);
    };

    // Función para exportar a PDF
    const exportPDF = async () => {
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
    const exportCSV = async () => {
        const filteredData = data.map(item =>
            Object.keys(visibleColumns).reduce((acc, key) => {
                if (visibleColumns[key]) {
                    acc[key] = item[key];
                }
                return acc;
            }, {}));

        // Generar un Blob para la descarga en CSV
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
    const exportExcel = async () => {
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
        <ThemeProvider theme={theme}>
            <div className={styles.container}>
                <Typography variant="h4" className={styles.title}>Eventos del Mes</Typography>
                <Box className={styles.filters}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <br></br>
                            <TextField
                                label="Año"
                                value={anio}
                                onChange={(e) => setAnio(e.target.value)} // Actualizar año
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <br></br>
                            <TextField
                                label="Mes"
                                value={mes}
                                onChange={(e) => setMes(e.target.value)} // Actualizar mes
                                fullWidth
                                type="month"
                            />
                        </Grid>
                    </Grid>
                    <AsyncButton
                        variant="outlined"
                        onClick={() => setCollapseOpen(!collapseOpen)}
                        style={{ marginTop: '1rem' }}
                    >
                        Configurar Columnas
                    </AsyncButton>
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
                                    <AsyncButton
                                        variant="contained"
                                        color="primary"
                                        onClick={exportPDF}
                                        style={{ margin: '10px' }}
                                    >
                                        Exportar a PDF
                                    </AsyncButton>

                                    <AsyncButton
                                        variant="contained"
                                        color="primary"
                                        onClick={exportCSV}
                                        style={{ margin: '10px' }}
                                    >
                                        Exportar a CSV
                                    </AsyncButton>

                                    <AsyncButton
                                        variant="contained"
                                        color="primary"
                                        onClick={exportExcel}
                                        style={{ margin: '10px' }}
                                    >
                                        Exportar a Excel
                                    </AsyncButton>
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
                                            visibleColumns[key] && (
                                                <td key={key}>{event[key]}</td>
                                            )
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </div>
        </ThemeProvider>
    );
}
