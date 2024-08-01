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

const CargarDatos = () => {
    const searchParams = useSearchParams();
    const anio = searchParams.get('anio');
    const quincena = searchParams.get('quincena');

    const [resumenData, setResumenData] = useState([]);

    useEffect(() => {
        if (anio && quincena) {
            fetchResumenData(anio, quincena);
        }
    }, [anio, quincena]);

    const fetchResumenData = async (anio, quincena) => {
        try {
            const response = await axios.get(`http://192.168.100.77:8080/getReport?anio=${anio}&quincena=${quincena}`);
            setResumenData(response.data);
        } catch (error) {
            console.error('Error fetching resumen cheques data', error);
        }
    };

    const chequesData = resumenData.slice(0, resumenData.findIndex(data => !data.ANIO));
    const start = resumenData.findIndex(data => !data.ANIO) + 1;
    const end = resumenData.findIndex((data, index) => index > start && !data.ANIO);
    const depositoData = resumenData.slice(start, end);
    const totalesData = resumenData.slice(end + 1);

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
                    <div className={styles.gridItem1}>
                        <ChequesResumen resumenData={chequesData} anio={anio} quincena={quincena} />
                    </div>
                    <div className={styles.gridItem2}>
                        <DepositoResumen resumenData={depositoData} anio={anio} quincena={quincena} />
                    </div>
                    <div className={styles.gridItem1}>
                        <Totales resumenData={totalesData} anio={anio} quincena={quincena} />
                    </div>
                </div>
                <Box className={styles.buttonContainer}>
                    <Button className={styles.botonesExportar} variant="contained" color="primary" onClick={exportExcel}>Exportar a Excel</Button>
                    <Button className={styles.botonesExportar} variant="contained" color="primary" onClick={exportPDF}>Exportar a PDF</Button>
                </Box>
            </main>
        </ThemeProvider>
    );
};

export default CargarDatos;
