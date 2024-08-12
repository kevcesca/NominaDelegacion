// src/app/CrearNomina/page.js
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useSearchParams } from 'next/navigation';
import { ThemeProvider, Button, Box, Typography } from '@mui/material';
import styles from './page.module.css';
import theme from '../../$tema/theme';
import ChequesResumen from '../../%Components/TablasComparativasNomina/ChequesResumen';
import DepositoResumen from '../../%Components/TablasComparativasNomina/DepositoResumen';
import Totales from '../../%Components/TablasComparativasNomina/Totales';
import ComparativaTable from '../../%Components/ComparativeTable/ComparativeTable'; // Importa la tabla de aprobación
import { useSession } from 'next-auth/react';
import API_BASE_URL from '../../%Config/apiConfig'

const CargarDatos = () => {
    const searchParams = useSearchParams();
    const anio = searchParams.get('anio');
    const quincena = searchParams.get('quincena');

    const [chequesData, setChequesData] = useState([]);
    const [depositoData, setDepositoData] = useState([]);
    const [totalesData, setTotalesData] = useState([]);
    const { data: session } = useSession(); // Obtén la sesión para pasar el usuario

    useEffect(() => {
        if (anio && quincena) {
            fetchChequesData(anio, quincena);
            fetchDepositoData(anio, quincena);
            fetchTotalesData(anio, quincena);
        }
    }, [anio, quincena]);

    const fetchChequesData = async (anio, quincena) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/resumenCheques?anio=${anio}&quincena=${quincena}`);
            setChequesData(response.data);
        } catch (error) {
            console.error('Error fetching cheques data', error);
        }
    };

    const fetchDepositoData = async (anio, quincena) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/resumenTransferencia?anio=${anio}&quincena=${quincena}`);
            setDepositoData(response.data);
        } catch (error) {
            console.error('Error fetching deposito data', error);
        }
    };

    const fetchTotalesData = async (anio, quincena) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/resumenTotal?anio=${anio}&quincena=${quincena}`);
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
                </div>
                <Box className={styles.buttonContainer}>
                    <Button className={styles.botonesExportar} variant="contained" color="primary" onClick={exportExcel}>Exportar a Excel</Button>
                    <Button className={styles.botonesExportar} variant="contained" color="primary" onClick={exportPDF}>Exportar a PDF</Button>
                </Box>
                {/* Aquí integras la tabla de aprobación */}
                <Box mt={4}>
                    <Typography variant="h6">Aprobación de Nóminas</Typography>
                    {session && <ComparativaTable userRevision={session.user.name} />} {/* Pasas el usuario que aprueba */}
                </Box>
            </main>
        </ThemeProvider>
    );
};

export default CargarDatos;
