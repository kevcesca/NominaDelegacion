import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import styles from '../page.module.css';

export default function PolizasTable({ polizas, loading }) {
    return (
        <TableContainer component={Paper} className={styles.tableContainer}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ backgroundColor: '#800000', color: 'white', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            ID Empleado
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#800000', color: 'white', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Folio Cheque
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#800000', color: 'white', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Folio Póliza
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#800000', color: 'white', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Concepto de Pago
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#800000', color: 'white', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Percepciones
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#800000', color: 'white', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Deducciones
                        </TableCell>
                        <TableCell sx={{ backgroundColor: '#800000', color: 'white', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Líquido
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                Cargando...
                            </TableCell>
                        </TableRow>
                    ) : polizas.length > 0 ? (
                        polizas.map((poliza) => (
                            <TableRow key={poliza.id} className={styles.tableRow}>
                                <TableCell className={styles.tableCell}>{poliza.id_empleado}</TableCell>
                                <TableCell className={styles.tableCell}>{poliza.folio_cheque}</TableCell>
                                <TableCell className={styles.tableCell}>{poliza.folio_poliza}</TableCell>
                                <TableCell className={styles.tableCell}>{poliza.concepto_pago}</TableCell>
                                <TableCell className={styles.tableCell}>{`$${poliza.percepciones.toFixed(2)}`}</TableCell>
                                <TableCell className={styles.tableCell}>{`$${poliza.deducciones.toFixed(2)}`}</TableCell>
                                <TableCell className={styles.tableCell}>{`$${poliza.liquido.toFixed(2)}`}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#800000', fontWeight: 'bold' }}>
                                No hay registros disponibles
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
