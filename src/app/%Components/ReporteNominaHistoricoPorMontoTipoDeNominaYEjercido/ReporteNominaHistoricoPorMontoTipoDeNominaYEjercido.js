'use client';

import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, Collapse, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import API_BASE_URL from '../../%Config/apiConfig';

export default function ReporteNominaHistoricoPorMontoTipoDeNominaYEjercido() {
    const [data, setData] = useState([]); // Datos de la tabla
    const [filteredData, setFilteredData] = useState([]); // Datos filtrados
    const [columns, setColumns] = useState([]); // Columnas visibles
    const [selectedColumns, setSelectedColumns] = useState({}); // Columnas seleccionadas
    const [collapseOpen, setCollapseOpen] = useState(false); // Control de colapso
    const [globalFilter, setGlobalFilter] = useState(''); // Filtro global
    const [startDate, setStartDate] = useState(dayjs('2024-01-01')); // Fecha de inicio predefinida
    const [endDate, setEndDate] = useState(dayjs('2024-01-31')); // Fecha de fin predefinida
    const [loading, setLoading] = useState(false); // Indicador de carga
    const [error, setError] = useState(null); // Mensaje de error

    const availableColumns = [
        { key: 'Registro', label: 'Registro' },
        { key: 'Tipo de Nómina', label: 'Tipo de Nómina' },
        { key: 'CLC de la Nómina Generada', label: 'CLC de la Nómina Generada' },
        { key: 'Periodo', label: 'Periodo' },
        { key: 'Monto de CLC', label: 'Monto de CLC' },
        { key: 'Pago de Inicio de Pago', label: 'Pago de Inicio de Pago' },
        { key: 'Monto Pagado', label: 'Monto Pagado' },
        { key: 'Pendiente por Pagar', label: 'Pendiente por Pagar' },
    ];

    // Función para obtener los datos desde el API
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        // Construcción del endpoint con parámetros usando API_BASE_URL
        const url = `${API_BASE_URL}/reporteNominaHistorico?anio=${startDate.year()}&fechaInicio=${startDate.format(
            'YYYY-MM-DD'
        )}&fechaFin=${endDate.format('YYYY-MM-DD')}`;

        console.log('Realizando petición a:', url); // Depuración de la URL

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error al obtener los datos: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Datos obtenidos del servidor:', result); // Log para confirmar los datos obtenidos

            setData(result); // Almacena datos en el estado principal
            setFilteredData(result); // Almacena datos en el estado filtrado
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            setError('No se pudieron cargar los datos. Verifique la conexión o contacte al administrador.');
        } finally {
            setLoading(false);
        }
    };

    const mapColumns = (cols) =>
        cols.map((col) => ({
            field: col.key,
            headerName: col.label,
            flex: 1,
            minWidth: 150,
        }));

    // Realiza la consulta inicial al cargar el componente
    useEffect(() => {
        // Configura las columnas iniciales
        const initialColumns = mapColumns(
            availableColumns.filter((col) => col.key === 'Registro' || col.key === 'Tipo de Nómina')
        );
        setColumns(initialColumns);

        // Configura las columnas seleccionadas por defecto
        const initialSelection = availableColumns.reduce((acc, col) => {
            acc[col.key] = false;
            return acc;
        }, {});
        setSelectedColumns(initialSelection);

        // Obtén los datos por defecto
        fetchData();
    }, []);

    const handleGenerateTable = () => {
        const selectedKeys = Object.keys(selectedColumns).filter((key) => selectedColumns[key]);

        if (selectedKeys.length === 0) {
            alert('Por favor selecciona al menos un campo para generar la tabla.');
            return;
        }

        const newColumns = mapColumns(availableColumns.filter((col) => selectedKeys.includes(col.key)));
        setColumns(newColumns);
        setCollapseOpen(false);
    };

    const handleFilterChange = (event) => {
        const value = event.target.value.toLowerCase();
        setGlobalFilter(value);

        const filtered = data.filter((row) =>
            Object.values(row).some((val) => val?.toString().toLowerCase().includes(value))
        );
        setFilteredData(filtered);
    };

    const handleSelectAll = (isChecked) => {
        const updatedSelection = availableColumns.reduce((acc, col) => {
            acc[col.key] = isChecked;
            return acc;
        }, {});
        setSelectedColumns(updatedSelection);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" padding="20px">
            <Typography variant="h4" gutterBottom>
                Reporte: Nómina Histórico por Monto, Tipo de Nómina y Ejercido
            </Typography>

            {/* Rango de fechas */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2} justifyContent="center" marginBottom="20px">
                    <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                            label="Fecha de Inicio"
                            value={startDate}
                            onChange={(newStartDate) => setStartDate(newStartDate)}
                            minDate={dayjs('2024-01-01')} // Fecha mínima prestablecida
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                            label="Fecha de Fin"
                            value={endDate}
                            onChange={(newEndDate) => setEndDate(newEndDate)}
                            minDate={startDate} // Asegura que Fecha de Fin no sea menor a Fecha de Inicio
                            defaultCalendarMonth={startDate} // Enfoca el calendario en la Fecha de Inicio
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={fetchData}
                            disabled={loading}
                            style={{ height: '56px' }}
                        >
                            {loading ? 'Cargando...' : 'Consultar'}
                        </Button>
                    </Grid>
                </Grid>
            </LocalizationProvider>

            {error && (
                <Typography color="error" variant="body1" marginBottom="20px">
                    {error}
                </Typography>
            )}

            {/* Buscar */}
            <TextField
                label="Buscar"
                variant="outlined"
                fullWidth
                value={globalFilter}
                onChange={handleFilterChange}
                style={{ marginBottom: '20px', maxWidth: '1200px' }}
            />

            {/* Seleccionar columnas */}
            <Button
                variant="contained"
                onClick={() => setCollapseOpen(!collapseOpen)}
                style={{ marginBottom: '20px' }}
            >
                Seleccionar Columnas
            </Button>

            <Collapse in={collapseOpen}>
                <Box padding="20px" border="1px solid #c4c4c4" borderRadius="8px" maxWidth="1200px" margin="20px auto">
                    <Typography variant="h6" align="center" gutterBottom>
                        Campos para generar tabla
                    </Typography>
                    <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="10px">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={Object.values(selectedColumns).every((val) => val)}
                                    indeterminate={
                                        Object.values(selectedColumns).some((val) => val) &&
                                        !Object.values(selectedColumns).every((val) => val)
                                    }
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            }
                            label="Todos los campos"
                            style={{ gridColumn: 'span 4' }}
                        />
                        {availableColumns.map((col) => (
                            <FormControlLabel
                                key={col.key}
                                control={
                                    <Checkbox
                                        checked={selectedColumns[col.key] || false}
                                        onChange={(e) =>
                                            setSelectedColumns({
                                                ...selectedColumns,
                                                [col.key]: e.target.checked,
                                            })
                                        }
                                        name={col.key}
                                    />
                                }
                                label={col.label}
                            />
                        ))}
                    </Box>
                    <Box textAlign="center" marginTop="20px">
                        <Button variant="contained" color="primary" onClick={handleGenerateTable}>
                            Generar Tabla
                        </Button>
                    </Box>
                </Box>
            </Collapse>

            {/* Tabla */}
            <Box height="500px" width="100%" maxWidth="1200px">
                <DataGrid
                    rows={filteredData}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    getRowId={(row) => row.Registro}
                />
            </Box>
        </Box>
    );
}
