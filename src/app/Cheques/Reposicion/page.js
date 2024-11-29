"use client";
import { useState } from 'react';
import styles from '../Reposicion/page.module.css';
import { Box, Typography, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Checkbox } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';
import Save from '@mui/icons-material/Save';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

export default function RepositionChequesTable() {
    const [cheques, setCheques] = useState([
        {
            id: '101',
            employeeName: 'Juan Pérez',
            amount: '1500',
            payrollType: 'NOMINA 8',
            chequeFolio: '2001',
            policyFolio: '1001',
            fortnight: '1',
            year: '2024',
            reason: '',
            evidence: null,
        },
        {
            id: '102',
            employeeName: 'Ana Gómez',
            amount: '2000',
            payrollType: 'ESTRUCTURA',
            chequeFolio: '2002',
            policyFolio: '1002',
            fortnight: '2',
            year: '2024',
            reason: '',
            evidence: null,
        },
    ]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRows, setSelectedRows] = useState([]);
    const [editedRow, setEditedRow] = useState(null);  
    const [editedReason, setEditedReason] = useState('');
    const [editedEvidence, setEditedEvidence] = useState(null);

    const handleCheckboxChange = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const handleEditStart = (row) => {
        setEditedRow(row.id); // Set the editedRow to the current row id
        setEditedReason(row.reason);
        setEditedEvidence(null);
    };

    const handleSaveEdit = () => {
        if (!editedReason.trim() || !editedEvidence) {
            alert('El motivo y la evidencia son obligatorios.');
            return;
        }

        setCheques((prev) =>
            prev.map((cheque) =>
                cheque.id === editedRow
                    ? { ...cheque, reason: editedReason, evidence: editedEvidence }
                    : cheque
            )
        );

        setEditedRow(null);  // Reset editedRow after saving
    };

    // Define handleChangePage function
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Define handleChangeRowsPerPage function
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when the rows per page change
    };

    const handleExportCSV = () => {
        const selectedData = cheques.filter((cheque) => selectedRows.includes(cheque.id));
        const ws = XLSX.utils.json_to_sheet(selectedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cheques");
        XLSX.writeFile(wb, "cheques_reposicion.csv");
    };

    const handleExportExcel = () => {
        const selectedData = cheques.filter((cheque) => selectedRows.includes(cheque.id));
        const ws = XLSX.utils.json_to_sheet(selectedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cheques");
        XLSX.writeFile(wb, "cheques_reposicion.xlsx");
    };

    const handleExportPDF = () => {
        const selectedData = cheques.filter((cheque) => selectedRows.includes(cheque.id));
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Listado de Cheques", 20, 20);

        const headers = [
            'ID', 'Nombre', 'Monto', 'Tipo de Nómina', 'Folio Cheque', 'Folio Póliza', 'Quincena', 'Año'
        ];
        let yOffset = 30;
        doc.setFontSize(12);
        doc.text(headers.join(' | '), 20, yOffset);

        selectedData.forEach((cheque, index) => {
            yOffset += 10;
            const row = [
                cheque.id,
                cheque.employeeName,
                cheque.amount,
                cheque.payrollType,
                cheque.chequeFolio,
                cheque.policyFolio,
                cheque.fortnight,
                cheque.year
            ];
            doc.text(row.join(' | '), 20, yOffset);
        });

        doc.save("cheques_reposicion.pdf");
    };

    return (
        <Box className={styles.container}>
        <Typography variant="h4" className={styles.title}>Reposición de Cheques</Typography>
    
        {/* Botones de exportación */}
        <Box className={styles['buttons-container']}>
            <Button 
                variant="contained" 
                color="primary" 
                className={styles.button}
                onClick={handleExportCSV}
            >
                Exportar a CSV
            </Button>
            <Button 
                variant="contained" 
                color="primary" 
                className={styles.button}
                onClick={handleExportExcel}
            >
                Exportar a Excel
            </Button>
            <Button 
                variant="contained" 
                color="primary" 
                className={styles.button}
                onClick={handleExportPDF}
            >
                Exportar a PDF
            </Button>
        </Box>
    
        <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: '20px' }}
            onClick={() => {
                console.log("Ruta a donde se enviarán los cheques seleccionados:", selectedRows);
            }}
        >
            Generar Cheques 
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedRows.length > 0 && selectedRows.length < cheques.length}
                                    checked={selectedRows.length === cheques.length}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedRows(cheques.map((cheque) => cheque.id));
                                        } else {
                                            setSelectedRows([]);
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Monto</TableCell>
                            <TableCell>Tipo de Nómina</TableCell>
                            <TableCell>Folio Cheque</TableCell>
                            <TableCell>Folio Póliza</TableCell>
                            <TableCell>Quincena</TableCell>
                            <TableCell>Año</TableCell>
                            <TableCell>Motivo</TableCell>
                            <TableCell>Evidencia</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cheques
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((cheque) => (
                                <TableRow key={cheque.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedRows.includes(cheque.id)}
                                            onChange={() => handleCheckboxChange(cheque.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{cheque.id}</TableCell>
                                    <TableCell>{cheque.employeeName}</TableCell>
                                    <TableCell>{cheque.amount}</TableCell>
                                    <TableCell>{cheque.payrollType}</TableCell>
                                    <TableCell>{cheque.chequeFolio}</TableCell>
                                    <TableCell>{cheque.policyFolio}</TableCell>
                                    <TableCell>{cheque.fortnight}</TableCell>
                                    <TableCell>{cheque.year}</TableCell>
                                    <TableCell>
                                        {editedRow === cheque.id ? (
                                            <TextField
                                                value={editedReason}
                                                onChange={(e) => setEditedReason(e.target.value)}
                                                fullWidth
                                                size="small"
                                                multiline
                                                rows={1}
                                                placeholder="Ingrese el motivo"
                                            />
                                        ) : (
                                            cheque.reason || '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editedRow === cheque.id ? (
                                            <input
                                                type="file"
                                                onChange={(e) => setEditedEvidence(e.target.files[0])}
                                            />
                                        ) : (
                                            cheque.evidence ? cheque.evidence.name : '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEditStart(cheque)}>
                                            <Edit />
                                        </IconButton>
                                        {editedRow === cheque.id && (
                                            <IconButton color="primary" onClick={handleSaveEdit} style={{ marginLeft: '8px' }}>
                                                <Save />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    count={cheques.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage} // Aquí se llama a la función definida
                />
            </TableContainer>
        </Box>
    );
}
