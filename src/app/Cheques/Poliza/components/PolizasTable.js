import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
    Box,
} from '@mui/material';
import styles from '../page.module.css';

export default function PolizasTable({
    polizas,
    loading,
    onRowSelectionChange,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
}) {
    const [selectedRows, setSelectedRows] = useState([]); // Estado local para filas seleccionadas

    // Manejar selección de una fila
    const handleSelectRow = (poliza) => {
        const newSelectedRows = selectedRows.includes(poliza)
            ? selectedRows.filter((row) => row !== poliza)
            : [...selectedRows, poliza];

        setSelectedRows(newSelectedRows);
        onRowSelectionChange(newSelectedRows); // Notificar al componente padre
    };

    // Manejar selección/deselección de todas las filas
    const handleSelectAll = (e) => {
        const newSelectedRows = e.target.checked ? [...polizas] : [];
        setSelectedRows(newSelectedRows);
        onRowSelectionChange(newSelectedRows); // Notificar al componente padre
    };

    // Verificar si todos están seleccionados
    const allSelected = polizas.length > 0 && selectedRows.length === polizas.length;

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(e.target.value);
        setCurrentPage(1); // Reiniciar a la primera página
    };

    const paginatedPolizas = polizas.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <Box>
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Checkbox para seleccionar todos */}
                            <TableCell padding="checkbox" sx={{ backgroundColor: '#800000' }}>
                                <Checkbox
                                    checked={allSelected}
                                    indeterminate={
                                        selectedRows.length > 0 &&
                                        selectedRows.length < polizas.length
                                    }
                                    onChange={handleSelectAll}
                                    sx={{ color: 'white' }}
                                />
                            </TableCell>
                            <TableCell
                                sx={{
                                    backgroundColor: '#800000',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}
                            >
                                ID Empleado
                            </TableCell>
                            <TableCell
                                sx={{
                                    backgroundColor: '#800000',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Folio Cheque
                            </TableCell>
                            <TableCell
                                sx={{
                                    backgroundColor: '#800000',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Folio Póliza
                            </TableCell>
                            <TableCell
                                sx={{
                                    backgroundColor: '#800000',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Concepto de Pago
                            </TableCell>
                            <TableCell
                                sx={{
                                    backgroundColor: '#800000',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Percepciones
                            </TableCell>
                            <TableCell
                                sx={{
                                    backgroundColor: '#800000',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Deducciones
                            </TableCell>
                            <TableCell
                                sx={{
                                    backgroundColor: '#800000',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Líquido
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    Cargando...
                                </TableCell>
                            </TableRow>
                        ) : paginatedPolizas.length > 0 ? (
                            paginatedPolizas.map((poliza) => (
                                <TableRow key={poliza.id} className={styles.tableRow} hover>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedRows.includes(poliza)}
                                            onChange={() => handleSelectRow(poliza)}
                                        />
                                    </TableCell>
                                    <TableCell className={styles.tableCell} align="center">
                                        {poliza.id_empleado}
                                    </TableCell>
                                    <TableCell className={styles.tableCell} align="center">
                                        {poliza.folio_cheque}
                                    </TableCell>
                                    <TableCell className={styles.tableCell} align="center">
                                        {poliza.folio_poliza}
                                    </TableCell>
                                    <TableCell className={styles.tableCell} align="center">
                                        {poliza.concepto_pago}
                                    </TableCell>
                                    <TableCell className={styles.tableCell} align="center">
                                        {`$${poliza.percepciones.toFixed(2)}`}
                                    </TableCell>
                                    <TableCell className={styles.tableCell} align="center">
                                        {`$${poliza.deducciones.toFixed(2)}`}
                                    </TableCell>
                                    <TableCell className={styles.tableCell} align="center">
                                        {`$${poliza.liquido.toFixed(2)}`}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    sx={{
                                        textAlign: 'center',
                                        color: '#800000',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    No hay registros disponibles
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Footer con selector de registros y paginación */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                }}
            >
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Rows per page</InputLabel>
                    <Select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        label="Rows per page"
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                    </Select>
                </FormControl>

                <Pagination
                    count={Math.ceil(polizas.length / rowsPerPage)}
                    page={currentPage}
                    onChange={(e, value) => setCurrentPage(value)}
                    color="primary"
                />
            </Box>
        </Box>
    );
}
