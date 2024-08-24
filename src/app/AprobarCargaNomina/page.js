'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ThemeProvider, Box, Typography, Select, MenuItem } from '@mui/material';
import styles from './page.module.css';
import theme from '../$tema/theme';
import ComparativaTable from '../%Components/ComparativeTable/ComparativeTable';
import ComparativaTable2 from '../%Components/ComparativeTable/ComparativeTable2';
import { useSearchParams } from 'next/navigation';

const AprobarCargaNomina = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const anioParam = searchParams.get('anio');
    const quincenaParam = searchParams.get('quincena');

    const [anio, setAnio] = useState(anioParam || '2024'); // Usar el valor de la URL o un valor por defecto
    const [quincena, setQuincena] = useState(quincenaParam || '01');

    const quincenas = [
        { label: '1ra ene', value: '01' },
        { label: '2da ene', value: '02' },
        { label: '1ra feb', value: '03' },
        { label: '2da feb', value: '04' },
        { label: '1ra mar', value: '05' },
        { label: '2da mar', value: '06' },
        { label: '1ra abr', value: '07' },
        { label: '2da abr', value: '08' },
        { label: '1ra may', value: '09' },
        { label: '2da may', value: '10' },
        { label: '1ra jun', value: '11' },
        { label: '2da jun', value: '12' },
        { label: '1ra jul', value: '13' },
        { label: '2da jul', value: '14' },
        { label: '1ra ago', value: '15' },
        { label: '2da ago', value: '16' },
        { label: '1ra sep', value: '17' },
        { label: '2da sep', value: '18' },
        { label: '1ra oct', value: '19' },
        { label: '2da oct', value: '20' },
        { label: '1ra nov', value: '21' },
        { label: '2da nov', value: '22' },
        { label: '1ra dic', value: '23' },
        { label: '2da dic', value: '24' },
    ];

    return (
        <ThemeProvider theme={theme}>
            <main className={styles.main}>
                <h1 className={styles.h1}>Aprobación de Nóminas {quincena} {anio}</h1>
                <Box className={styles.selectorContainer}>
                    <Select
                        value={quincena}
                        onChange={(e) => setQuincena(e.target.value)}
                        variant="outlined"
                        displayEmpty
                    >
                        {quincenas.map((quin, index) => (
                            <MenuItem key={index} value={quin.value}>
                                {quin.label}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select
                        value={anio}
                        onChange={(e) => setAnio(e.target.value)}
                        variant="outlined"
                        displayEmpty
                    >
                        {[...Array(21).keys()].map(n => (
                            <MenuItem key={2024 + n} value={2024 + n}>
                                Año {2024 + n}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {/* Texto de ayuda */}
                <Typography variant="h5" color="textSecondary" className={styles.helpText}>
                    Estás viendo únicamente los archivos que requieren aprobación.
                </Typography>

                {/* Renderiza la tabla de aprobación 1 solo si el usuario tiene el rol 'Admin' */}
                {session && session.roles && session.roles.includes('Admin') && (
                    <Box mt={4}>
                        <ComparativaTable userRevision={session.user.name} quincena={quincena} anio={anio} />
                    </Box>
                )}

                {/* Renderiza la tabla de aprobación 2 solo si el usuario tiene el rol 'SuperAdmin' */}
                {session && session.roles && session.roles.includes('SuperAdmin') && (
                    <Box mt={4}>
                        <ComparativaTable2 userRevision={session.user.name} quincena={quincena} anio={anio} />
                    </Box>
                )}
            </main>
        </ThemeProvider>
    );
};

export default AprobarCargaNomina;
