'use client';

import React, { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Toast } from 'primereact/toast';
import styles from './page.module.css';
import TablaEstadosCuenta from '../%Components/TablaEstadosCuenta/TablaEstadosCuenta'; // Asegúrate de que la ruta sea correcta
import TablaRetenciones from '../%Components/TablaRetenciones/TablaRetenciones';
import DateFilter from '../%Components/DateFilter/DateFilter'; // Importar DateFilter en lugar de DateSelector
import { ProgressBar } from 'primereact/progressbar'; 
import { ThemeProvider, Box, Typography } from '@mui/material';
import theme from '../$tema/theme'; // Importa correctamente el tema
import HeaderSeccion from '../%Components/HeaderSeccion/HeaderSeccion';

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

    // Callback para manejar el cambio de fecha desde DateFilter
    const handleDateChange = ({ anio, quincena }) => {
        setAnio(anio);
        setQuincena(quincena);

        // En este caso, el mes no lo estamos tomando directamente desde DateFilter, pero podrías actualizarlo también si lo deseas
        const fechaActual = new Date();
        setMes(fechaActual.getMonth() + 1); // Mes actual
    };

    return (
        <ThemeProvider theme={theme}>
            <Toast ref={toast} />
            <Box className={styles.main}>
                {/* Título Principal */}
                <Typography variant="h4" className={styles.h1}>
                    Carga de Estados de Cuenta y Retenciones
                </Typography>

                {/* Selector de Fecha usando DateFilter */}
                <DateFilter onDateChange={handleDateChange} />

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
                            quincena={quincena} // Pasar quincena como...
                        />
                    </>
                )}
            </Box>
        </ThemeProvider>
    );
}

export default CargarEstadosCuenta;
