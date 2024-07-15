'use client';
import React from 'react';
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    ThemeProvider
} from '@mui/material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import theme from '../../$tema/theme';
import styles from './ConfigurableTable.module.css';

const ViewOnlyTable = ({ year, data }) => {
    const quincenas = [
        "1RA. ENE", "2DA. ENE", "1RA. FEB", "2DA. FEB", "1RA. MAR", "2DA. MAR",
        "1RA. ABR", "2DA. ABR", "1RA. MAY", "2DA. MAY", "1RA. JUN", "2DA. JUN",
        "1RA. JUL", "2DA. JUL", "1RA. AGO", "2DA. AGO", "1RA. SEP", "2DA. SEP",
        "1RA. OCT", "2DA. OCT", "1RA. NOV", "2DA. NOV", "1RA. DIC", "2DA. DIC"
    ];

    const headers = [
        "Quincena", "Captura e Importación", "Revisiones y Cálculo de Nómina", "Pre-Nómina",
        "Validación de Pre-Nómina", "Atención a los Problemas", "Cierre de Proceso",
        "Publicación en Web", "Traslado de la CLC", "Ministración de Tarjetas", "Días de Pago",
        "Inicio de Captura", "Cierre de Captura", "Publicación Web"
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
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell
                                    key={header}
                                    sx={{
                                        backgroundColor: theme.palette.secondary.main,
                                        color: 'white',
                                        textAlign: 'center',
                                    }}
                                    className={styles.tableHeader}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {quincenas.map((quincena, index) => (
                            <TableRow key={quincena}>
                                <TableCell>{quincena}</TableCell>
                                {data[index] && Object.keys(data[index]).map((key) => (
                                    <TableCell key={key} sx={{ minWidth: 180 }}>
                                        {data[index][key] ? new Date(data[index][key]).toLocaleDateString() : ''}
                                    </TableCell>
                                ))}
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
