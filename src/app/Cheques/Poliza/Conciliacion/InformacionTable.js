import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import styles from '../page.module.css';

export default function InformacionTable({ data, loading }) {
    return (
        <TableContainer component={Paper} className={styles.tableContainer}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                backgroundColor: '#800000',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        >
                            Poliza No.
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: '#800000',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        >
                            No. de Cheque
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: '#800000',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        >
                            No. de Empleado
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: '#800000',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        >
                            Nombre del Beneficiario
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: '#800000',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        >
                            Deducciones
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: '#800000',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        >
                            Percepciones
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: '#800000',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        >
                            Líquido
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: '#800000',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        >
                            Concepto de Pago
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: '#800000',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        >
                            R.F.C.
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: '#800000',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        >
                            Tipo de Nómina
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: '#800000',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        >
                            Fecha
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: '#800000',
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        >
                            Quincena
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={12} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                Cargando...
                            </TableCell>
                        </TableRow>
                    ) : data.length > 0 ? (
                        data.map((row, index) => (
                            <TableRow
                                key={index}
                                className={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
                            >
                                <TableCell className={styles.tableCell}>{row["Poliza No."]}</TableCell>
                                <TableCell className={styles.tableCell}>{row["No. de Cheque"]}</TableCell>
                                <TableCell className={styles.tableCell}>{row["No. de Empleado"]}</TableCell>
                                <TableCell className={styles.tableCell}>{row["Nombre del Beneficiario"]}</TableCell>
                                <TableCell className={styles.tableCell}>{row["Deducciones"]}</TableCell>
                                <TableCell className={styles.tableCell}>{row["Percepciones"]}</TableCell>
                                <TableCell className={styles.tableCell}>{row["Liquido"]}</TableCell>
                                <TableCell className={styles.tableCell}>{row["Concepto de Pago"]}</TableCell>
                                <TableCell className={styles.tableCell}>{row["R.F.C."]}</TableCell>
                                <TableCell className={styles.tableCell}>{row["Tipo de Nómina"]}</TableCell>
                                <TableCell className={styles.tableCell}>{row["Fecha"]}</TableCell>
                                <TableCell className={styles.tableCell}>{row["Quincena"]}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={12} sx={{ textAlign: 'center', color: '#800000', fontWeight: 'bold' }}>
                                No hay registros disponibles
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
