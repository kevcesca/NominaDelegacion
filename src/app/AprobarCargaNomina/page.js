'use client';

import React, { useState } from 'react';
import { ThemeProvider, Box, Typography, Button, Alert } from '@mui/material';
import styles from './page.module.css';
import theme from '../$tema/theme';
import DateFilter from '../%Components/DateFilter/DateFilter'; // Importa tu componente DateFilter
import ComparativaTable from '../%Components/ComparativeTable/ComparativeTable';
import ComparativaTable2 from '../%Components/ComparativeTable/ComparativeTable2';
import { useRouter } from 'next/navigation';
import ProtectedView from '../%Components/ProtectedView/ProtectedView'; // Importa el componente

const AprobarCargaNomina = () => {
    const router = useRouter();

    // Estados para el año y la quincena (inicializados con valores predeterminados)
    const [anio, setAnio] = useState('2024');
    const [quincena, setQuincena] = useState('01');

    // Función para manejar los cambios de fecha desde el DateFilter
    const handleDateChange = ({ anio: nuevoAnio, quincena: nuevaQuincena }) => {
        setAnio(nuevoAnio);
        setQuincena(nuevaQuincena);
    };

    return (
        <ProtectedView requiredPermissions={["Carga_de_Nomina", "Acceso_total"]}>
            <ThemeProvider theme={theme}>
                <main className={styles.main}>
                    <h1 className={styles.h1}>
                        Aprobación de Nóminas {quincena} {anio}
                    </h1>
                
                    {/* Contenedor del filtro de fecha */}
                    <Box className={styles.selectorContainer}>
                        <DateFilter onDateChange={handleDateChange} />
                    </Box>

                    <Alert severity="info" className={styles.alert} sx={{ margin: '1rem' }}>
                        Estás viendo únicamente los archivos que requieren aprobación. La aprobación se completará cuando se haya hecho la doble validación.
                    </Alert>

                    {/* Protege la tabla de aprobación 1 para el permiso "ver_aprobacion_1" */}
                    <ProtectedView requiredPermissions={["ver_aprobacion_1", "Acceso_total"]}>
                        <Box mt={4}>
                            <ComparativaTable quincena={quincena} anio={anio} />
                        </Box>
                    </ProtectedView>

                    {/* Protege la tabla de aprobación 2 para el permiso "ver_aprobacion_2" */}
                    <ProtectedView requiredPermissions={["ver_aprobacion_2", "Acceso_total"]}>
                        <Box mt={4}>
                            <ComparativaTable2 quincena={quincena} anio={anio} />
                        </Box>
                    </ProtectedView>

                    {/* Botón para regresar a la página anterior */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => router.back()} // Regresa a la página anterior
                        className={styles.backButton}
                    >
                        Regresar
                    </Button>
                </main>
            </ThemeProvider>
        </ProtectedView>
    );
};

export default AprobarCargaNomina;
