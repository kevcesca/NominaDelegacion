'use client'
import React from 'react';
import Link from 'next/link';
import { Button, Box, ThemeProvider } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DownloadIcon from '@mui/icons-material/Download';
import styles from './page.module.css';
import TablaUsuarios from '../%Components/TablaUsuarios/TablaUsuarios'; // Asegúrate de que la ruta sea correcta
import theme from '../$tema/theme'; // Importa tu tema personalizado

export default function CrearNomina() {
    return (
        <ThemeProvider theme={theme}>
            <main className={styles.main}>
                <TablaUsuarios />
                <Box className={styles.buttonContainer}>
                    <Link href="/Usuarios/CrearUsuario" passHref>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleIcon />}
                            className={styles.createButton}
                            sx={{marginRight: 20}}
                        >
                            Crear nuevo usuario
                        </Button>
                    </Link>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        className={styles.exportButton}
                    >
                        Exportar
                    </Button>
                </Box>
            </main>
        </ThemeProvider>
    );
}
