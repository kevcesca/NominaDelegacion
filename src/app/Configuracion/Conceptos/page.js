'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Paper } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import API_BASE_URL from '../../%Config/apiConfig';
import styles from './page.module.css';

export default function TablaConceptos() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Fetch inicial de datos
    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/cat/conceptos`);
            if (!response.ok) throw new Error('Error al obtener los datos');
            const result = await response.json();
            setData(result);
            setFilteredData(result);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Búsqueda en la tabla
    useEffect(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const filtered = data.filter(item =>
            item.nombre_concepto.toLowerCase().includes(lowerCaseSearch) ||
            item.id_concepto.toString().includes(lowerCaseSearch)
        );
        setFilteredData(filtered);
    }, [searchTerm, data]);

    // Manejo de cambio de página y filas por página
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handlers para agregar, actualizar y eliminar
    const handleAddConcept = () => {
        console.log('Agregar concepto');
        // Implementar lógica para abrir un formulario de creación
    };

    const handleEditConcept = (concept) => {
        console.log('Editar concepto:', concept);
        // Implementar lógica para abrir un formulario de edición
    };

    const handleDeleteConcept = async (conceptId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cat/conceptos/${conceptId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar el concepto');
            setData(data.filter(item => item.id_concepto !== conceptId));
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    return (
        <Box className={styles.container}>
            <Typography variant="h4" gutterBottom className={styles.title}>
                Gestión de Conceptos
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} className={styles.button}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Buscar en la tabla..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddConcept}>
                    Crear Concepto
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"><strong>ID del Concepto</strong></TableCell>
                            <TableCell align="left"><strong>Nombre del Concepto</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow key={row.id_concepto}>
                                <TableCell>{row.id_concepto}</TableCell>
                                <TableCell>{row.nombre_concepto}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => handleEditConcept(row)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteConcept(row.id_concepto)} color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
}
