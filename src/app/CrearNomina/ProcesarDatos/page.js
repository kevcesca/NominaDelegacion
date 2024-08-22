'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useSearchParams } from 'next/navigation';
import { ThemeProvider, Button, Box, Typography, FormControlLabel, Switch } from '@mui/material';
import styles from './page.module.css';
import theme from '../../$tema/theme';
import ChequesResumen from '../../%Components/TablasComparativasNomina/ChequesResumen';
import DepositoResumen from '../../%Components/TablasComparativasNomina/DepositoResumen';
import Totales from '../../%Components/TablasComparativasNomina/Totales';
import PercepcionesTabla from '../../%Components/TablasComparativasNomina/PercepcionesTablas';
import DeduccionesTabla from '../../%Components/TablasComparativasNomina/DeduccionesTabla';
import ComparativaTable from '../../%Components/ComparativeTable/ComparativeTable';
import ComparativaTable2 from '../../%Components/ComparativeTable/ComparativeTable2';
import { useSession } from 'next-auth/react';
import API_BASE_URL from '../../%Config/apiConfig';

const CargarDatos = () => {
    const searchParams = useSearchParams();
    const anio = searchParams.get('anio');
    const quincena = searchParams.get('quincena');
    const nombreNomina = 'Compuesta'; // Este podría ser dinámico basado en la selección del usuario.

    const [chequesData, setChequesData] = useState([]);
    const [depositoData, setDepositoData] = useState([]);
    const [totalesData, setTotalesData] = useState([]);
    const { data: session } = useSession();

    const [showPercepciones, setShowPercepciones] = useState(false);
    const [showDeducciones, setShowDeducciones] = useState(false);

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

    return (
        <ThemeProvider theme={theme}>
            <main className={styles.main}>
                <h1 className={styles.h1}>Procesar datos</h1>
                <Typography variant="h6">Año: {anio}</Typography>
                <Typography variant="h6">Quincena: {quincena}</Typography>
                <div className={styles.grid}>
                    <div className={styles.gridItem2}>
                        <DepositoResumen resumenData={depositoData} anio={anio} quincena={quincena} />
                    </div>
                    <div className={styles.gridItem1}>
                        <ChequesResumen resumenData={chequesData} anio={anio} quincena={quincena} />
                    </div>
                    <div className={styles.gridItem1}>
                        <Totales resumenData={totalesData} anio={anio} quincena={quincena} />
                    </div>

                    {/* Switch para mostrar/ocultar Percepciones */}
                    <FormControlLabel
                        control={<Switch checked={showPercepciones} onChange={() => setShowPercepciones(!showPercepciones)} />}
                        label="Mostrar Percepciones"
                    />
                    {showPercepciones && (
                        <div className={styles.gridItem1}>
                            <PercepcionesTabla anio={anio} quincena={quincena} nombreNomina={nombreNomina} />
                        </div>
                    )}

                    {/* Switch para mostrar/ocultar Deducciones */}
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
                    <Button className={styles.botonesExportar} variant="contained" color="primary" onClick={exportExcel}>Exportar a Excel</Button>
                    <Button className={styles.botonesExportar} variant="contained" color="primary" onClick={exportPDF}>Exportar a PDF</Button>
                </Box>
                
                {/* Renderiza la tabla de aprobación 1 solo si el usuario tiene el rol 'Admin' */}
                {session && session.roles && session.roles.includes('Admin') && (
                    <Box mt={4}>
                        <Typography variant="h6">Aprobación de Nóminas 1</Typography>
                        <ComparativaTable userRevision={session.user.name} quincena={quincena} anio={anio} />
                    </Box>
                )}

                {/* Renderiza la tabla de aprobación 2 solo si el usuario tiene el rol 'SuperAdmin' */}
                {session && session.roles && session.roles.includes('SuperAdmin') && (
                    <Box mt={4}>
                        <Typography variant="h6">Aprobación de Nóminas 2</Typography>
                        <ComparativaTable2 userRevision={session.user.name} quincena={quincena} anio={anio} />
                    </Box>
                )}
            </main>
        </ThemeProvider>
    );
};

export default CargarDatos;
