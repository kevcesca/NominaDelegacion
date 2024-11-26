'use client';

import React, { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Toast } from 'primereact/toast';
import styles from './page.module.css';
import TablaEstadosCuenta from '../%Components/TablaEstadosCuenta/TablaEstadosCuenta'; // Actualiza la ruta si es necesario
import TablaRetenciones from '../%Components/TablaRetenciones/TablaRetenciones';
import DateSelector from '../%Components/DateSelector/DateSelector'; // Importar el nuevo componente
import { ProgressBar } from 'primereact/progressbar';
import { ThemeProvider, Box, Typography } from '@mui/material';
import theme from '../$tema/theme'; // Importa correctamente el tema aquí
import HeaderSeccion from '../%Components/HeaderSeccion/HeaderSeccion'; // Importar el componente HeaderSeccion

function CargarEstadosCuenta() {
    const [mes, setMes] = useState('');
    const [anio, setAnio] = useState('');
    const [quincena, setQuincena] = useState('');
    const [progressEstadosCuenta, setProgressEstadosCuenta] = useState(0);
    const [progressRetenciones, setProgressRetenciones] = useState(0);

    // Estados para manejar la visibilidad de las secciones (inicialmente en falso)
    const [isEstadosCuentaOpen, setIsEstadosCuentaOpen] = useState(false);
    const [isDispersionesOpen, setIsDispersionesOpen] = useState(false);

    const toast = useRef(null);

    return (
        <ThemeProvider theme={theme}>
            <Toast ref={toast} />
            <Box className={styles.main}>
                {/* Título Principal */}
                <Typography variant="h4" className={styles.h1}>
                    Carga de Estados de Cuenta y Retenciones
                </Typography>

                {/* Selector de Fecha */}
                <DateSelector setMes={setMes} setAnio={setAnio} setQuincena={setQuincena} />

                {/* Sección de Estados de Cuenta */}
                <HeaderSeccion
                    titulo="Estados de Cuenta"
                    isOpen={isEstadosCuentaOpen}
                    onToggle={() => setIsEstadosCuentaOpen(!isEstadosCuentaOpen)}
                />
                {isEstadosCuentaOpen && (
                    <TablaEstadosCuenta
                        anio={anio}
                        mes={mes}
                        quincena={quincena} // Pasar quincena como prop
                        setProgress={setProgressEstadosCuenta}
                        setUploaded={() => {}}
                    />
                )}

                {/* Sección de Dispersiones */}
                <HeaderSeccion
                    titulo="Dispersiones"
                    isOpen={isDispersionesOpen}
                    onToggle={() => setIsDispersionesOpen(!isDispersionesOpen)}
                />
                {isDispersionesOpen && (
                    <>
                        <Box className={styles.progressContainer}>
                            <Typography>Progreso de datos</Typography>
                            <ProgressBar value={progressRetenciones} className={styles.progressBar} />
                        </Box>
                        <TablaRetenciones
                            anio={anio}
                            mes={mes}
                            quincena={quincena} // Pasar quincena como prop
                            setProgress={setProgressRetenciones}
                            setUploaded={() => {}}
                        />
                    </>
                )}
            </Box>
        </ThemeProvider>
    );
}

export default CargarEstadosCuenta;
