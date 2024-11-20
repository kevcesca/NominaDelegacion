'use client';

import React, { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Toast } from 'primereact/toast';
import styles from './page.module.css';
import TablaEstadosCuenta from '../%Components/TablaEstadosCuenta/TablaEstadosCuenta'; // Actualiza la ruta si es necesario
import TablaRetenciones from '../%Components/TablaRetenciones/TablaRetenciones';
import DataTableExample from '../%Components/TablaListaEstadosCuenta/TablaListaEstadosCuenta'; // Importa la nueva tabla
import { ProgressBar } from 'primereact/progressbar';
import { ThemeProvider, Box, Typography } from '@mui/material';
import theme from '../$tema/theme';  // Importa correctamente el tema aquí
import withAdminRole from '../%Components/hoc/withAdminRole';
import API_BASE_URL from '../%Config/apiConfig';
import DateSelector from '../%Components/DateSelector/DateSelector';  // Importar el nuevo componente

function CargarEstadosCuenta() {
    const [mes, setMes] = useState('');
    const [anio, setAnio] = useState('');
    const [quincena, setQuincena] = useState('');
    const [progressEstadosCuenta, setProgressEstadosCuenta] = useState(0);
    const [progressRetenciones, setProgressRetenciones] = useState(0);
    const toast = useRef(null);

    return (
        <ThemeProvider theme={theme}>
            <Toast ref={toast} />
            <Box className={styles.main}>
                <Typography variant="h4" className={styles.h1}>Carga de Estados de Cuenta y Retenciones</Typography>
                <DateSelector setMes={setMes} setAnio={setAnio} setQuincena={setQuincena} />

                {/* Sección de Estados de Cuenta */}
                <Typography variant="h5" className={styles.h2}>Estados de Cuenta</Typography>
                <TablaEstadosCuenta
                    anio={anio}
                    mes={mes}
                    quincena={quincena}  // Pasar quincena como prop
                    setProgress={setProgressEstadosCuenta}
                    setUploaded={() => {}}
                />

                {/* Sección de Retenciones */}
                <Typography variant="h5" className={styles.h2}>Dispersiones</Typography>
                <Box className={styles.progressContainer}>
                    <Typography>Progreso de datos</Typography>
                    <ProgressBar value={progressRetenciones} className={styles.progressBar} />
                </Box>
                <TablaRetenciones
                    anio={anio}
                    mes={mes}
                    quincena={quincena}  // Pasar quincena como prop
                    setProgress={setProgressRetenciones}
                    setUploaded={() => {}}
                />
            </Box>
        </ThemeProvider>
    );
}

export default CargarEstadosCuenta;
