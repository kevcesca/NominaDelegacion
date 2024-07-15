'use client';
import React, { useState, useEffect } from 'react';
import {
    Select,
    MenuItem,
    Button,
    Box,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ThemeProvider
} from '@mui/material';
import theme from '../../$tema/theme';
import ConfigurableTable from './ConfigurableTable';
import ViewOnlyTable from './ViewOnlyTable';
import data from './data.json';

const YearSelector = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [showTable, setShowTable] = useState(false);
    const [showViewTable, setShowViewTable] = useState(false);
    const [dates, setDates] = useState([]);

    useEffect(() => {
        setDates(data[year] || []);
    }, [year]);

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleShowTable = () => {
        setShowTable(true);
    };

    const handleShowViewTable = () => {
        setShowViewTable(true);
    };

    const handleClose = () => {
        setShowTable(false);
        setShowViewTable(false);
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
                        Configurar Tabla
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleShowViewTable} sx={{ marginLeft: 2 }}>
                        Ver Tabla
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
                <Dialog
                    open={showViewTable}
                    onClose={handleClose}
                    maxWidth="xl"
                    fullWidth
                    scroll="paper"
                >
                    <DialogTitle>Ver Fechas de Quincenas - Año {year}</DialogTitle>
                    <DialogContent dividers>
                        <ViewOnlyTable year={year} data={dates} />
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
