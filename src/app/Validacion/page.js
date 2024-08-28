'use client';
import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { Button, Box, Select, MenuItem, Typography, Alert } from '@mui/material';
import TablaComparacionCampos from '../%Components/TablasCambios/TablaComparacionCampos';
import TablaConsultaBitacora from '../%Components/TablasCambios/TablaConsultaBitacora';
import TablaConsultaDetallesBitacora from '../%Components/TablasCambios/TablaConsultaDetallesBitacora';
import TablaBitacoraEmpleados from '../%Components/TablasCambios/TablaBitacoraEmpleados';
import { ThemeProvider } from '@mui/material';
import theme from '../$tema/theme';
import { useRouter } from 'next/navigation';

export default function Validacion() {

    // Hook para el router con el  App Router
    const router = useRouter();
    // Estados para los valores seleccionados en las listas desplegables
    const [anio, setAnio] = useState('2024');
    const [quincena, setQuincena] = useState('01');
    const [tipoNomina, setTipoNomina] = useState('BASE');
    const [tablaSeleccionada, setTablaSeleccionada] = useState('comparacion'); // Estado para la tabla seleccionada

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

    const tablas = [
        { label: 'Comparación de Campos', value: 'comparacion' },
        { label: 'Consulta de Bitácora', value: 'bitacora' },
        { label: 'Consulta de Detalles de Bitácora', value: 'detallesBitacora' },
        { label: 'Bitácora de Empleados', value: 'bitacoraEmpleados' },
    ];

    return (
        <ThemeProvider theme={theme}>
            <main className={styles.main}>
                <h1 className={styles.h1}>Validación de registros base vs post base y consulta de bitácora</h1>

                {/* Mensaje explicativo para el usuario */}
                <Alert severity="info" className={styles.alert}>
                    Esta es la ventana para visualizar los cambios en comparación con la nómina anterior. Aquí podrás ver las diferencias por quincena, tipo de nómina y detalle por empleado.
                </Alert>

                {/* Drop-down lists para Año, Quincena, Tipo de Nómina y Tabla a Mostrar */}
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

                <Box className={styles.selectorContainer}>
                    <p>Selecciona la tabla que quieras generar:</p>
                    <Select className={styles.tableSelector} value={tablaSeleccionada} onChange={(e) => setTablaSeleccionada(e.target.value)} variant="outlined">
                        {tablas.map((tabla, index) => (
                            <MenuItem key={index} value={tabla.value} >
                                {tabla.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {/* Renderizado condicional de las tablas según la selección */}
                {tablaSeleccionada === 'comparacion' && (
                    <div className={styles.tableContainer}>
                        <TablaComparacionCampos anio={anio} quincena={quincena} tipoNomina={tipoNomina} />
                        <hr />
                    </div>
                )}

                {tablaSeleccionada === 'bitacora' && (
                    <div className={styles.tableContainer}>
                        <TablaConsultaBitacora anio={anio} quincena={quincena} tipoNomina={tipoNomina} />
                        <hr />
                    </div>
                )}

                {tablaSeleccionada === 'detallesBitacora' && (
                    <div className={styles.tableContainer}>
                        <TablaConsultaDetallesBitacora anio={anio} quincena={quincena} tipoNomina={tipoNomina} />
                        <hr />
                    </div>
                )}

                {tablaSeleccionada === 'bitacoraEmpleados' && (
                    <div className={styles.tableContainer}>
                        <TablaBitacoraEmpleados anio={anio} quincena={quincena} tipoNomina={tipoNomina} />
                        <hr />
                    </div>
                )}

                <div className={styles.buttonContainer}>
                    {/* Botón para Procesar Datos */}
                    <Link href={`/CrearNomina/ProcesarDatos`} passHref>
                        <Button variant="contained" color="primary" className={styles.exportButton}>
                            Resumen de Nómina
                        </Button>
                    </Link>
                    {/* Botón para regresar a la página anterior */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => router.back()} // Regresa a la página anterior
                        className={styles.backButton}
                    >
                        Regresar
                    </Button>
                </div>

            </main>
        </ThemeProvider>
    );
}
