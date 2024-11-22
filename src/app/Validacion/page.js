'use client';
import React, { useState } from 'react';
import { Button, Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import DateFilter from '../%Components/DateFilter/DateFilter'; // Importar el DateFilter
import TablaConsultaDetallesBitacora from '../%Components/TablasCambios/TablaConsultaDetallesBitacora';
import HeaderSeccion from '../%Components/HeaderSeccion/HeaderSeccion'; // Importar HeaderSeccion
import styles from './page.module.css';
import { ThemeProvider } from '@mui/material';
import theme from '../$tema/theme';
import ProtectedView from '../%Components/ProtectedView/ProtectedView';

export default function Validacion() {
    const [tipoNomina, setTipoNomina] = useState('');
    const [anio, setAnio] = useState(''); // Estado para el año
    const [quincena, setQuincena] = useState(''); // Estado para la quincena
    const [showTabla, setShowTabla] = useState(true); // Controla si se muestra o no la tabla

    // Función para manejar el cambio de año y quincena desde el DateFilter
    const handleDateChange = ({ anio, quincena }) => {
        setAnio(anio);
        setQuincena(quincena);
    };

    return (
        <ProtectedView requiredPermissions={["Acceso_total", "Validacion_de_registros_consulta_bitacora"]}>
            <ThemeProvider theme={theme}>
                <main className={styles.main}>
                    <h1 className={styles.h1}>
                        Validación de registros base vs post base y consulta de bitácora
                    </h1>

                    {/* Contenedor del selector de tipo de nómina y el filtro de fecha */}
                    <Box className={styles.selectorContainer}>
                        {/* Selector de Tipo de Nómina */}
                        <Box className={styles.section}>
                            <FormControl className={styles.labels}>
                                <InputLabel>Tipo de Nómina</InputLabel>
                                <Select
                                    value={tipoNomina}
                                    onChange={(e) => setTipoNomina(e.target.value)}
                                    label="Tipo de Nómina"
                                >
                                    <MenuItem value="ESTRUCTURA">Estructura</MenuItem>
                                    <MenuItem value="BASE">Base</MenuItem>
                                    <MenuItem value="NOMINA 8">Nómina 8</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {/* Componente DateFilter */}
                        <DateFilter onDateChange={handleDateChange} />
                    </Box>

                    {/* Encabezado y tabla de consulta */}
                    <HeaderSeccion
                        titulo="Cambios a detalle por empleado y quincena"
                        isOpen={showTabla}
                        onToggle={() => setShowTabla(!showTabla)}
                    />
                    {showTabla && (
                        <div className={styles.tableContainer}>
                            <TablaConsultaDetallesBitacora
                                tipoNomina={tipoNomina}
                                anio={anio}
                                quincena={quincena}
                               
                            />
                        </div>
                    )}

                    {/* Botones de navegación */}
                    <div className={styles.buttonContainer}>
                        <Button variant="contained" color="primary" className={styles.exportButton}>
                            Resumen de Nómina
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => window.history.back()}
                            className={styles.backButton}
                        >
                            Regresar
                        </Button>
                    </div>
                </main>
            </ThemeProvider>
        </ProtectedView>
    );
}
