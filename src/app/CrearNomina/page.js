'use client';
import React, { useState } from 'react';
import { Toast } from 'primereact/toast';
import styles from './page.module.css';
import TablaPostNomina from '../%Components/TablaPostNomina/TablaPostNomina';
import TablaPostNominaHonorarios from '../%Components/TablaPostNomina/TablaPostNominaHonorarios';
import TablaQuincenasExtraordinarias from '../%Components/TablaPostNomina/TablaQuincenasExtraordinarias';
import TablaFiniquitos from '../%Components/TablaPostNomina/TablaFiniquitos';
import { ProgressBar } from 'primereact/progressbar';
import { ThemeProvider, Box, Typography, Button, Alert } from '@mui/material';
import theme from '../$tema/theme';
import Link from 'next/link';
import ProtectedView from '../%Components/ProtectedView/ProtectedView';
import DateFilter from '../%Components/DateFilter/DateFilter'; // Importa DateFilter.js

function CargarDatos() {
    const [quincena, setQuincena] = useState(null); // Valor dinámico para la quincena
    const [anio, setAnio] = useState(null); // Valor dinámico para el año
    const [progressPostNomina, setProgressPostNomina] = useState(0); // Estado de progreso de post nómina
    const [progressHonorarios, setProgressHonorarios] = useState(0); // Estado de progreso de honorarios
    const [showNominaCompuesta, setShowNominaCompuesta] = useState(true); // Controla el despliegue de Nómina Compuesta
    const [showNominaHonorarios, setShowNominaHonorarios] = useState(false); // Controla el despliegue de Nómina Honorarios
    const [showExtraordinarias, setShowExtraordinarias] = useState(false); // Controla el despliegue de Quincenas Extraordinarias
    const [showFiniquitos, setShowFiniquitos] = useState(false); // Controla el despliegue de Finiquitos

    return (
        <ProtectedView requiredPermissions={["Carga_de_Nomina", "Acceso_total"]}>
            <ThemeProvider theme={theme}>
                <Toast />
                <Box className={styles.main}>
                    <Typography variant="h4" className={styles.h1}>
                        Carga de Nómina
                    </Typography>

                    {/* Selector de quincena y año usando DateFilter */}
                    <DateFilter
                        onDateChange={({ anio: nuevoAnio, quincena: nuevaQuincena }) => {
                            setAnio(nuevoAnio);
                            setQuincena(nuevaQuincena);
                        }}
                    />

                    {/* Renderizar las tablas desde el inicio */}
                    <div className={styles.sectionContainer}>
                        <Alert severity="info" className={styles.alert} sx={{ margin: '1rem' }}>
                            En esta ventana podrás subir los archivos de nómina.
                        </Alert>

                        {/* Sección de Nómina Compuesta */}
                        <Box display="flex" alignItems="center" sx={{ margin: '1rem' }}>
                            <Typography variant="h5" className={styles.h2}>
                                Nómina Compuesta
                            </Typography>
                            <Button
                                className={styles.buttonPlus}
                                variant="primary"
                                onClick={() => setShowNominaCompuesta(!showNominaCompuesta)}
                            >
                                {showNominaCompuesta ? '-' : '+'}
                            </Button>
                        </Box>
                        {showNominaCompuesta && (
                            <>
                                <Box className={styles.progressContainer}>
                                    <Typography>Progreso de datos</Typography>
                                    <ProgressBar value={progressPostNomina} className={styles.progressBar} />
                                </Box>
                                <TablaPostNomina
                                    quincena={quincena}
                                    anio={anio}
                                    setProgress={setProgressPostNomina}
                                    setUploaded={() => {}}
                                    extra=""
                                />
                            </>
                        )}

                        {/* Sección de Nómina Honorarios */}
                        <Box display="flex" alignItems="center" sx={{ margin: '1rem' }}>
                            <Typography variant="h5" className={styles.h2}>
                                Nómina Honorarios
                            </Typography>
                            <Button
                                className={styles.buttonPlus}
                                variant="primary"
                                onClick={() => setShowNominaHonorarios(!showNominaHonorarios)}
                            >
                                {showNominaHonorarios ? '-' : '+'}
                            </Button>
                        </Box>
                        {showNominaHonorarios && (
                            <>
                                <Box className={styles.progressContainer}>
                                    <Typography>Progreso de datos</Typography>
                                    <ProgressBar value={progressHonorarios} className={styles.progressBar} />
                                </Box>
                                <TablaPostNominaHonorarios
                                    quincena={quincena}
                                    anio={anio}
                                    setProgress={setProgressHonorarios}
                                    setUploaded={() => {}}
                                />
                            </>
                        )}

                        {/* Sección de Quincenas Extraordinarias */}
                        <Box display="flex" alignItems="center" sx={{ margin: '1rem' }}>
                            <Typography variant="h5" className={styles.h2}>
                                Quincenas Extraordinarias
                            </Typography>
                            <Button
                                className={styles.buttonPlus}
                                variant="primary"
                                onClick={() => setShowExtraordinarias(!showExtraordinarias)}
                            >
                                {showExtraordinarias ? '-' : '+'}
                            </Button>
                        </Box>
                        {showExtraordinarias && (
                            <TablaQuincenasExtraordinarias
                                quincena={quincena}
                                anio={anio}
                                setProgress={() => {}}
                                setUploaded={() => {}}
                            />
                        )}

                        {/* Sección de Finiquitos */}
                        <Box display="flex" alignItems="center" sx={{ margin: '1rem' }}>
                            <Typography variant="h5" className={styles.h2}>
                                Finiquitos
                            </Typography>
                            <Button
                                className={styles.buttonPlus}
                                variant="primary"
                                onClick={() => setShowFiniquitos(!showFiniquitos)}
                            >
                                {showFiniquitos ? '-' : '+'}
                            </Button>
                        </Box>
                        {showFiniquitos && (
                            <TablaFiniquitos
                                quincena={quincena}
                                anio={anio}
                                setProgress={() => {}}
                                setUploaded={() => {}}
                                extra=""
                            />
                        )}

                        {/* Botón para comprobar cambios */}
                        <Box className={styles.buttonContainer}>
                            <Link href={`/Validacion?anio=${anio}&quincena=${quincena}`} passHref>
                                <Button variant="contained" color="primary" className={styles.exportButton}>
                                    Comprobar cambios
                                </Button>
                            </Link>
                        </Box>
                    </div>
                </Box>
            </ThemeProvider>
        </ProtectedView>
    );
}

export default CargarDatos;
