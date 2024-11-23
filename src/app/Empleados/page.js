'use client'

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../$tema/theme'; 
import styles from './page.module.css';
import TablaEmpleados from '../%Components/TablaEmpleados/TablaEmpleados';
import HonorariosTable from '../%Components/TablaEmpleados/TablaHonorarios';

export default function CargarDatos() {
    return (
        <ThemeProvider theme={theme}>
            <main className={styles.main}>
                <h1 className={styles.h1}>Empleados</h1>
                <TablaEmpleados/>
                <h1 className={styles.h1}>Honorarios</h1>
                <HonorariosTable/>
                
                
            </main>
        </ThemeProvider>
    );
}
