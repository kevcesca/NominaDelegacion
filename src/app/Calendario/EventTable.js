'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, Typography, Box, Collapse, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import API_BASE_URL from "../%Config/apiConfig"
import ColumnSelector from '../%Components/ColumnSelector/ColumnSelector'; // Asegúrate de tener este componente
import styles from './page.module.css';
import theme from '../$tema/theme';
import * as xlsx from 'xlsx';
import { saveAs } from 'file-saver';

export default function EventTable() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        titulo_evento: true,
        descripcion: true,
        quincena: true,
        mes: true,
        anio: true,
        fecha: true,
    });
    const [collapseOpen, setCollapseOpen] = useState(false);
    const [anio, setAnio] = useState('2024');
    const [quincena, setQuincena] = useState(['2024-11-15', '2024-11-20']);
    const toast = useRef(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const queryParams = `fechaInicio=${quincena[0]}&fechaFin=${quincena[1]}`;
            const response = await fetch(`${API_BASE_URL}/rangoFechas?${queryParams}`);
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los datos.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [quincena]);

    const handleColumnSelectionChange = (selectedColumns) => {
        setVisibleColumns(selectedColumns);
    };

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
            }, {})
        );
        doc.autoTable({
            columns,
            body: rows,
        });
        doc.save('eventos.pdf');
    };

    const exportCSV = () => {
        const filteredData = data.map(item =>
            Object.keys(visibleColumns).reduce((acc, key) => {
                if (visibleColumns[key]) {
                    acc[key] = item[key];
                }
                return acc;
            }, {})
        );

        // Genera un Blob para la descarga en CSV
        const csvData = filteredData.map((row) =>
            Object.values(row).map((value) => `"${value}"`).join(',')
        );
        const header = Object.keys(visibleColumns)
            .filter((key) => visibleColumns[key])
            .join(',');

        const csvContent = [header, ...csvData].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'eventos.csv');
    };

    const exportExcel = () => {
        const filteredData = data.map(item =>
            Object.keys(visibleColumns).reduce((acc, key) => {
                if (visibleColumns[key]) {
                    acc[key] = item[key];
                }
                return acc;
            }, {})
        );

        const worksheet = xlsx.utils.json_to_sheet(filteredData);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelBlob, 'eventos.xlsx');
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={styles.container}>
                <Typography variant="h4" className={styles.title}>Eventos de Rango de Fechas</Typography>
                <Box className={styles.filters}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Año"
                                value={anio}
                                onChange={(e) => setAnio(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Fecha de Quincena (inicio - fin)"
                                value={quincena.join(' - ')}
                                onChange={(e) => setQuincena(e.target.value.split(' - '))}
                                fullWidth
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
                        <div>
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
                        </div>
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
