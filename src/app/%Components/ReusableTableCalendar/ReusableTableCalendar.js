'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  Checkbox,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ExportModal from '../ReusableTableCalendar/components/ExportModal'; // Asegúrate de usar la ruta correcta
import styles from "./ReusableTableCalendar.module.css";
import { Toast } from 'primereact/toast';

const columns = [
  { label: 'ID', accessor: 'id' },
  { label: 'Título del Evento', accessor: 'titulo_evento' },
  { label: 'Descripción', accessor: 'descripcion' },
  { label: 'Fecha', accessor: 'fecha' },
];

// **Función para formatear la fecha**
const formatFecha = (fecha) => {
  if (!fecha) return '-';
  const [year, month, day] = fecha.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function ReusableTableCalendar({ API_BASE_URL, anio, mes }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const toastRef = useRef(null);

  // **Función para cargar datos desde la API**
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [year, month] = mes.split('-');
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${new Date(year, month, 0).getDate()}`;
      const url = `${API_BASE_URL}/rangoFechas?fechaInicio=${startDate}&fechaFin=${endDate}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('No se pudieron cargar los eventos.');

      const result = await response.json();
      const formattedResult = result.map((row) => ({
        ...row,
        fecha: formatFecha(row.fecha),
      }));

      setData(Array.isArray(formattedResult) ? formattedResult : []);
      setFilteredData(formattedResult);
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      toastRef.current.show({
        severity: 'error',
        summary: 'Error al cargar eventos',
        detail: 'Hubo un problema al obtener los datos.',
        life: 3000,
      });
      setData([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (anio && mes) {
      fetchData();
    }
  }, [anio, mes]);

  // **Buscar eventos**
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = data.filter((row) =>
      columns.some((col) =>
        String(row[col.accessor] || '').toLowerCase().includes(query)
      )
    );

    setFilteredData(filtered);
  };

  // **Seleccionar filas**
  const handleSelectRow = (row) => {
    setSelectedRows((prev) =>
      prev.includes(row) ? prev.filter((r) => r !== row) : [...prev, row]
    );
  };

  const handleSelectAll = (event) => {
    setSelectedRows(event.target.checked ? filteredData : []);
  };

  // **Abrir modal de exportación**
  const handleExportModalOpen = () => {
    if (selectedRows.length === 0) {
      toastRef.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Selecciona al menos una fila para exportar.',
        life: 3000,
      });
      return;
    }
    setExportModalOpen(true);
  };

  const handleExportModalClose = () => {
    setExportModalOpen(false);
  };

  return (
    <Paper className={styles.tableContainer}>
      <Toast ref={toastRef} />
      {/* Barra de búsqueda y botones de acción */}
      <Box sx={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Buscar eventos..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
          }}
        />
        <IconButton
          onClick={fetchData}
          sx={{
            color: '#000000',
          }}
        >
          <RefreshIcon />
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportModalOpen}
          disabled={selectedRows.length === 0}
          sx={{
            backgroundColor: '#9b1d1d',
            '&:hover': { backgroundColor: '#7b1616' },
          }}
        >
          Exportar
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < filteredData.length}
                  checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {columns.map((col) => (
                <TableCell key={col.accessor} className={styles.tableHeader}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  No hay eventos para mostrar
                </TableCell>
              </TableRow>
            ) : (
              filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(row)}
                      onChange={() => handleSelectRow(row)}
                    />
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.accessor}>
                      {row[col.accessor] || '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />

      {/* Modal de exportación */}
      <ExportModal
        open={isExportModalOpen}
        onClose={handleExportModalClose}
        selectedRows={selectedRows}
        columns={columns}
      />
    </Paper>
  );
}
