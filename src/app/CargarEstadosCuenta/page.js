'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Toast } from 'primereact/toast';
import styles from './page.module.css';
import TablaEstadosCuenta from '../%Components/TablaEstadosCuenta/TablaEstadosCuenta'; // Actualiza la ruta si es necesario
import TablaRetenciones from '../%Components/TablaRetenciones/TablaRetenciones';
import DataTableExample from '../%Components/TablaListaEstadosCuenta/TablaListaEstadosCuenta'; // Importa la nueva tabla
import { ProgressBar } from 'primereact/progressbar';
import { ThemeProvider, Box, Typography, Button, Select, MenuItem } from '@mui/material';
import theme from '../$tema/theme';  // Importa correctamente el tema aquí
import Link from 'next/link';
import withAdminRole from '../%Components/hoc/withAdminRole';
import API_BASE_URL from '../%Config/apiConfig';

function CargarEstadosCuenta() {
    const { data: session } = useSession();
    const [mes, setMes] = useState('01');
    const [anio, setAnio] = useState('2024');
    const [progressEstadosCuenta, setProgressEstadosCuenta] = useState(0);
    const [progressRetenciones, setProgressRetenciones] = useState(0);
    const toast = useRef(null);

    const meses = [
        { label: 'Enero', value: '01' },
        { label: 'Febrero', value: '02' },
        { label: 'Marzo', value: '03' },
        { label: 'Abril', value: '04' },
        { label: 'Mayo', value: '05' },
        { label: 'Junio', value: '06' },
        { label: 'Julio', value: '07' },
        { label: 'Agosto', value: '08' },
        { label: 'Septiembre', value: '09' },
        { label: 'Octubre', value: '10' },
        { label: 'Noviembre', value: '11' },
        { label: 'Diciembre', value: '12' },
    ];

    useEffect(() => {
        console.log("Session:", session);
    }, [session]);

    return (
        <ThemeProvider theme={theme}>
            <Toast ref={toast} />
            <Box className={styles.main}>
                <Typography variant="h4" className={styles.h1}>Carga de Estados de Cuenta y Retenciones</Typography>
                <Box className={styles.selectorContainer}>
                    <Select value={mes} onChange={(e) => setMes(e.target.value)} variant="outlined">
                        {meses.map((mesItem, index) => (
                            <MenuItem key={index} value={mesItem.value}>
                                {mesItem.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select value={anio} onChange={(e) => setAnio(e.target.value)} variant="outlined">
                        {[...Array(21).keys()].map(n => (
                            <MenuItem key={2024 + n} value={2024 + n}>
                                Año {2024 + n}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {/* Sección de Estados de Cuenta */}
                <Typography variant="h5" className={styles.h2}>Estados de Cuenta</Typography>
                <Box className={styles.progressContainer}>
                    <Typography>Progreso de datos</Typography>
                    <ProgressBar value={progressEstadosCuenta} className={styles.progressBar} />
                </Box>
                <TablaEstadosCuenta
                    anio={anio}
                    mes={mes}
                    session={session}
                    setProgress={setProgressEstadosCuenta}
                    setUploaded={() => {}}
                />
                <DataTableExample className={styles.margin} />

                {/* Sección de Retenciones */}
                <Typography variant="h5" className={styles.h2}>Retenciones</Typography>
                <Box className={styles.progressContainer}>
                    <Typography>Progreso de datos</Typography>
                    <ProgressBar value={progressRetenciones} className={styles.progressBar} />
                </Box>
                <TablaRetenciones
                    anio={anio}
                    mes={mes}
                    session={session}
                    setProgress={setProgressRetenciones}
                    setUploaded={() => {}}
                />

            </Box>
        </ThemeProvider>
    );
}

export default withAdminRole(CargarEstadosCuenta);
