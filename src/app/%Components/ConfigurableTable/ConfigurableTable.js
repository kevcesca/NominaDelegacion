'use client'
import React, { useState, useEffect } from 'react';
import {
    TextField,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Box,
    Button,
    ThemeProvider
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import theme from '../../$tema/theme';
import styles from './ConfigurableTable.module.css';
import dayjs from 'dayjs';
import data from './data.json'; // Importa el archivo JSON

const ConfigurableTable = ({ year }) => {
    const [dates, setDates] = useState([]);

    useEffect(() => {
        // Cargar los datos del año seleccionado desde el JSON
        if (data[year]) {
            setDates(data[year].map(item => ({
                captura: item.captura ? dayjs(item.captura) : null,
                revision: item.revision ? dayjs(item.revision) : null,
                preNomina: item.preNomina ? dayjs(item.preNomina) : null,
                validacion: item.validacion ? dayjs(item.validacion) : null,
                atencion: item.atencion ? dayjs(item.atencion) : null,
                cierre: item.cierre ? dayjs(item.cierre) : null,
                publicacion: item.publicacion ? dayjs(item.publicacion) : null,
                traslado: item.traslado ? dayjs(item.traslado) : null,
                ministracion: item.ministracion ? dayjs(item.ministracion) : null,
                diasPago: item.diasPago ? dayjs(item.diasPago) : null,
                inicioCaptura: item.inicioCaptura ? dayjs(item.inicioCaptura) : null,
                cierreCaptura: item.cierreCaptura ? dayjs(item.cierreCaptura) : null,
                publicacionWeb: item.publicacionWeb ? dayjs(item.publicacionWeb) : null,
            })));
        } else {
            setDates(
                Array.from({ length: 24 }, () => ({
                    captura: null,
                    revision: null,
                    preNomina: null,
                    validacion: null,
                    atencion: null,
                    cierre: null,
                    publicacion: null,
                    traslado: null,
                    ministracion: null,
                    diasPago: null,
                    inicioCaptura: null,
                    cierreCaptura: null,
                    publicacionWeb: null
                }))
            );
        }
    }, [year]);

    const handleDateChange = (index, key, newValue) => {
        const newDates = [...dates];
        newDates[index][key] = newValue;
        setDates(newDates);
    };

    const saveDates = async () => {
        const updatedData = dates.map(date => ({
            captura: date.captura ? date.captura.format('YYYY-MM-DD') : null,
            revision: date.revision ? date.revision.format('YYYY-MM-DD') : null,
            preNomina: date.preNomina ? date.preNomina.format('YYYY-MM-DD') : null,
            validacion: date.validacion ? date.validacion.format('YYYY-MM-DD') : null,
            atencion: date.atencion ? date.atencion.format('YYYY-MM-DD') : null,
            cierre: date.cierre ? date.cierre.format('YYYY-MM-DD') : null,
            publicacion: date.publicacion ? date.publicacion.format('YYYY-MM-DD') : null,
            traslado: date.traslado ? date.traslado.format('YYYY-MM-DD') : null,
            ministracion: date.ministracion ? date.ministracion.format('YYYY-MM-DD') : null,
            diasPago: date.diasPago ? date.diasPago.format('YYYY-MM-DD') : null,
            inicioCaptura: date.inicioCaptura ? date.inicioCaptura.format('YYYY-MM-DD') : null,
            cierreCaptura: date.cierreCaptura ? date.cierreCaptura.format('YYYY-MM-DD') : null,
            publicacionWeb: date.publicacionWeb ? date.publicacionWeb.format('YYYY-MM-DD') : null,
        }));

        data[year] = updatedData;

        try {
            // Guarda los datos actualizados en el archivo JSON
            const response = await fetch('/api/saveDates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to save dates');
            }

            alert('Fechas guardadas correctamente');
        } catch (error) {
            console.error('Error saving dates:', error);
            alert('Error al guardar las fechas');
        }
    };

    const quincenas = [
        "1RA. ENE", "2DA. ENE", "1RA. FEB", "2DA. FEB", "1RA. MAR", "2DA. MAR",
        "1RA. ABR", "2DA. ABR", "1RA. MAY", "2DA. MAY", "1RA. JUN", "2DA. JUN",
        "1RA. JUL", "2DA. JUL", "1RA. AGO", "2DA. AGO", "1RA. SEP", "2DA. SEP",
        "1RA. OCT", "2DA. OCT", "1RA. NOV", "2DA. NOV", "1RA. DIC", "2DA. DIC"
    ];

    const headers = [
        "Quincena", "Captura e Importación", "Revisiones y Cálculo de Nómina", "Pre-Nómina",
        "Validación de Pre-Nómina", "Atención a los Problemas", "Cierre de Proceso",
        "Publicación en Web", "Traslado de la CLC", "Ministración de Tarjetas", "Días de Pago",
        "Inicio de Captura", "Cierre de Captura", "Publicación Web"
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box className={styles.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell
                                    key={header}
                                    sx={{
                                        backgroundColor: theme.palette.secondary.main,
                                        color: 'white',
                                        textAlign: 'center',
                                        position: 'sticky',
                                        top: -20,
                                        paddingTop: '10px',
                                        zIndex: 1
                                    }}
                                    className={styles.tableHeader}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {quincenas.map((quincena, index) => (
                            <TableRow key={quincena}>
                                <TableCell>{quincena}</TableCell>
                                {dates[index] && Object.keys(dates[index]).map((key) => (
                                    <TableCell key={key} sx={{ minWidth: 180 }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                value={dates[index][key]}
                                                onChange={(newValue) => handleDateChange(index, key, newValue)}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="outlined" size="small" fullWidth className={styles.datePicker} />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button variant="contained" color="primary" onClick={saveDates} sx={{ marginTop: 2 }}>
                    Guardar Fechas
                </Button>
            </Box>
        </ThemeProvider>
    );
};

export default ConfigurableTable;
