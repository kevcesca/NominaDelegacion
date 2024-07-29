'use client';

import React from 'react';
import * as XLSX from 'xlsx';
import { ThemeProvider, Button, Box, Typography } from '@mui/material';
import styles from './page.module.css';
import theme from '../../$tema/theme';
import ChequesResumen from '../../%Components/TablasComparativasNomina/ChequesResumen';
import Retenciones from '../../%Components/TablasComparativasNomina/Retenciones';
import DepositoResumen from '../../%Components/TablasComparativasNomina/DepositoResumen';
import RetencionesDeposito from '../../%Components/TablasComparativasNomina/RetencionesDeposito';
import Totales from '../../%Components/TablasComparativasNomina/Totales';
import ImporteLiquido from '../../%Components/TablasComparativasNomina/ImporteLiquido';

const CargarDatos = () => {
    const resumenData = [
        { tipoNomina: 'ESTRUCTURA', percepciones: 3563493.50, deducciones: 93539.68, importeLiquido: 262809.82, empleados: 18 },
        { tipoNomina: 'BASE', percepciones: 4618518.46, deducciones: 1356652.16, importeLiquido: 3261866.30, empleados: 521 },
        { tipoNomina: 'NOM. 8', percepciones: 125772.35, deducciones: 20290.50, importeLiquido: 105481.85, empleados: 31 },
        { tipoNomina: 'TOTAL', percepciones: 5100640.31, deducciones: 1470482.34, importeLiquido: 3630157.97, empleados: 570 },
    ];

    const retencionesData = [
        { empleado: 0, retenciones: '-', totalReal: 262809.82 },
        { empleado: 1, retenciones: 3489.39, totalReal: 3258376.91 },
        { empleado: 1, retenciones: 3014.45, totalReal: 102467.40 },
        { empleado: 'TOTAL', retenciones: '3,623,654.13', totalReal: '3,623,654.13' }
    ];

    const depositoResumenData = [
        { tipoNomina: 'ESTRUCTURA', bruto: 3563493.50, deducciones: 93539.68, neto: 262809.82, empleados: 18 },
        { tipoNomina: 'ESTRUCTURA(SPEI)', bruto: 4618518.46, deducciones: 1356652.16, neto: 3261866.30, empleados: 521 },
        { tipoNomina: 'BASE', bruto: 125772.35, deducciones: 20290.50, neto: 105481.85, empleados: 31 },
        { tipoNomina: 'NOM. 8', bruto: 5100640.31, deducciones: 1470482.34, neto: 3630157.97, empleados: 570 },
        { tipoNomina: 'TOTAL', bruto: 5100640.31, deducciones: 1470482.34, neto: 3630157.97, empleados: 570 },
    ];

    const retencionesDepositoData = [
        { empleado: 0, retenciones: '-', totalReal: 2033707.98 },
        { empleado: 0, retenciones: '-', totalReal: 234699.23 },
        { empleado: 12, retenciones: 55759.84, totalReal: 18305527.56 },
        { empleado: 14, retenciones: 41855.83, totalReal: 2892475.08 },
        { empleado: 28, retenciones: 104119.51, totalReal: 27090063.98 }
    ];

    const totalesData = [
        { cheques: 'ESTRUCTURA', percepciones: 3325486.00, deducciones: 794268.97, importeLiquido: 2531217.03, empleados: 187 },
        { cheques: 'BASE', percepciones: 30667317.21, deducciones: 9044163.51, importeLiquido: 21623153.70, empleados: 3664 },
        { cheques: 'NOM. 8', percepciones: 3682534.77, deducciones: 642722.01, importeLiquido: 3039812.76, empleados: 877 },
        { cheques: 'TOTAL', percepciones: 37675337.98, deducciones: 10481154.49, importeLiquido: 27194183.49, empleados: 4728 },
    ];

    const importeLiquidoData = [
        { importeLiquidoTotal: 27194183.49, retencionesDeposito: 27090063.98, diferencia: 104119.51 },
    ];

    const components = [
        { id: 'chequesResumen', component: <ChequesResumen resumenData={resumenData} />, className: styles.gridItem1 },
        { id: 'retensiones', component: <Retenciones retencionesData={retencionesData} />, className: styles.gridItem2 },
        { id: 'depositoResumen', component: <DepositoResumen resumenData={depositoResumenData} />, className: styles.gridItem1 },
        { id: 'retensionesDeposito', component: <RetencionesDeposito retencionesDepositoData={retencionesDepositoData} />, className: styles.gridItem2 },
        { id: 'totales', component: <Totales totalesData={totalesData} />, className: styles.gridItem1 },
        { id: 'importeLiquido', component: <ImporteLiquido importeLiquidoData={importeLiquidoData} />, className: styles.gridItem2 },
    ];

    const exportExcel = () => {
        const workbook = XLSX.utils.book_new();

        const addSheetToWorkbook = (data, sheetName) => {
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        };

        addSheetToWorkbook(resumenData, 'Cheques Resumen');
        addSheetToWorkbook(depositoResumenData, 'Deposito Resumen');
        addSheetToWorkbook(retencionesData, 'Retenciones');
        addSheetToWorkbook(retencionesDepositoData, 'Retenciones Deposito');
        addSheetToWorkbook(totalesData, 'Totales');
        addSheetToWorkbook(importeLiquidoData, 'Importe Liquido');

        XLSX.writeFile(workbook, 'resumen.xlsx');
    };

    const exportPDF = async () => {
        const { jsPDF } = await import('jspdf');
        const autoTable = await import('jspdf-autotable');
        const doc = new jsPDF();

        const addDataToPDF = (data, title) => {
            const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 20; // Incrementar el espacio antes de la tabla
            doc.text(title, 14, startY - 10); // Incrementar el espacio antes del título
            autoTable.default(doc, {
                startY: startY,
                head: [Object.keys(data[0])],
                body: data.map(item => Object.values(item)),
            });
        };

        addDataToPDF(resumenData, 'CHEQUES RESUMEN (QNA 06/2024)');
        addDataToPDF(depositoResumenData, 'DEPOSITO RESUMEN (QNA 06/2024)');
        addDataToPDF(retencionesData, 'RETENCIONES');
        addDataToPDF(retencionesDepositoData, 'RETENCIONES DEPOSITO');
        addDataToPDF(totalesData, 'TOTALES');
        addDataToPDF(importeLiquidoData, 'IMPORTE LIQUIDO - RETENCIONES DE DEPOSITO');

        doc.save('resumen.pdf');
    };

    return (
        <ThemeProvider theme={theme}>
            <main className={styles.main}>
                <h1 className={styles.h1}>Procesar datos</h1>
                <div className={styles.grid}>
                    {components.map((item) => (
                        <div key={item.id} className={item.className}>
                            {item.component}
                        </div>
                    ))}
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
