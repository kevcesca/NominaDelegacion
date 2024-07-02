'use client';
import React from 'react';
import { Paper, Button, Typography, Box } from '@mui/material';
import Image from 'next/image';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './Banner.module.css';

const Banner = () => {
    return (
        <Paper className={styles.bannerContainer}>
            <Box className={styles.textContainer}>
                <Typography variant="h3" className={styles.title}>
                    Procesos de Gestión de Nómina en Azcapotzalco
                </Typography>
                <Button variant="contained" color="primary" endIcon={<ArrowForwardIcon />} className={styles.button}>
                    Más Información
                </Button>
            </Box>
            <Box className={styles.imageContainer}>
                <Image src="homebaner.jpg" alt="Banner Image" layout="fill" objectFit="cover" />
            </Box>
        </Paper>
    );
};

export default Banner;
