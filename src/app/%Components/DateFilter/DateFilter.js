// src/components/DateFilter.js
import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import { Calendar } from 'primereact/calendar';
import styles from './DateFilter.module.css';

export default function DateFilter({ onDateChange }) {
    const [quincenaTexto, setQuincenaTexto] = useState('');
    const [anio, setAnio] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    const actualizarFecha = (fecha) => {
        if (!fecha) return;

        const fechaActual = new Date(fecha);
        const dia = fechaActual.getDate();
        const mes = fechaActual.toLocaleString('es-ES', { month: 'long' }); // Mes como texto (ej. "noviembre")
        const mesNumero = fechaActual.getMonth() + 1; // Mes como número (1-12)
        const anioSeleccionado = fechaActual.getFullYear();

        let numeroQuincena = null;
        let textoQuincena = '';

        if (dia >= 1 && dia <= 14) {
            numeroQuincena = (mesNumero * 2) - 1; // Quincena impar
            textoQuincena = `1ra quincena de ${mes}`;
        } else if (dia >= 15 && dia <= 31) {
            numeroQuincena = mesNumero * 2; // Quincena par
            textoQuincena = `2da quincena de ${mes}`;
        }

        if (numeroQuincena) {
            setQuincenaTexto(textoQuincena);
            setAnio(anioSeleccionado);

            // Notificar al componente padre el año y el número de la quincena
            if (onDateChange) {
                onDateChange({ anio: anioSeleccionado, quincena: numeroQuincena });
            }
        } else {
            setQuincenaTexto('Fecha no válida');
            setAnio('');
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
                className={styles.calendar}
            />
            <TextField
                label="Quincena"
                value={quincenaTexto}
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
