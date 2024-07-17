'use client';
import React from 'react';
import {
    Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Typography,
    ThemeProvider
} from '@mui/material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import theme from '../../$tema/theme';
import styles from './ConfigurableTable.module.css';

const ViewOnlyTable = ({ year, data }) => {
    const headers = [
        { title: "Quincena", colSpan: 1 },
        { title: "Captura e Importación", colSpan: 1 },
        { title: "Revisiones y Cálculo de Nómina", colSpan: 2 },
        { title: "Pre-Nómina", colSpan: 1 },
        { title: "Validación de Pre-Nómina", colSpan: 1 },
        { title: "Atención a los Problemas", colSpan: 2 },
        { title: "Cierre de Proceso", colSpan: 1 },
        { title: "Publicación en Web", colSpan: 1 },
        { title: "Traslado de la CLC", colSpan: 1 },
        { title: "Ministración de Tarjetas", colSpan: 1 },
        { title: "Días de Pago", colSpan: 2 },
        { title: "Cierre de Captura", colSpan: 1 },
        { title: "Publicación en Web", colSpan: 1 }
    ];

    const exportToPDF = () => {
        const input = document.getElementById('tableContainer');
        html2canvas(input, { scrollX: -window.scrollX, scrollY: -window.scrollY, width: input.scrollWidth, height: input.scrollHeight }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape');
            pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            pdf.save(`Calendario_${year}.pdf`);
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Box className={styles.tableContainer} id="tableContainer">
                <h3 className={styles.tituloTabla} gutterBottom>
                    Calendario de Procesos de la Nómina {year}
                </h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers.map((header, index) => (
                                <TableCell
                                    key={index}
                                    colSpan={header.colSpan}
                                    sx={{
                                        backgroundColor: theme.palette.secondary.main,
                                        color: 'white',
                                        textAlign: 'center',
                                        border: '1px solid white' // Bordes blancos
                                    }}
                                    className={styles.tableHeader}
                                >
                                    {header.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.quincena}</TableCell>
                                <TableCell>{new Date(row.capturaImportacion).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.revision1).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.revision2).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.preNomina).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.validacionPreNomina).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.atencion1).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.atencion2).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.cierre).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.publicacionWeb1).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.traslado).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.ministracion).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.diasPago1).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.diasPago2).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.cierreCaptura).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(row.publicacionWeb2).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button variant="contained" color="primary" onClick={exportToPDF} sx={{ marginTop: 2 }}>
                    Exportar a PDF
                </Button>
            </Box>
        </ThemeProvider>
    );
};

export default ViewOnlyTable;
