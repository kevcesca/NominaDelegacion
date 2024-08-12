// src/app/CrearNomina/page.js
'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Toast } from 'primereact/toast';
import styles from './page.module.css';
import TablaPostNomina from '../%Components/TablaPostNomina/TablaPostNomina';
import TablaQuincenasExtraordinarias from '../%Components/TablaPostNomina/TablaQuincenasExtraordinarias';
import TablaFiniquitos from '../%Components/TablaPostNomina/TablaFiniquitos';
import TablaResumenNomina from '../%Components/TablaResumenNomina/TablaResumenNomina';
import TablaEstadosCuenta from '../%Components/TablaEstadosCuenta/TablaEstadosCuenta';
import { ProgressBar } from 'primereact/progressbar';
import { ThemeProvider, Box, Typography, Button, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';
import theme from '../$tema/theme';
import Link from 'next/link';
import withAdminRole from '../%Components/hoc/withAdminRole';  // Importa el HOC

function CargarDatos() {
    const { data: session } = useSession();
    const [quincena, setQuincena] = useState('01');
    const [anio, setAnio] = useState('2024');
    const [progressPostNomina, setProgressPostNomina] = useState(0);
    const [progressResumenNomina, setProgressResumenNomina] = useState(0);
    const [postNominaUploaded, setPostNominaUploaded] = useState(false);
    const [showExtraordinarias, setShowExtraordinarias] = useState(false);
    const [showFiniquitos, setShowFiniquitos] = useState(false);
    const [showEstadosCuenta, setShowEstadosCuenta] = useState(false);  // Nuevo estado para el switch
    const toast = useRef(null);

    useEffect(() => {
        console.log("Session:", session);
    }, [session]);

    const handleFileUpload = async (event, tipoNomina, setProgress, setUploaded, extra = '') => {
        const file = event.target.files[0];
        if (!file) return;

        setProgress(0);
        setUploaded(false);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('extra', extra);  // Siempre enviar el parámetro extra

        try {
            const response = await axios.post(`http://192.168.100.215:8080/uploads?quincena=${quincena}&anio=${String(anio)}&tipo=${tipoNomina.toLowerCase()}&usuario=${session?.user?.name || 'unknown'}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(progress);
                },
            });
            setProgress(100);
            setUploaded(true);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Archivo subido correctamente: ${response.data.message}`, life: 3000 });
            console.log('File uploaded successfully', response.data);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
            console.error('Error uploading file', error);
        }
    };

    const handleFileDownload = async (tipoNomina) => {
        try {
            const response = await axios.get(`http://192.168.100.215:8080/download?quincena=${quincena}&anio=${String(anio)}&tipo=${tipoNomina.toLowerCase()}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_${tipoNomina}_${anio}_${quincena}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Archivo descargado correctamente', life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al descargar el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
            console.error('Error downloading file', error);
        }
    };

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

    return (
        <ThemeProvider theme={theme}>
            <Toast ref={toast} />
            <Box className={styles.main}>
                <Typography variant="h4" className={styles.h1}>Resumen de carga de datos</Typography>
                <Box className={styles.selectorContainer}>
                    <Select value={quincena} onChange={(e) => setQuincena(e.target.value)} variant="outlined">
                        {quincenas.map((quin, index) => (
                            <MenuItem key={index} value={quin.value}>
                                {quin.label}
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
                <Typography variant="h5" className={styles.h2}>Post Nomina</Typography>
                <Box className={styles.progressContainer}>
                    <Typography>Progreso de datos</Typography>
                    <ProgressBar value={progressPostNomina} className={styles.progressBar} />
                </Box>
                <TablaPostNomina
                    quincena={quincena}
                    anio={anio}
                    session={session}
                    setProgress={setProgressPostNomina}
                    setUploaded={setPostNominaUploaded}
                    extra="" // Aquí extra es vacío
                />

                <FormControlLabel
                    control={<Switch checked={showExtraordinarias} onChange={() => setShowExtraordinarias(!showExtraordinarias)} />}
                    label="Mostrar Quincenas Extraordinarias"
                />
                {showExtraordinarias && (
                    <>
                        <Typography variant="h5" className={styles.h2}>Quincenas Extraordinarias</Typography>
                        <TablaQuincenasExtraordinarias
                            quincena={quincena}
                            anio={anio}
                            session={session}
                            setProgress={setProgressPostNomina}
                            setUploaded={setPostNominaUploaded}
                            extra="DIA DE LA MADRE" // Aquí puedes cambiar el valor de extra según sea necesario
                        />
                    </>
                )}

                <FormControlLabel
                    control={<Switch checked={showFiniquitos} onChange={() => setShowFiniquitos(!showFiniquitos)} />}
                    label="Mostrar Finiquitos"
                />
                {showFiniquitos && (
                    <>
                        <Typography variant="h5" className={styles.h2}>Finiquitos</Typography>
                        <TablaFiniquitos
                            quincena={quincena}
                            anio={anio}
                            session={session}
                            setProgress={setProgressPostNomina}
                            setUploaded={setPostNominaUploaded}
                            extra="" // Aquí extra es vacío
                        />
                    </>
                )}

                <FormControlLabel
                    control={<Switch checked={showEstadosCuenta} onChange={() => setShowEstadosCuenta(!showEstadosCuenta)} />}
                    label="Mostrar Estados de Cuenta"
                />
                {showEstadosCuenta && (
                    <>
                        <Typography variant="h5" className={styles.h2}>Estados de Cuenta</Typography>
                        <TablaEstadosCuenta
                            quincena={quincena}
                            anio={anio}
                            session={session}
                            setProgress={setProgressPostNomina}
                            setUploaded={setPostNominaUploaded}
                        />
                    </>
                )}

                {postNominaUploaded && (
                    <>
                        <Typography variant="h5" className={styles.h2}>Resumen de Nomina</Typography>
                        <Box className={styles.progressContainer}>
                            <ProgressBar value={progressResumenNomina} className={styles.progressBar} />
                        </Box>
                        <Button variant="contained" component="label" className={styles.uploadButton}>
                            Subir archivo
                            <input type="file" hidden onChange={(e) => handleFileUpload(e, 'resumen', setProgressResumenNomina, setPostNominaUploaded, '')} accept=".xlsx" />
                        </Button>
                        <TablaResumenNomina />
                    </>
                )}

                <Box className={styles.buttonContainer}>
                    <Link href={`/CrearNomina/ProcesarDatos?anio=${anio}&quincena=${quincena}`} passHref>
                        <Button variant="contained" color="primary" className={styles.exportButton}>
                            Validar Datos
                        </Button>
                    </Link>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default withAdminRole(CargarDatos);
