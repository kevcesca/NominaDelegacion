// src/app/CrearNomina/page.js
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import TablaPostNomina from '../%Components/TablaPostNomina/TablaPostNomina';
import TablaResumenNomina from '../%Components/TablaResumenNomina/TablaResumenNomina';
import { ProgressBar } from 'primereact/progressbar';
import { ThemeProvider, Box, Typography, Button, Select, MenuItem } from '@mui/material';
import theme from '../$tema/theme'; // Asegúrate de que la ruta sea correcta
import Link from 'next/link';

export default function CargarDatos() {
    const { data: session } = useSession(); // Obtener la sesión desde el cliente
    const [quincena, setQuincena] = useState('01');
    const [anio, setAnio] = useState(2020);
    const [tipoNomina, setTipoNomina] = useState('Base');
    const [progressPostNomina, setProgressPostNomina] = useState(0);
    const [progressResumenNomina, setProgressResumenNomina] = useState(0);

    useEffect(() => {
        console.log("Session:", session);
    }, [session]);

    const handleFileUpload = async (event, setProgress) => {
        const file = event.target.files[0];
        if (!file) return;

        setProgress(0);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`http://192.168.100.77:8080/uploads?anio=${anio}&quincena=${quincena}&tipo=${tipoNomina}&usuario=${session?.user?.name || 'unknown'}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(progress);
                },
            });
            console.log('File uploaded successfully', response.data);
        } catch (error) {
            console.error('Error uploading file', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box className={styles.main}>
                <Typography variant="h4" className={styles.h1}>Resumen de carga de datos</Typography>
                <Box className={styles.selectorContainer}>
                    <Select value={quincena} onChange={(e) => setQuincena(e.target.value)} variant="outlined">
                        {[...Array(24).keys()].map(n => (
                            <MenuItem key={n + 1} value={(n + 1).toString().padStart(2, '0')}>
                                Quincena {(n + 1).toString().padStart(2, '0')}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select value={anio} onChange={(e) => setAnio(e.target.value)} variant="outlined">
                        {[...Array(21).keys()].map(n => (
                            <MenuItem key={2020 + n} value={2020 + n}>
                                Año {2020 + n}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select value={tipoNomina} onChange={(e) => setTipoNomina(e.target.value)} variant="outlined">
                        <MenuItem value="Base">Base</MenuItem>
                        <MenuItem value="Estructura">Estructura</MenuItem>
                        <MenuItem value="Nomina 8">Nomina 8</MenuItem>
                        <MenuItem value="Honorarios">Honorarios</MenuItem>
                    </Select>
                </Box>
                <Typography variant="h5" className={styles.h2}>Post Nomina</Typography>
                <Box className={styles.progressContainer}>
                    <Typography>Progreso de datos</Typography>
                    <ProgressBar value={progressPostNomina} className={styles.progressBar} />
                </Box>
                <Button variant="contained" component="label" className={styles.uploadButton}>
                    Subir archivo
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, setProgressPostNomina)} accept=".xlsx" />
                </Button>
                <TablaPostNomina />
                <Typography variant="h5" className={styles.h2}>Resumen de Nomina</Typography>
                <Box className={styles.progressContainer}>
                    <ProgressBar value={progressResumenNomina} className={styles.progressBar} />
                </Box>
                <Button variant="contained" component="label" className={styles.uploadButton}>
                    Subir archivo
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, setProgressResumenNomina)} accept=".xlsx" />
                </Button>
                <TablaResumenNomina />
                <Box className={styles.buttonContainer}>
                    <Link href="/CrearNomina/ProcesarDatos" passHref>
                        <Button variant="contained" color="primary" className={styles.exportButton}>
                            Procesar datos
                        </Button>
                    </Link>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
