    'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
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
import withAdminRole from '../%Components/hoc/withAdminRole';
import QuincenaAnioSelector from '../%Components/DateSelector2/DateSelector';

function CargarDatos() {
    const { data: session } = useSession();
    const [quincena, setQuincena] = useState(null);
    const [anio, setAnio] = useState(null);
    const [progressPostNomina, setProgressPostNomina] = useState(0);
    const [progressHonorarios, setProgressHonorarios] = useState(0);
    const [postNominaUploaded, setPostNominaUploaded] = useState(false);
    const [honorariosUploaded, setHonorariosUploaded] = useState(false);
    const [showNominaCompuesta, setShowNominaCompuesta] = useState(false);
    const [showNominaHonorarios, setShowNominaHonorarios] = useState(false);
    const [showExtraordinarias, setShowExtraordinarias] = useState(false);
    const [showFiniquitos, setShowFiniquitos] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        console.log("Session:", session);
        console.log("Año seleccionado:", anio);
        console.log("Quincena seleccionada:", quincena);
    }, [session, anio, quincena]);

    return (
        <ThemeProvider theme={theme}>
            <Toast ref={toast} />
            <Box className={styles.main}>
                <Typography variant="h4" className={styles.h1}>Carga de Nómina</Typography>

                {/* Selector de quincena y año */}
                <QuincenaAnioSelector setAnio={setAnio} setQuincena={setQuincena} />

                {anio && quincena && (
                    <div className={styles.sectionContainer}>
                        <Alert severity="info" className={styles.alert} sx={{ margin: '1rem' }}>
                            En esta ventana podrás subir los archivos de nómina
                        </Alert>

                        {/* Sección de Nómina Compuesta */}
                        <Box display="flex" alignItems="center" sx={{ margin: '1rem' }}>
                            <Typography variant="h5" className={styles.h2}>Nómina Compuesta</Typography>
                            <Button className={styles.buttonPlus} variant="primary" onClick={() => setShowNominaCompuesta(!showNominaCompuesta)}>	
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
                                    session={session}
                                    setProgress={setProgressPostNomina}
                                    setUploaded={setPostNominaUploaded}
                                    extra=""
                                />
                            </>
                        )}

                        {/* Sección de Nómina Honorarios */}
                        <Box display="flex" alignItems="center" sx={{ margin: '1rem' }}>
                            <Typography variant="h5" className={styles.h2}>Nómina Honorarios</Typography>
                            <Button className={styles.buttonPlus} variant="primary" onClick={() => setShowNominaHonorarios(!showNominaHonorarios)}>
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
                                    session={session}
                                    setProgress={setProgressHonorarios}
                                    setUploaded={setHonorariosUploaded}
                                />
                            </>
                        )}

                        {/* Sección de Quincenas Extraordinarias */}
                        <Box display="flex" alignItems="center" sx={{ margin: '1rem' }}>
                            <Typography variant="h5" className={styles.h2}>Quincenas Extraordinarias</Typography>
                            <Button className={styles.buttonPlus} variant="primary" onClick={() => setShowExtraordinarias(!showExtraordinarias)}>
                                {showExtraordinarias ? '-' : '+'}
                            </Button>
                        </Box>
                        {showExtraordinarias && (
                            <TablaQuincenasExtraordinarias
                                quincena={quincena}
                                anio={anio}
                                session={session}
                                setProgress={setProgressPostNomina}
                                setUploaded={setPostNominaUploaded}
                            />
                        )}

                        {/* Sección de Finiquitos */}
                        <Box display="flex" alignItems="center" sx={{ margin: '1rem' }}>
                            <Typography variant="h5" className={styles.h2}>Finiquitos</Typography>
                            <Button className={styles.buttonPlus} variant="primary" onClick={() => setShowFiniquitos(!showFiniquitos)}>
                                {showFiniquitos ? '-' : '+'}
                            </Button>
                        </Box>
                        {showFiniquitos && (
                            <TablaFiniquitos
                                quincena={quincena}
                                anio={anio}
                                session={session}
                                setProgress={setProgressPostNomina}
                                setUploaded={setPostNominaUploaded}
                                extra=""
                            />
                        )}

                        <Box className={styles.buttonContainer}>
                            <Link href={`/Validacion?anio=${anio}&quincena=${quincena}`} passHref>
                                <Button variant="contained" color="primary" className={styles.exportButton}>
                                    Comprobar cambios
                                </Button>
                            </Link>
                        </Box>
                    </div>
                )}
            </Box>
        </ThemeProvider>
    );
}

export default withAdminRole(CargarDatos);
