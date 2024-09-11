'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { Button, Box, Select, MenuItem, Alert } from '@mui/material';
import TablaConsultaDetallesBitacora from '../%Components/TablasCambios/TablaConsultaDetallesBitacora';
import { ThemeProvider } from '@mui/material';
import theme from '../$tema/theme';
import Link from 'next/link';

export default function Validacion() {
    const searchParams = useSearchParams(); // Hook para obtener los parámetros de la URL
    const router = useRouter();

    // Obtener anio y quincena de los parámetros de la URL
    const anioParam = searchParams.get('anio');
    const quincenaParam = searchParams.get('quincena');

    // Estados para los valores seleccionados en las listas desplegables
    const [anio, setAnio] = useState(anioParam || '2024'); // Usar el valor de la URL o un valor por defecto
    const [quincena, setQuincena] = useState(quincenaParam || '01'); // Usar el valor de la URL o un valor por defecto
    const [tipoNomina, setTipoNomina] = useState('BASE');

    // Definición de las quincenas completas
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

    // Definición de los tipos de nómina
    const tiposNomina = [
        { label: 'Base', value: 'BASE' },
        { label: 'Honorarios', value: 'HONORARIOS' },
        { label: 'Extraordinarios', value: 'EXTRAORDINARIOS' },
    ];

    // Función para navegar al Resumen de Nómina con los parámetros seleccionados
    const handleNavigateToResumen = () => {
        router.push(`/CrearNomina/ProcesarDatos?anio=${anio}&quincena=${quincena}`);
    };

    return (
        <ThemeProvider theme={theme}>
            <main className={styles.main}>
                <h1 className={styles.h1}>Validación de registros base vs post base y consulta de bitácora</h1>

                {/* Mensaje explicativo para el usuario */}
                <Alert severity="info" className={styles.alert}>
                    Esta es la ventana para visualizar los cambios en comparación con la nómina anterior. Aquí podrás ver las diferencias por quincena, tipo de nómina y detalle por empleado.
                </Alert>

                {/* Selectores para Año, Quincena y Tipo de Nómina */}
                <Box className={styles.selectorContainer}>
                    {/* Selector para Año */}
                    <Select value={anio} onChange={(e) => setAnio(e.target.value)} variant="outlined">
                        {[...Array(21).keys()].map(n => (
                            <MenuItem key={2024 + n} value={2024 + n}>
                                Año {2024 + n}
                            </MenuItem>
                        ))}
                    </Select>

                    {/* Selector para Quincena */}
                    <Select value={quincena} onChange={(e) => setQuincena(e.target.value)} variant="outlined">
                        {quincenas.map((quin, index) => (
                            <MenuItem key={index} value={quin.value}>
                                {quin.label}
                            </MenuItem>
                        ))}
                    </Select>

                    {/* Selector para Tipo de Nómina */}
                    <Select value={tipoNomina} onChange={(e) => setTipoNomina(e.target.value)} variant="outlined">
                        {tiposNomina.map((tipo, index) => (
                            <MenuItem key={index} value={tipo.value}>
                                {tipo.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {/* Tabla de consulta */}
                <div className={styles.tableContainer}>
                    <TablaConsultaDetallesBitacora anio={anio} quincena={quincena} tipoNomina={tipoNomina} />
                    <hr />
                </div>

                {/* Botones de navegación */}
                <div className={styles.buttonContainer}>
                    {/* Botón para ir al Resumen de Nómina con parámetros en la URL */}
                    <Button 
                        variant="contained" 
                        color="primary" 
                        className={styles.exportButton} 
                        onClick={handleNavigateToResumen}
                    >
                        Resumen de Nómina
                    </Button>
                    
                    {/* Botón para regresar */}
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
