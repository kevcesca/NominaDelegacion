// src/app/%Components/Wrapper/Wrapper.js
'use client'
import "../../globals.css";
import { Grid, ThemeProvider } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/saga-blue/theme.css';  // Importa el tema que prefieras
import 'primereact/resources/primereact.min.css';  // Importa los estilos de PrimeReact
import 'primeicons/primeicons.css';
import styles from './Wrapper.module.css'

import NavBar from "../NavBar/NavBar";
import AppBar from "../AppBar/AppBar";


const theme = createTheme({
    palette: {
        primary: {
            light: '#4389a9',
            main: '#146C94',
            dark: '#0e4b67',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#AFD3E2',
            dark: '#7a939e',
            contrastText: '#000',
        },
    },
});

export default function Wrapper({ children }) {
    return (
            <ThemeProvider theme={theme}>
                <Grid container spacing={3}>
                    {/* Sidebar */}
                    <Grid item md={2}>
                        <NavBar />
                    </Grid>

                    {/* contenido main */}
                    <Grid item md={10}>
                        <AppBar classname={styles.AppBar}  />
                        {children}
                    </Grid>
                </Grid>
            </ThemeProvider>
    );
}
