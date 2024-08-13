'use client'
import React, { useState } from 'react';
import { Button, Box, ThemeProvider } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import styles from './page.module.css';
import TablaUsuarios from '../%Components/TablaUsuarios/TablaUsuarios'; // Asegúrate de que la ruta sea correcta
import theme from '../$tema/theme'; // Importa tu tema personalizado

export default function CrearNomina() {
    const [iframeUrl, setIframeUrl] = useState('');

    const handleRedirectToKeycloak = () => {
        // Establece la URL en el iframe en lugar de redirigir
        setIframeUrl('http://localhost:8081/admin/master/console/#/reino-NominaAzcapo/users');
    };

    return (
        <ThemeProvider theme={theme}>
            <main className={styles.main}>
                {/* Botón para cargar la consola de administración de Keycloak en un iframe */}
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRedirectToKeycloak}
                        startIcon={<AddCircleIcon />}
                    >
                        Administrar Usuarios en Keycloak
                    </Button>
                </Box>

                {/* Tabla de usuarios */}
                <TablaUsuarios />

                {/* Iframe que muestra la consola de administración de Keycloak */}
                {iframeUrl && (
                    <Box mt={4} className={styles.iframeContainer}>
                        <iframe
                            src={iframeUrl}
                            width="100%"
                            height="600px"
                            frameBorder="0"
                            title="Keycloak Admin"
                        ></iframe>
                    </Box>
                )}
            </main>
        </ThemeProvider>
    );
}
