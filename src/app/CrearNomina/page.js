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
import { ThemeProvider, Box, Typography, Button, FormControlLabel, Switch, Alert } from '@mui/material';
import theme from '../$tema/theme';
import Link from 'next/link';
import withAdminRole from '../%Components/hoc/withAdminRole';
import DateSelector from '../%Components/DateSelector2/DateSelector';  // Importa el componente DateSelector

function CargarDatos() {
    const { data: session } = useSession();
    const [quincena, setQuincena] = useState('01');
    const [anio, setAnio] = useState('2024');
    const [progressPostNomina, setProgressPostNomina] = useState(0);
    const [progressHonorarios, setProgressHonorarios] = useState(0);
    const [postNominaUploaded, setPostNominaUploaded] = useState(false);
    const [honorariosUploaded, setHonorariosUploaded] = useState(false);
    const [showExtraordinarias, setShowExtraordinarias] = useState(false);
    const [showFiniquitos, setShowFiniquitos] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        console.log("Session:", session);
    }, [session]);

    return (
        <ThemeProvider theme={theme}>
            <Toast ref={toast} />
            <Box className={styles.main}>
                <Typography variant="h4" className={styles.h1}>Carga de Nómina</Typography>

                {/* Reemplazar la lógica de los Selects de quincena y año con DateSelector */}
                <DateSelector setMes={() => {}} setAnio={setAnio} setQuincena={setQuincena} />

                {/* Sección de Post Nomina */}
                <Alert severity="info" className={styles.alert} sx={{margin: '1rem'}}>
                    En esta ventana podrás subir los archivos de nómina
                </Alert>
                <Typography variant="h5" className={styles.h2}>Nómina Compuesta</Typography>
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

                {/* Sección de Honorarios */}
                <Typography variant="h5" className={styles.h2}>Nómina Honorarios</Typography>
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

                {/* Sección de Quincenas Extraordinarias */}
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
                        />
                    </>
                )}

                {/* Sección de Finiquitos */}
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

                <Box className={styles.buttonContainer}>
                    <Link href={`/Validacion?anio={anio}&quincena={quincena}`} passHref>
                        <Button variant="contained" color="primary" className={styles.exportButton}>
                            Comprobar cambios
                        </Button>
                    </Link>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default withAdminRole(CargarDatos);
