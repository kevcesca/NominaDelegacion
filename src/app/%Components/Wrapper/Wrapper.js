// src/app/%Components/Wrapper/Wrapper.js
'use client';
import "../../globals.css";
import { Grid, ThemeProvider } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import styles from './Wrapper.module.css';

import NavBar from "../NavBar/NavBar";
import AppBar from "../AppBar/AppBar";

export default function Wrapper({ children }) {
    return (
        <Grid container spacing={0} style={{ height: '100vh' }}>
            {/* Sidebar */}
            <Grid item xs="auto">
                <NavBar />
            </Grid>

            {/* contenido main */}
            <Grid item xs style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                <AppBar className={styles.AppBar} />
                <div style={{ flex: 1, overflow: 'auto' }}>
                    {children}
                </div>
            </Grid>
        </Grid>
    );
}