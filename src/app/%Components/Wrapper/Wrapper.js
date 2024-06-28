// src/app/%Components/Wrapper/Wrapper.js
'use client';
import "../../globals.css";
import { Grid } from "@mui/material";
import styles from './Wrapper.module.css';

import NavBar from "../NavBar/NavBar";
import AppBar from "../AppBar/AppBar";
import Footer from "../Footer/Footer"; // Asegúrate de ajustar la ruta si es necesario

export default function Wrapper({ children }) {
    return (
        <div className={styles.wrapperContainer}>
            <Grid container spacing={0} style={{ flex: 1 }}>
                {/* Sidebar */}
                <Grid item xs="auto">
                    <NavBar />
                </Grid>

                {/* Contenido main */}
                <Grid item xs style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px', flex: 1 }}>
                    <AppBar className={styles.AppBar} />
                    <div className={styles.content}>
                        {children}
                    </div>
                </Grid>
            </Grid>
            <Footer /> {/* Añadimos el footer aquí */}
        </div>
    );
}
