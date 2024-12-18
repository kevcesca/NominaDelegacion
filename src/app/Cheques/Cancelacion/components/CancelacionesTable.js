import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import styles from '../page.module.css';

// Función para construir la URL de descarga
const getDownloadURL = (quincena, anio, nombreEvidencia) => {
    const nombreSinExtension = removeFileExtension(nombreEvidencia);
    return `http://192.168.100.25:7080/Nomina/download/evidencias?quincena=${quincena}&anio=${anio}&tipo=Evidencias&nombre=${encodeURIComponent(
        nombreSinExtension
    )}`;
};

// Función para remover la extensión del archivo
const removeFileExtension = (fileName) => {
    return fileName.split('.').slice(0, -1).join('.') || fileName; // Elimina la última parte después del punto
};

export default function CancelacionesTable({ cancelaciones, loading, fechaSeleccionada }) {
    return (
        <TableContainer component={Paper} className={styles.tableContainer}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={headerStyle}>ID Empleado</TableCell>
                        <TableCell sx={headerStyle}>Folio Cheque</TableCell>
                        <TableCell sx={headerStyle}>Número Quincena</TableCell>
                        <TableCell sx={headerStyle}>Tipo Nómina</TableCell>
                        <TableCell sx={headerStyle}>Motivo Cancelación</TableCell>
                        <TableCell sx={headerStyle}>Fecha Cancelación</TableCell>
                        <TableCell sx={headerStyle}>Monto</TableCell>
                        <TableCell sx={headerStyle}>Evidencia</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                                Cargando...
                            </TableCell>
                        </TableRow>
                    ) : cancelaciones.length > 0 ? (
                        cancelaciones.map((item) => (
                            <TableRow key={item.id} className={styles.tableRow}>
                                <TableCell>{item.id_empleado}</TableCell>
                                <TableCell>{item.folio_cheque}</TableCell>
                                <TableCell>{item.numero_quincena}</TableCell>
                                <TableCell>{item.tipo_nomina}</TableCell>
                                <TableCell>{item.motivo_cancelacion}</TableCell>
                                <TableCell>{item.fecha_cancelacion}</TableCell>
                                <TableCell>{`$${item.monto.toFixed(2)}`}</TableCell>
                                <TableCell>
                                    {item.evidencia ? (
                                        <a
                                            href={getDownloadURL(
                                                fechaSeleccionada.quincena,
                                                fechaSeleccionada.anio,
                                                item.evidencia
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#1976D2', textDecoration: 'underline' }}
                                        >
                                            {removeFileExtension(item.evidencia)}
                                        </a>
                                    ) : (
                                        'No disponible'
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} sx={{ textAlign: 'center', color: '#800000' }}>
                                No hay registros disponibles.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const headerStyle = {
    backgroundColor: '#800000',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
};
