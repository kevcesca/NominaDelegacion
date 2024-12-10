'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Pagination } from '@mui/material';
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

    const fetchPolizas = async ({ anio, quincena, fecha }) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/poliza?quincena=${quincena}&fecha=${fecha}`);
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
            <Typography variant="h5" className={styles.title}>
                Pólizas Generadas
            </Typography>
            <DateFilter onDateChange={handleDateChange} />

            <TextField
                variant="outlined"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={handleSearch}
                fullWidth
                margin="normal"
                sx={{ marginTop: '6rem' }}
            />

            <PolizasTable polizas={paginatedData} loading={loading} />

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
