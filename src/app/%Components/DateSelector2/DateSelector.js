import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import styles from './DateSelector.module.css'

const QuincenaAnioSelector = ({ setAnio, setQuincena }) => {
    const [anio, setAnioState] = useState('');
    const [quincena, setQuincenaState] = useState('');

    useEffect(() => {
        const now = new Date();

        const currentYear = now.getFullYear().toString();
        const day = now.getDate();
        const quincenaValue = (day <= 15) 
            ? ((now.getMonth() * 2) + 1).toString().padStart(2, '0') // Primera quincena del mes actual
            : ((now.getMonth() * 2) + 2).toString().padStart(2, '0'); // Segunda quincena del mes actual

        // Establecer los valores iniciales en los estados locales y principales
        setAnioState(currentYear);
        setQuincenaState(quincenaValue);

        setAnio(currentYear);
        setQuincena(quincenaValue);

    }, [setAnio, setQuincena]);

    // Manejar cambios de año y quincena
    const handleAnioChange = (event) => {
        const newAnio = event.target.value;
        setAnioState(newAnio);
        setAnio(newAnio);
    };

    const handleQuincenaChange = (event) => {
        const newQuincena = event.target.value;
        setQuincenaState(newQuincena);
        setQuincena(newQuincena);
    };

    // Definición de quincenas
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
        <Box className={styles.selectorContainer}>
            <Select value={quincena} onChange={handleQuincenaChange} variant="outlined">
                {quincenas.map((q, index) => (
                    <MenuItem key={index} value={q.value}>
                        {q.label}
                    </MenuItem>
                ))}
            </Select>
            <Select value={anio} onChange={handleAnioChange} variant="outlined">
                {[...Array(21).keys()].map(n => (
                    <MenuItem key={2024 + n} value={2024 + n}>
                        Año {2024 + n}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

export default QuincenaAnioSelector;
