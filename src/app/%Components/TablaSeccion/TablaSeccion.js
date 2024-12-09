// src/%Components/TablaSeccion/TablaSeccion.js
import React, { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import HeaderSeccion from '../HeaderSeccion/HeaderSeccion';
import styles from './TablaSeccion.module.css';

export default function TablaSeccion({ titulo, isOpen, onToggle, progress, tabla }) {
    // Estado para gestionar si se está cargando un archivo
    const [isLoading, setIsLoading] = useState(false);

    // Simular la carga de un archivo para efectos de demostración
    const handleFileLoad = () => {
        setIsLoading(true); // Activa el estado de carga
        setTimeout(() => {
            setIsLoading(false); // Desactiva el estado de carga después de 2 segundos
        }, 2000);
    };

    return (
        <Box>
            {/* Header de la sección */}
            <HeaderSeccion titulo={titulo} isOpen={isOpen} onToggle={onToggle} />

            {/* Contenido condicional dependiendo de si está expandido */}
            {isOpen && (
                <>
                    <Box className={styles.progressContainer}>
                        {/* Cargando archivo: CircularProgress en lugar de ProgressBar */}
                        {isLoading ? (
                            <Box className={styles.loadingContainer}>
                                <CircularProgress size={24} className={styles.circularProgress} />
                                <Typography className={styles.loadingText}>Cargando archivo...</Typography>
                            </Box>
                        ) : (
                            <Typography className={styles.loadingTextSuccess}>Archivo cargado con éxito</Typography>
                        )}
                    </Box>

                    {/* Renderizar la tabla */}
                    {tabla}

                    {/* Botón para simular carga de archivo (solo para pruebas) */}
                    <Box className={styles.buttonContainer}>
                        <button onClick={handleFileLoad} className={styles.simulateButton}>
                            Simular carga de archivo
                        </button>
                    </Box>
                </>
            )}
        </Box>
    );
}
