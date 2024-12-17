'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Pagination, Button } from '@mui/material';
import DateFilter from '../../%Components/DateFilter/DateFilter'; // Ajusta la ruta si es necesario
import PolizasTable from './components/PolizasTable'; // Ajusta la ruta si es necesario
import styles from './page.module.css';
import API_BASE_URL from '../../%Config/apiConfig';

export default function PolizasGeneradas() {
    const [polizas, setPolizas] = useState([]);
    const [filteredPolizas, setFilteredPolizas] = useState([]); // Para la búsqueda
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5; // Número de filas por página

    // Estados adicionales para generación manual
    const [manualQuincena, setManualQuincena] = useState(''); // Quincena manual
    const [manualFecha, setManualFecha] = useState(''); // Fecha manual

    // Función existente para traer pólizas
    const fetchPolizas = async ({ anio, quincena, fecha }) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/poliza?quincena=${quincena}&anio=${anio}`);
            if (!response.ok) throw new Error('Error al obtener las pólizas');
            const data = await response.json();
            setPolizas(data);
            setFilteredPolizas(data); // Inicializar la búsqueda
        } catch (error) {
            console.error(error);
            setPolizas([]);
            setFilteredPolizas([]);
        } finally {
            setLoading(false);
        }
    };

    // Nueva función para generar pólizas
    const generarPolizas = async () => {
        if (!manualQuincena || !manualFecha) {
            alert('Por favor ingresa la quincena y la fecha.');
            return;
        }

        try {
            setLoading(true);
            const url = `${API_BASE_URL}/generarPolizas?quincena=${manualQuincena}&fecha=${manualFecha}`;
            console.log("URL de generación de pólizas:", url);

            const response = await fetch(url, { method: 'GET' });

            if (!response.ok) throw new Error('Error al generar las pólizas');

            alert('Pólizas generadas correctamente.');
        } catch (error) {
            console.error('Error al generar las pólizas:', error);
            alert('Error al generar las pólizas. Verifique los datos.');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date) => {
        const { anio, quincena } = date;
        const fechaSeleccionada = new Date(anio, Math.floor((quincena - 1) / 2), quincena % 2 === 0 ? 15 : 1)
            .toISOString()
            .split('T')[0]; // Convertir a formato "yyyy-mm-dd"

        fetchPolizas({ anio, quincena, fecha: fechaSeleccionada });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = polizas.filter((poliza) =>
            Object.values(poliza).some((value) => value.toString().toLowerCase().includes(query))
        );

        setFilteredPolizas(filtered);
        setCurrentPage(1); // Reiniciar a la primera página al filtrar
    };

    // Obtener los datos actuales de la página
    const paginatedData = filteredPolizas.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box className={styles.container}>
            <Typography variant="h5" className={
styles.title}>
Pólizas Generadas
</Typography>

{/* DateFilter para traer pólizas existentes */}
<DateFilter onDateChange={handleDateChange} />

{/* Campos adicionales para generar nuevas pólizas */}
<Box display="flex" flexDirection="column" gap={2} marginTop={4}>
<Typography variant="h6">Generar Nuevas Pólizas</Typography>

{/* Campo para ingresar manualmente la quincena */}
<TextField
    label="Número de Quincena"
    placeholder="Ejemplo: 01, 02, 03, 04"
    variant="outlined"
    value={manualQuincena}
    onChange={(e) => setManualQuincena(e.target.value)}
    fullWidth
/>

{/* Campo para ingresar la fecha */}
<TextField
    label="Fecha"
    type="date"
    variant="outlined"
    InputLabelProps={{ shrink: true }}
    value={manualFecha}
    onChange={(e) => setManualFecha(e.target.value)}
    fullWidth
/>

{/* Botón para generar las pólizas */}
<Button
    variant="contained"
    color="primary"
    onClick={generarPolizas}
>
    Generar Pólizas
</Button>
</Box>

{/* Campo de búsqueda existente */}
<TextField
variant="outlined"
placeholder="Buscar..."
value={searchQuery}
onChange={handleSearch}
fullWidth
margin="normal"
sx={{ marginTop: '6rem' }}
/>

{/* Tabla existente */}
<PolizasTable polizas={paginatedData} loading={loading} />

{/* Paginación existente */}
<Pagination
count={Math.ceil(filteredPolizas.length / rowsPerPage)}
page={currentPage}
onChange={handlePageChange}
color="primary"
className={styles.pagination}
/>
</Box>
);
}
