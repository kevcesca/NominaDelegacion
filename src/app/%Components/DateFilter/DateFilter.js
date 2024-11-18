// src/components/DateFilter.js
import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import { Calendar } from 'primereact/calendar';
import styles from './DateFilter.module.css';

export default function DateFilter({ onDateChange }) {
    const [quincena, setQuincena] = useState('');
    const [anio, setAnio] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    const actualizarFecha = (fecha) => {
        if (!fecha) return;

        const fechaActual = new Date(fecha);
        const dia = fechaActual.getDate();
        const mes = fechaActual.toLocaleString('es-ES', { month: 'long' });
        const anioSeleccionado = fechaActual.getFullYear();

        let nuevaQuincena = '';
        if (dia >= 1 && dia <= 14) {
            nuevaQuincena = `1ra quincena de ${mes}`;
        } else if (dia >= 15 && dia <= 31) {
            nuevaQuincena = `2da quincena de ${mes}`;
        } else {
            nuevaQuincena = 'Fecha no válida';
        }

        setQuincena(nuevaQuincena);
        setAnio(anioSeleccionado);

        // Notificar al componente padre el año y la quincena
        if (onDateChange) {
            onDateChange({ anio: anioSeleccionado, quincena: nuevaQuincena });
        }
    };

    return (
        <Box className={styles.dateFilter}>
            <Calendar
                dateFormat="yy-mm-dd"
                value={fechaSeleccionada}
                onChange={(e) => {
                    setFechaSeleccionada(e.value);
                    actualizarFecha(e.value);
                }}
                placeholder="Seleccione una fecha"
                className={styles.calendar} // Cambiado a .calendar para personalización
            />
            <TextField
                label="Quincena"
                value={quincena}
                placeholder="Quincena automática"
                InputProps={{ readOnly: true }}
                className={styles.textField}
            />
            <TextField
                label="Año"
                value={anio}
                placeholder="Año automático"
                InputProps={{ readOnly: true }}
                className={styles.textField}
            />
        </Box>
    );
}
