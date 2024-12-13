'use client';

import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Collapse, Modal, FormControlLabel, Checkbox } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import API_BASE_URL from '../%Config/apiConfig';
import styles from './page.module.css';

export default function EventTable({ anio, mes }) {
    const [data, setData] = useState([]); // Datos obtenidos de la API
    const [isLoading, setIsLoading] = useState(false); // Estado de carga
    const [selectedColumns, setSelectedColumns] = useState({
        id: true,
        titulo_evento: true,
        descripcion: true,
        quincena: false,
        mes: false,
        anio: false,
        fecha: false,
    }); // Columnas seleccionadas temporalmente por el usuario
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        titulo_evento: true,
        descripcion: true,
        quincena: false,
        mes: false,
        anio: false,
        fecha: false,
    }); // Columnas visibles en la tabla (controladas por "Generar Tabla")
    const [collapseOpen, setCollapseOpen] = useState(false); // Estado del colapso
    const [showModal, setShowModal] = useState(false); // Estado del modal de advertencia

    // Función para cargar los datos desde la API
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [year, month] = mes.split('-');
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            const queryParams = `fechaInicio=${startDate.toISOString().split('T')[0]}&fechaFin=${endDate.toISOString().split('T')[0]}`;
            const response = await fetch(`${API_BASE_URL}/rangoFechas?${queryParams}`);
            const result = await response.json();

            setData(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [anio, mes]);

    // Función para manejar la selección de columnas (checkboxes)
    const handleColumnSelectionChange = (key, checked) => {
        setSelectedColumns((prev) => ({
            ...prev,
            [key]: checked,
        }));
    };

    // Función para manejar la selección de todas las columnas
    const handleSelectAll = (checked) => {
        const updatedColumns = Object.keys(selectedColumns).reduce((acc, key) => {
            acc[key] = checked;
            return acc;
        }, {});
        setSelectedColumns(updatedColumns);
    };

    // Función para manejar el clic en "Generar Tabla"
    const handleGenerateTable = () => {
        const selected = Object.keys(selectedColumns).filter((key) => selectedColumns[key]);
        if (selected.length === 0) {
            setShowModal(true); // Mostrar modal si no hay columnas seleccionadas
            return;
        }

        setVisibleColumns(selectedColumns); // Actualizar las columnas visibles en la tabla
        setCollapseOpen(false); // Cerrar el colapso
    };

    return (
        <Box className={styles.tableContainer}>
            {/* Título con margen */}
            <Typography
                variant="h4"
                className={styles.title}
                sx={{ marginBottom: '20px' }} // Agregar margen inferior
            >
                Eventos del Mes
            </Typography>

            {/* Botones de Acciones */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginBottom: '20px',
                }}
            >
                <Button
                    variant="outlined"
                    onClick={fetchData}
                    color="primary"
                    startIcon={<RefreshIcon />}
                    sx={{ padding: '8px 16px' }}
                >
                    Refrescar Tabla
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setCollapseOpen(!collapseOpen)}
                    color="primary"
                    sx={{ padding: '8px 16px' }}
                >
                    Configurar Columnas
                </Button>
            </Box>

            {/* Apartado de selección de columnas */}
            <Collapse in={collapseOpen}>
                <Box
                    padding="20px"
                    border="1px solid #c4c4c4"
                    borderRadius="8px"
                    maxWidth="800px"
                    margin="20px auto"
                >
                    <Typography variant="h6" align="center" gutterBottom>
                        Campos para generar tabla
                    </Typography>
                    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
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
                            label="Seleccionar todos"
                            style={{ gridColumn: 'span 3' }}
                        />
                        {Object.keys(selectedColumns).map((key) => (
                            <FormControlLabel
                                key={key}
                                control={
                                    <Checkbox
                                        checked={selectedColumns[key]}
                                        onChange={(e) => handleColumnSelectionChange(key, e.target.checked)}
                                    />
                                }
                                label={key}
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

            {/* Tabla de datos */}
            <Box>
                {isLoading ? (
                    <Typography variant="body1">Cargando...</Typography>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {Object.keys(visibleColumns)
                                    .filter((key) => visibleColumns[key])
                                    .map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    {Object.keys(visibleColumns)
                                        .filter((key) => visibleColumns[key])
                                        .map((key) => (
                                            <td key={key}>{row[key]}</td>
                                        ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Box>

            {/* Modal de advertencia */}
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center',
                    }}
                >
                    <Typography id="modal-title" variant="h6" gutterBottom>
                        Por favor selecciona al menos un campo
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}
