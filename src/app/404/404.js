// app/404.js
'use client';
import React from 'react';
import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';
import styles from './page.module.css';

const Custom404 = () => {
    return (
        <Box className={styles.main} sx={{ textAlign: 'center', marginTop: '2rem' }}>
            <Typography variant="h1" sx={{ fontSize: '4rem', color: '#711c31' }}>
                404
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: '2rem' }}>
                Página no encontrada
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '2rem' }}>
                Lo sentimos, no pudimos encontrar la página que buscas.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/"
            >
                Volver al inicio
            </Button>
        </Box>
    );
};

export default Custom404;
