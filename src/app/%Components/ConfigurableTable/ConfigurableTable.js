'use client'
import React, { useState } from 'react';
import {
    TextField,
    MenuItem,
    Button,
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Select,
    ThemeProvider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import theme from '../../$tema/theme';
import styles from './ConfigurableTable.module.css';

const ConfigurableTable = ({ year }) => {
    const [dates, setDates] = useState(
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

    const handleDateChange = (index, key, newValue) => {
        const newDates = [...dates];
        newDates[index][key] = newValue;
        setDates(newDates);
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
                            {Object.keys(dates[0]).map((key) => (
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
        </Box>
    );
};

const YearSelector = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [showTable, setShowTable] = useState(false);

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleShowTable = () => {
        setShowTable(true);
    };

    const handleClose = () => {
        setShowTable(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Seleccionar Año
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Select value={year} onChange={handleYearChange} displayEmpty>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button variant="contained" color="primary" onClick={handleShowTable} sx={{ marginLeft: 2 }}>
                        Mostrar Tabla
                    </Button>
                </Box>
                <Dialog
                    open={showTable}
                    onClose={handleClose}
                    maxWidth="xl"
                    fullWidth
                    scroll="paper"
                >
                    <DialogTitle>Configurar Fechas de Quincenas - Año {year}</DialogTitle>
                    <DialogContent dividers>
                        <ConfigurableTable year={year} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

export default YearSelector;
