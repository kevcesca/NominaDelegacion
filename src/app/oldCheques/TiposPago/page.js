'use client';

import React from 'react';
import TablaTiposPago from '../../%Components/TablaPagosEmpleados/TablaPagosEmpleados';
import { Typography, Container } from '@mui/material';
import styles from './page.module.css';

export default function TiposPago() {
    return (
        <div className={styles.main} maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
                Tipos de Pago
            </Typography>
            <TablaTiposPago />
        </div>
    );
}