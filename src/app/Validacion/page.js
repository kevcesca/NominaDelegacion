'use client';
import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { Button, Box, Select, MenuItem, Typography } from '@mui/material';
import TablaComparacionCampos from '../%Components/TablasCambios/TablaComparacionCampos';
import TablaConsultaBitacora from '../%Components/TablasCambios/TablaConsultaBitacora';
import TablaConsultaDetallesBitacora from '../%Components/TablasCambios/TablaConsultaDetallesBitacora'; // Importa la nueva tabla
import { ThemeProvider } from '@mui/material';
import theme from '../$tema/theme';

export default function Validacion() {
    // Estados para los valores seleccionados en las listas desplegables
    const [anio, setAnio] = useState('2024');
    const [quincena, setQuincena] = useState('01');
    const [tipoNomina, setTipoNomina] = useState('BASE');

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

    const tiposNomina = [
        { label: 'Base', value: 'BASE' },
        { label: 'Honorarios', value: 'HONORARIOS' },
        { label: 'Extraordinarios', value: 'EXTRAORDINARIOS' },
    ];

    return (
        <ThemeProvider theme={theme}>
            <main className={styles.main}>
                <h1 className={styles.h1}>Validación de registros base vs post base y consulta de bitácora</h1>

                {/* Drop-down lists para Año, Quincena y Tipo de Nómina */}
                <Box className={styles.selectorContainer}>
                    <Select value={anio} onChange={(e) => setAnio(e.target.value)} variant="outlined">
                        {[...Array(21).keys()].map(n => (
                            <MenuItem key={2024 + n} value={2024 + n}>
                                Año {2024 + n}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select value={quincena} onChange={(e) => setQuincena(e.target.value)} variant="outlined">
                        {quincenas.map((quin, index) => (
                            <MenuItem key={index} value={quin.value}>
                                {quin.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select value={tipoNomina} onChange={(e) => setTipoNomina(e.target.value)} variant="outlined">
                        {tiposNomina.map((tipo, index) => (
                            <MenuItem key={index} value={tipo.value}>
                                {tipo.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {/* Tabla de Comparación de Campos */}
                <div className={styles.tableContainer}>
                    <Typography variant="h5" className={styles.tableHeader}>Comparación de Campos</Typography>
                    <TablaComparacionCampos anio={anio} quincena={quincena} tipoNomina={tipoNomina} />
                </div>

                {/* Tabla de Consulta de Bitácora */}
                <div className={styles.tableContainer}>
                    <Typography variant="h5" className={styles.tableHeader}>Consulta de Bitácora</Typography>
                    <TablaConsultaBitacora anio={anio} quincena={quincena} tipoNomina={tipoNomina} />
                </div>

                {/* Tabla de Consulta de Detalles de Bitácora */}
                <div className={styles.tableContainer}>
                    <Typography variant="h5" className={styles.tableHeader}>Consulta de Detalles de Bitácora</Typography>
                    <TablaConsultaDetallesBitacora anio={anio} quincena={quincena} tipoNomina={tipoNomina} />
                </div>

                {/* Leyenda de Colores */}
                <div className={styles.legend}>
                    <div className={styles.legendItem}>
                        <span className={`${styles.legendColor} ${styles.noCoinciden}`}></span>
                        No coinciden los valores de líquido VS post
                    </div>
                    <div className={styles.legendItem}>
                        <span className={`${styles.legendColor} ${styles.cambioCuenta}`}></span>
                        Cambió el número de cuenta
                    </div>
                    <div className={styles.legendItem}>
                        <span className={`${styles.legendColor} ${styles.incompleto}`}></span>
                        No se encuentran los registros completos
                    </div>
                </div>

                {/* Botón para Procesar Datos */}
                <Link href={`/CrearNomina/ProcesarDatos`} passHref>
                    <Button variant="contained" color="primary" className={styles.exportButton}>
                        Validar datos
                    </Button>
                </Link>
            </main>
        </ThemeProvider>
    );
}
