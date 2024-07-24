'use client'
import React, { useState } from 'react';
import styles from './page.module.css';
import TablaPostNomina from '../%Components/TablaPostNomina/TablaPostNomina';
import TablaResumenNomina from '../%Components/TablaResumenNomina/TablaResumenNomina';
import { ProgressBar } from 'primereact/progressbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ThemeProvider, Box, Typography, Button, Select, MenuItem } from '@mui/material';
import theme from '../$tema/theme'; // Asegúrate de que la ruta sea correcta
import Link from 'next/link';

export default function CargarDatos() {
    const [quincena, setQuincena] = useState('01');
    const [fecha, setFecha] = useState(new Date());
    const [progressPostNomina, setProgressPostNomina] = useState(0);
    const [progressResumenNomina, setProgressResumenNomina] = useState(0);

    const handleDateChange = (date) => {
        setFecha(date);
    };

    const handleFileUploadPostNomina = () => {
        setProgressPostNomina(0);
        setTimeout(() => {
            let progressInterval = setInterval(() => {
                setProgressPostNomina((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prevProgress + 10;
                });
            }, 300);
        }, 100);
    };

    const handleFileUploadResumenNomina = () => {
        setProgressResumenNomina(0);
        setTimeout(() => {
            let progressInterval = setInterval(() => {
                setProgressResumenNomina((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prevProgress + 10;
                });
            }, 300);
        }, 100);
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
                    <DatePicker selected={fecha} onChange={handleDateChange} dateFormat="dd-MM-yyyy" className={styles.datePicker} portalId="root-portal" />
                </Box>
                <Typography variant="h5" className={styles.h2}>Post Nomina</Typography>
                <Box className={styles.progressContainer}>
                    <Typography>Progreso de datos</Typography>
                    <ProgressBar value={progressPostNomina} className={styles.progressBar} />
                </Box>
                <Button variant="contained" component="label" className={styles.uploadButton}>
                    Subir archivo
                    <input type="file" hidden onChange={handleFileUploadPostNomina} />
                </Button>
                <TablaPostNomina />
                <Typography variant="h5" className={styles.h2}>Resumen de Nomina</Typography>
                <Box className={styles.progressContainer}>
                    <ProgressBar value={progressResumenNomina} className={styles.progressBar} />
                </Box>
                <Button variant="contained" component="label" className={styles.uploadButton}>
                    Subir archivo
                    <input type="file" hidden onChange={handleFileUploadResumenNomina} />
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
