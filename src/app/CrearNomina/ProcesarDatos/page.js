'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useSearchParams, useRouter } from 'next/navigation';
import { ThemeProvider, Button, Box, Typography, FormControlLabel, Switch, Select, MenuItem } from '@mui/material';
import styles from './page.module.css';
import theme from '../../$tema/theme';
import ChequesResumen from '../../%Components/TablasComparativasNomina/ChequesResumen';
import DepositoResumen from '../../%Components/TablasComparativasNomina/DepositoResumen';
import Totales from '../../%Components/TablasComparativasNomina/Totales';
import PercepcionesTabla from '../../%Components/TablasComparativasNomina/PercepcionesTablas';
import DeduccionesTabla from '../../%Components/TablasComparativasNomina/DeduccionesTabla';
import API_BASE_URL from '../../%Config/apiConfig';

const CargarDatos = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const anioParam = searchParams.get('anio');
    const quincenaParam = searchParams.get('quincena');
    const nombreNomina = 'Compuesta';

    const [anio, setAnio] = useState(anioParam || '2024'); // Usar el valor de la URL o un valor por defecto
    const [quincena, setQuincena] = useState(quincenaParam || '01');

    const [chequesData, setChequesData] = useState([]);
    const [depositoData, setDepositoData] = useState([]);
    const [totalesData, setTotalesData] = useState([]);

    const [showPercepciones, setShowPercepciones] = useState(false);
    const [showDeducciones, setShowDeducciones] = useState(false);

    const quincenas = [
        { label: '1ra ene', value: '01' },
        { label: '2da ene', value: '02' },
        { label: '1ra feb', value: '03' },
        { label: '2da feb', value: '04' },
        { label: '1ra mar', value: '05' },
        { label: '2da mar', value: '06' },
        { label: '1ra abr', value: '07' },
        { label: '2da abr', value: '08' },
        { label: '1ra may', value: '09' },
        { label: '2da may', value: '10' },
        { label: '1ra jun', value: '11' },
        { label: '2da jun', value: '12' },
        { label: '1ra jul', value: '13' },
        { label: '2da jul', value: '14' },
        { label: '1ra ago', value: '15' },
        { label: '2da ago', value: '16' },
        { label: '1ra sep', value: '17' },
        { label: '2da sep', value: '18' },
        { label: '1ra oct', value: '19' },
        { label: '2da oct', value: '20' },
        { label: '1ra nov', value: '21' },
        { label: '2da nov', value: '22' },
        { label: '1ra dic', value: '23' },
        { label: '2da dic', value: '24' },
    ];

    useEffect(() => {
        if (anio && quincena) {
            fetchChequesData(anio, quincena);
            fetchDepositoData(anio, quincena);
            fetchTotalesData(anio, quincena);
        }
    }, [anio, quincena]);

    const fetchChequesData = async (anio, quincena) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/NominaCtrl/BancosNulos`, {
                params: {
                    anio,
                    quincena,
                    cancelado: false,
                    completado: true,
                },
            });
            setChequesData(response.data);
        } catch (error) {
            console.error('Error fetching cheques data', error);
        }
    };

    const fetchDepositoData = async (anio, quincena) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/NominaCtrl/BancosNoNulos`, {
                params: {
                    anio,
                    quincena,
                    cancelado: false,
                    completado: true,
                },
            });
            setDepositoData(response.data);
        } catch (error) {
            console.error('Error fetching deposito data', error);
        }
    };

    const fetchTotalesData = async (anio, quincena) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/NominaCtrl/Totales`, {
                params: {
                    anio,
                    quincena,
                    cancelado: false,
                    completado: true,
                },
            });
            setTotalesData(response.data);
        } catch (error) {
            console.error('Error fetching totales data', error);
        }
    };

    const exportExcel = () => {
        const workbook = XLSX.utils.book_new();

        const addSheetToWorkbook = (data, sheetName) => {
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        };

        addSheetToWorkbook(chequesData, 'Cheques Resumen');
        addSheetToWorkbook(depositoData, 'Deposito Resumen');
        addSheetToWorkbook(totalesData, 'Totales');

        XLSX.writeFile(workbook, 'resumen.xlsx');
    };

    const exportPDF = async () => {
        const { jsPDF } = await import('jspdf');
        const autoTable = await import('jspdf-autotable');
        const doc = new jsPDF();

        const addDataToPDF = (data, title) => {
            const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 20;
            doc.text(title, 14, startY - 10);
            autoTable.default(doc, {
                startY: startY,
                head: [Object.keys(data[0])],
                body: data.map(item => Object.values(item)),
            });
        };

        addDataToPDF(chequesData, 'Cheques Resumen');
        addDataToPDF(depositoData, 'Deposito Resumen');
        addDataToPDF(totalesData, 'Totales');

        doc.save('resumen.pdf');
    };

    const handleNavigateToAprobacion = () => {
        router.push(`/AprobarCargaNomina?anio=${anio}&quincena=${quincena}`);
    };

    return (
        <ThemeProvider theme={theme}>
            <main className={styles.main}>
                <h1 className={styles.h1}>Resumen de Nómina</h1>

                {/* Dropdowns para seleccionar quincena y año */}
                <Box className={styles.selectorContainer}>
                    <Select
                        value={quincena}
                        onChange={(e) => setQuincena(e.target.value)}
                        variant="outlined"
                        displayEmpty
                    >
                        {quincenas.map((quin, index) => (
                            <MenuItem key={index} value={quin.value}>
                                {quin.label}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select
                        value={anio}
                        onChange={(e) => setAnio(e.target.value)}
                        variant="outlined"
                        displayEmpty
                    >
                        {[...Array(21).keys()].map(n => (
                            <MenuItem key={2024 + n} value={2024 + n}>
                                Año {2024 + n}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <div className={styles.grid}>
                    <div className={styles.gridItem1}>
                        <DepositoResumen resumenData={depositoData} anio={anio} quincena={quincena} />
                    </div>
                    <div className={styles.gridItem1}>
                        <ChequesResumen resumenData={chequesData} anio={anio} quincena={quincena} />
                    </div>
                    <div className={styles.gridItem1}>
                        <Totales resumenData={totalesData} anio={anio} quincena={quincena} />
                    </div>

                    <FormControlLabel
                        control={<Switch checked={showPercepciones} onChange={() => setShowPercepciones(!showPercepciones)} />}
                        label="Mostrar Percepciones"
                    />
                    {showPercepciones && (
                        <div className={styles.gridItem1}>
                            <PercepcionesTabla anio={anio} quincena={quincena} nombreNomina={nombreNomina} />
                        </div>
                    )}

                    <FormControlLabel
                        control={<Switch checked={showDeducciones} onChange={() => setShowDeducciones(!showDeducciones)} />}
                        label="Mostrar Deducciones"
                    />
                    {showDeducciones && (
                        <div className={styles.gridItem1}>
                            <DeduccionesTabla anio={anio} quincena={quincena} nombreNomina={nombreNomina} />
                        </div>
                    )}
                </div>

                <Box className={styles.buttonContainer}>
                    <Button className={styles.botonesExportar} variant="contained" color="primary" onClick={exportExcel}>Exportar resumen a Excel</Button>
                    <Button className={styles.botonesExportar} variant="contained" color="primary" onClick={exportPDF}>Exportar resumen a PDF</Button>
                </Box>

                <Box className={styles.buttonContainer}>
                    <Button
                        className={styles.botonesExportar}
                        variant="contained"
                        color="primary"
                        onClick={handleNavigateToAprobacion} // Navegar a la página de aprobación con parámetros
                    >
                        Ir a Aprobación de Nóminas
                    </Button>
                </Box>
            </main>
        </ThemeProvider>
    );
};

export default CargarDatos;