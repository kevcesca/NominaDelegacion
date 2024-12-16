'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Pagination, Button } from '@mui/material';
import DateFilter from '../../../%Components/DateFilter/DateFilter';
import InformacionTable from './InformacionTable';
import styles from './page.module.css';
import API_BASE_URL from '../../../%Config/apiConfig';
import { useRouter } from 'next/navigation';

export default function ConsolidacionInformacion() {
    const [informacion, setInformacion] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [anio, setAnio] = useState(null); // Almacena el año seleccionado
    const [quincena, setQuincena] = useState(null); // Almacena la quincena seleccionada
    const rowsPerPage = 5;

    const router = useRouter(); // Para redirigir al hacer clic en el botón

    const fetchConsolidacion = async ({ anio, quincena }) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/consolidacionInformacion?anio=${anio}&quincena=${quincena}`);
            if (!response.ok) throw new Error('Error al obtener la consolidación de información');
            const data = await response.json();
            setInformacion(data);
            setFilteredData(data);
        } catch (error) {
            console.error(error);
            setInformacion([]);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date) => {
        const { anio, quincena } = date;
        setAnio(anio); // Actualiza el estado del año
        setQuincena(quincena); // Actualiza el estado de la quincena
        fetchConsolidacion({ anio, quincena });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = informacion.filter((item) =>
            Object.values(item).some((value) => value.toString().toLowerCase().includes(query))
        );

        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleExportClick = () => {
        if (anio && quincena) {
            const exportUrl = `/Cheques/Poliza/Exportar?anio=${anio}&quincena=${quincena}`;
            router.push(exportUrl); // Redirige a la URL generada
        } else {
            alert('Por favor selecciona un año y una quincena antes de exportar.');
        }
    };

    return (
        <Box className={styles.container}>
            <Typography variant="h5" className={styles.title}>
                Consolidación de Información
            </Typography>
            <DateFilter onDateChange={handleDateChange} />

            <TextField
                variant="outlined"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={handleSearch}
                fullWidth
                margin="normal"
            />

            <InformacionTable data={paginatedData} loading={loading} />

            <Pagination
                count={Math.ceil(filteredData.length / rowsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                className={styles.pagination}
            />

            {/* Botón para exportar */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleExportClick}
                    sx={{ backgroundColor: '#800000', color: 'white' }}
                >
                    Exportar
                </Button>
            </Box>
        </Box>
    );
}
