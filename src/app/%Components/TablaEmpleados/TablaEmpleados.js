'use client';

import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, Collapse } from '@mui/material';
import { DataGrid, getGridStringOperators } from '@mui/x-data-grid';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import ColumnSelector from '../../%Components/ColumnSelector/ColumnSelector';
import API_BASE_URL from '../../%Config/apiConfig';
import styles from './TablaUsuarios.module.css';

export default function EmpleadosTable() {
    // Estados
    const [data, setData] = useState([]); // Datos de la tabla
    const [columns, setColumns] = useState([]); // Columnas visibles en la tabla
    const [selectedColumns, setSelectedColumns] = useState({}); // Columnas seleccionadas dinámicamente
    const [globalFilter, setGlobalFilter] = useState(''); // Texto del filtro global
    const [collapseOpen, setCollapseOpen] = useState(false); // Control del panel de selección de columnas

    // Columnas disponibles
    const availableColumns = [
        { key: 'id_empleado', label: 'ID Empleado', defaultSelected: true },
        { key: 'nombre', label: 'Nombre', defaultSelected: true },
        { key: 'apellido_1', label: 'Apellido Paterno', defaultSelected: true },
        { key: 'apellido_2', label: 'Apellido Materno', defaultSelected: true },
        { key: 'curp', label: 'CURP', defaultSelected: false },
        { key: 'id_legal', label: 'ID Legal', defaultSelected: false },
        { key: 'id_sexo', label: 'Sexo', defaultSelected: false },
        { key: 'fec_nac', label: 'Fecha de Nacimiento', defaultSelected: false },
        { key: 'fec_alta_empleado', label: 'Fecha de Alta', defaultSelected: false },
        { key: 'fec_antiguedad', label: 'Fecha de Antigüedad', defaultSelected: false },
        { key: 'numero_ss', label: 'Número de Seguro Social', defaultSelected: false },
        { key: 'id_reg_issste', label: 'Registro ISSSTE', defaultSelected: false },
        { key: 'ahorr_soli_porc', label: 'Porcentaje de Ahorro Solidario', defaultSelected: false },
        { key: 'estado', label: 'Estado', defaultSelected: false },
        { key: 'deleg_municip', label: 'Delegación/Municipio', defaultSelected: false },
        { key: 'poblacion', label: 'Población', defaultSelected: false },
        { key: 'colonia', label: 'Colonia', defaultSelected: false },
        { key: 'direccion', label: 'Dirección', defaultSelected: false },
        { key: 'codigo_postal', label: 'Código Postal', defaultSelected: false },
        { key: 'num_interior', label: 'Número Interior', defaultSelected: false },
        { key: 'num_exterior', label: 'Número Exterior', defaultSelected: false },
        { key: 'calle', label: 'Calle', defaultSelected: false },
        { key: 'n_delegacion_municipio', label: 'Nombre Delegación/Municipio', defaultSelected: false },
        { key: 'ent_federativa', label: 'Entidad Federativa', defaultSelected: false },
        { key: 'sect_pres', label: 'Sector Presupuestal', defaultSelected: false },
        { key: 'n_puesto', label: 'Puesto', defaultSelected: false },
        { key: 'fecha_insercion', label: 'Fecha de Inserción', defaultSelected: false },
        { key: 'activo', label: 'Activo', defaultSelected: false },
        { key: 'nombre_nomina', label: 'Nombre Nómina', defaultSelected: false },
        { key: 'forma_de_pago', label: 'Forma de Pago', defaultSelected: false }
    ];

    // Fetch de datos desde el API
    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/NominaCtrl/Empleados`);
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    };

    // Mapear columnas con configuraciones completas
    const mapColumns = (cols) =>
        cols.map((col) => ({
            field: col.key,
            headerName: col.label,
            flex: 1,
            filterable: true,
            sortable: true,
            filterOperators: getGridStringOperators(), // Usa los operadores predeterminados de strings
        }));

    useEffect(() => {
        fetchData();

        // Filtrar columnas por defecto y mapearlas
        const initialColumns = mapColumns(
            availableColumns.filter((col) => col.defaultSelected)
        );

        // Si no hay columnas por defecto seleccionadas, agrega una de fallback
        if (initialColumns.length === 0) {
            initialColumns.push({
                field: 'id_empleado',
                headerName: 'ID Empleado',
                flex: 1,
                filterable: true,
                filterOperators: getGridStringOperators(),
            });
        }

        setColumns(initialColumns);

        // Configurar columnas seleccionadas
        const initialSelection = availableColumns.reduce((acc, col) => {
            acc[col.key] = col.defaultSelected;
            return acc;
        }, {});
        setSelectedColumns(initialSelection);
    }, []);

    // Actualizar columnas según la selección en el ColumnSelector
    const handleColumnSelectionChange = (selected) => {
        setSelectedColumns(selected);

        const newColumns = mapColumns(
            availableColumns.filter((col) => selected[col.key])
        );

        // Si el usuario no selecciona ninguna columna, agrega una columna de fallback
        if (newColumns.length === 0) {
            newColumns.push({
                field: 'id_empleado',
                headerName: 'ID Empleado',
                flex: 1,
                filterable: true,
                filterOperators: getGridStringOperators(),
            });
        }

        setColumns(newColumns);
    };

    // Exportar datos a CSV, Excel o PDF
    const handleExport = (type) => {
        const filteredData = data.map((row) => {
            const filteredRow = {};
            columns.forEach((col) => {
                filteredRow[col.field] = row[col.field];
            });
            return filteredRow;
        });

        if (type === 'pdf') {
            const doc = new jsPDF();
            const tableColumns = columns.map((col) => col.headerName);
            const tableRows = filteredData.map((row) =>
                columns.map((col) => row[col.field])
            );
            autoTable(doc, { head: [tableColumns], body: tableRows });
            doc.save('empleados.pdf');
        } else if (type === 'csv') {
            const csvContent = [
                columns.map((col) => col.headerName).join(','), // Encabezados
                ...filteredData.map((row) =>
                    columns.map((col) => row[col.field]).join(',')
                ), // Filas
            ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, 'empleados.csv');
        } else if (type === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAs(
                new Blob([excelBuffer], { type: 'application/octet-stream' }),
                'empleados.xlsx'
            );
        }
    };

    return (
        <Box className={styles.container}>
            <Typography variant="h4" gutterBottom>
                Tabla Empleados
            </Typography>

            {/* Barra de búsqueda */}
            <TextField
                label="Buscar"
                variant="outlined"
                fullWidth
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                style={{ marginBottom: '20px' }}
            />

            {/* Botón para seleccionar columnas */}
            <Button variant="contained" onClick={() => setCollapseOpen(!collapseOpen)}>
                Seleccionar Columnas
            </Button>

            {/* Panel de selección de columnas */}
            <Collapse in={collapseOpen}>
                <Box marginTop={2}>
                    <ColumnSelector
                        availableColumns={availableColumns}
                        onSelectionChange={handleColumnSelectionChange}
                    />
                </Box>
            </Collapse>

            {/* Tabla */}
            <Box marginTop={3} height={500}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    getRowId={(row) => row.id_empleado}
                    disableColumnFilter={false} // Habilitar menús de filtros dinámicos
                    disableColumnMenu={false} // Mostrar menú completo para filtros
                />
            </Box>

            {/* Botones de exportación */}
            <Box marginTop={3} display="flex" gap={2}>
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
        </Box>
    );
}
