'use client';
import React, { useState } from 'react';
import { ThemeProvider, Box, Typography, Alert, Button } from '@mui/material';
import Link from 'next/link';
import ProtectedView from '../%Components/ProtectedView/ProtectedView';
import DateFilter from '../%Components/DateFilter/DateFilter';
import TablaSeccion from '../%Components/TablaSeccion/TablaSeccion';
import TablaPostNomina from '../%Components/TablaPostNomina/TablaPostNomina';
import TablaPostNominaHonorarios from '../%Components/TablaPostNomina/TablaPostNominaHonorarios';
import TablaQuincenasExtraordinarias from '../%Components/TablaPostNomina/TablaQuincenasExtraordinarias';
import TablaFiniquitos from '../%Components/TablaPostNomina/TablaFiniquitos';
import theme from '../$tema/theme';
import styles from './page.module.css';

export default function CargarDatos() {
    const [quincena, setQuincena] = useState(null);
    const [anio, setAnio] = useState(null);
    const [progressPostNomina, setProgressPostNomina] = useState(0);
    const [progressHonorarios, setProgressHonorarios] = useState(0);
    const [showNominaCompuesta, setShowNominaCompuesta] = useState(false);
    const [showNominaHonorarios, setShowNominaHonorarios] = useState(false);
    const [showExtraordinarias, setShowExtraordinarias] = useState(false);
    const [showFiniquitos, setShowFiniquitos] = useState(false);

    return (
        <ProtectedView requiredPermissions={["Carga_de_Nomina", "Acceso_total"]}>
            <ThemeProvider theme={theme}>
                <Box className={styles.main}>
                    <Typography variant="h4" className={styles.h1}>
                        Carga de Nómina
                    </Typography>

                    {/* Filtro de fecha */}
                    <DateFilter
                        onDateChange={({ anio: nuevoAnio, quincena: nuevaQuincena }) => {
                            setAnio(nuevoAnio);
                            setQuincena(nuevaQuincena);
                        }}
                    />

                    <div className={styles.sectionContainer}>
                        <Alert severity="info" className={styles.alert} sx={{ margin: '1rem' }}>
                            En esta ventana podrás subir los archivos de nómina.
                        </Alert>

                        {/* Tabla Nómina Compuesta */}
                        <TablaSeccion
                            titulo="Nómina Compuesta"
                            isOpen={showNominaCompuesta}
                            onToggle={() => setShowNominaCompuesta(!showNominaCompuesta)}
                            progress={progressPostNomina}
                            tabla={
                                <TablaPostNomina
                                    quincena={quincena}
                                    anio={anio}
                                    setProgress={setProgressPostNomina}
                                    setUploaded={() => {}}
                                />
                            }
                        />

                        {/* Tabla Nómina Honorarios */}
                        <TablaSeccion
                            titulo="Nómina Honorarios"
                            isOpen={showNominaHonorarios}
                            onToggle={() => setShowNominaHonorarios(!showNominaHonorarios)}
                            progress={progressHonorarios}
                            tabla={
                                <TablaPostNominaHonorarios
                                    quincena={quincena}
                                    anio={anio}
                                    setProgress={setProgressHonorarios}
                                    setUploaded={() => {}}
                                />
                            }
                        />

                        {/* Tabla Quincenas Extraordinarias */}
                        <TablaSeccion
                            titulo="Quincenas Extraordinarias"
                            isOpen={showExtraordinarias}
                            onToggle={() => setShowExtraordinarias(!showExtraordinarias)}
                            progress={0}
                            tabla={
                                <TablaQuincenasExtraordinarias
                                    quincena={quincena}
                                    anio={anio}
                                    setProgress={() => {}}
                                    setUploaded={() => {}}
                                />
                            }
                        />

                        {/* Tabla Finiquitos */}
                        <TablaSeccion
                            titulo="Finiquitos"
                            isOpen={showFiniquitos}
                            onToggle={() => setShowFiniquitos(!showFiniquitos)}
                            progress={0}
                            tabla={
                                <TablaFiniquitos
                                    quincena={quincena}
                                    anio={anio}
                                    setProgress={() => {}}
                                    setUploaded={() => {}}
                                />
                            }
                        />

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
