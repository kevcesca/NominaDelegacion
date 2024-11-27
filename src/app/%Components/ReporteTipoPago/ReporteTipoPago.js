'use client';

import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, Collapse, Checkbox, FormControlLabel, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import API_BASE_URL from '../../%Config/apiConfig';

export default function TablaConsultaCLCPorEmpleado() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState({});
    const [collapseOpen, setCollapseOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [anio, setAnio] = useState('2024'); // Valor actual para la consulta
    const [idEmpleado, setIdEmpleado] = useState('1046058'); // Valor actual para la consulta
    const [pendingAnio, setPendingAnio] = useState(anio); // Valor temporal
    const [pendingIdEmpleado, setPendingIdEmpleado] = useState(idEmpleado); // Valor temporal

    const availableColumns = [
        { key: 'anio', label: 'Año' },
        { key: 'quincena', label: 'Quincena' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellido_1', label: 'Primer Apellido' },
        { key: 'apellido_2', label: 'Segundo Apellido' },
        { key: 'nomina', label: 'Nomina' },
        { key: 'desc_extraor', label: 'Descripción Extraordinaria' },
        { key: 'tipopago', label: 'Tipo de Pago' },
        { key: 'liquido', label: 'Líquido' },
        { key: 'fec_pago', label: 'Fecha de Pago' },
    ];

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/consultaCLCPorEmpleado?anio=${anio}&idEmpleado=${idEmpleado}`);
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            const json = await response.json();
            setData(json);
            setFilteredData(json);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    };

    const mapColumns = (cols) =>
        cols.map((col) => ({
            field: col.key,
            headerName: col.label,
            flex: 1,
            minWidth: 150,
        }));

    useEffect(() => {
        fetchData();

        const initialColumns = mapColumns(
            availableColumns.filter((col) => col.key === 'anio' || col.key === 'nombre')
        );
        setColumns(initialColumns);

        const initialSelection = availableColumns.reduce((acc, col) => {
            acc[col.key] = false;
            return acc;
        }, {});
        setSelectedColumns(initialSelection);
    }, []);

    const handleConsultar = () => {
        setAnio(pendingAnio); // Actualiza el valor del año con el pendiente
        setIdEmpleado(pendingIdEmpleado); // Actualiza el valor del ID Empleado con el pendiente
        fetchData(); // Ejecuta la búsqueda con los valores actualizados
    };

    const handleFilterChange = (event) => {
        const value = event.target.value.toLowerCase();
        setGlobalFilter(value);

        const filtered = data.filter((row) =>
            Object.values(row).some((val) => val?.toString().toLowerCase().includes(value))
        );
        setFilteredData(filtered);
    };

    const handleGenerateTable = () => {
        const selectedKeys = Object.keys(selectedColumns).filter((key) => selectedColumns[key]);

        if (selectedKeys.length === 0) {
            setShowModal(true); // Mostrar modal si no se seleccionó ningún campo
            return;
        }

        const newColumns = mapColumns(availableColumns.filter((col) => selectedKeys.includes(col.key)));
        setColumns(newColumns);
        setCollapseOpen(false);
    };

    const handleColumnSelectionChange = (event) => {
        setSelectedColumns({
            ...selectedColumns,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        const updatedSelection = availableColumns.reduce((acc, col) => {
            acc[col.key] = isChecked;
            return acc;
        }, {});
        setSelectedColumns(updatedSelection);
    };

    const handleExport = (type) => {
        const filteredExportData = filteredData.map((row) => {
            const filteredRow = {};
            columns.forEach((col) => {
                filteredRow[col.field] = row[col.field];
            });
            return filteredRow;
        });

        if (type === 'pdf') {
            const doc = new jsPDF();
            const tableColumns = columns.map((col) => col.headerName);
            const tableRows = filteredExportData.map((row) =>
                columns.map((col) => row[col.field])
            );
            autoTable(doc, { head: [tableColumns], body: tableRows });
            doc.save('tipo_pago.pdf');
        } else if (type === 'csv') {
            const csvContent = [
                columns.map((col) => col.headerName).join(','),
                ...filteredExportData.map((row) =>
                    columns.map((col) => row[col.field]).join(',')
                ),
            ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, 'tipo_pago.csv');
        } else if (type === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(filteredExportData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAs(
                new Blob([excelBuffer], { type: 'application/octet-stream' }),
                'tipo_pago.xlsx'
            );
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" padding="20px">
            <Typography variant="h4" gutterBottom>
                Histórico de Movimientos por Tipo de Nómina
            </Typography>

            {/* Campos de búsqueda */}
            <Box display="flex" gap="20px" marginBottom="20px">
                <TextField
                    label="Año"
                    variant="outlined"
                    value={pendingAnio} // Utiliza el valor pendiente
                    onChange={(e) => setPendingAnio(e.target.value)} // Actualiza solo el pendiente
                />
                <TextField
                    label="ID Empleado"
                    variant="outlined"
                    value={pendingIdEmpleado} // Utiliza el valor pendiente
                    onChange={(e) => setPendingIdEmpleado(e.target.value)} // Actualiza solo el pendiente
                />
                <Button variant="contained" onClick={handleConsultar}>
                    Consultar
                </Button>
            </Box>

            {/* Campo de búsqueda global */}
            <TextField
                label="Buscar"
                variant="outlined"
                fullWidth
                value={globalFilter}
                onChange={handleFilterChange}
                style={{ marginBottom: '20px', maxWidth: '1200px' }}
            />

            {/* Botón Seleccionar Columnas */}
            <Button
                variant="contained"
                onClick={() => setCollapseOpen(!collapseOpen)}
                style={{ marginBottom: '20px' }}
            >
                Seleccionar Columnas
            </Button>

            <Collapse in={collapseOpen}>
                <Box
                    padding="20px"
                    border="1px solid #c4c4c4"
                    borderRadius="8px"
                    maxWidth="1200px"
                    margin="20px auto"
                >
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
                                    onChange={handleSelectAll}
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
                                        onChange={handleColumnSelectionChange}
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

            {/* Tabla de datos */}
            <Box height="500px" width="100%" maxWidth="1200px">
                <DataGrid
                    rows={filteredData}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    getRowId={(row) => row.anio + row.quincena}
                />
            </Box>

            {/* Botones de exportación */}
            <Box marginTop="20px" display="flex" gap="10px">
                <Button variant="outlined" onClick={() => handleExport('csv')}>
                    Exportar CSV
                </Button>
                <Button variant="outlined" onClick={() => handleExport('excel')}>
                    Exportar Excel
                </Button>
                <Button variant="outlined" onClick={() => handleExport('pdf')}>
                    Exportar PDF
                </Button>
            </Box>

            {/* Modal */}
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
                        width: '50%',
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowModal(false)}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}