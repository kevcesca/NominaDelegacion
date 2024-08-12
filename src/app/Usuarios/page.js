'use client'
import React from 'react';
import { Button, Box, ThemeProvider } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import styles from './page.module.css';
import TablaUsuarios from '../%Components/TablaUsuarios/TablaUsuarios'; // Asegúrate de que la ruta sea correcta
import theme from '../$tema/theme'; // Importa tu tema personalizado

export default function CrearNomina() {
    const handleRedirectToKeycloak = () => {
        // Redirige a la URL de administración de Keycloak
        window.location.href = 'http://localhost:8081/admin/master/console/#/reino-NominaAzcapo/users';
    };

    return (
        <ThemeProvider theme={theme}>
            <main className={styles.main}>
                {/* Botón para redirigir a la consola de administración de Keycloak */}
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
            </main>
        </ThemeProvider>
    );
}
