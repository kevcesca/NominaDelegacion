"use client";
import { useState } from 'react';
import styles from '../Reposicion/page.module.css';
import { Box, Typography, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Checkbox } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';
import Save from '@mui/icons-material/Save';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

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
    const [editedRow, setEditedRow] = useState(null);
    const [editedReason, setEditedReason] = useState('');
    const [editedEvidence, setEditedEvidence] = useState(null);
    const [successDialog, setSuccessDialog] = useState({ open: false, message: '' });
    const [selectedRows, setSelectedRows] = useState([]);

    const handleEditStart = (row) => {
        setEditedRow(row.id);
        setEditedReason(row.reason);
        setEditedEvidence(null);
    };

    const handleSaveEdit = () => {
        if (!editedReason.trim() || !editedEvidence) {
            setSuccessDialog({ open: true, message: 'El motivo y la evidencia son obligatorios.' });
            return;
        }

        setCheques((prev) =>
            prev.map((cheque) =>
                cheque.id === editedRow
                    ? { ...cheque, reason: editedReason, evidence: editedEvidence }
                    : cheque
            )
        );

        setEditedRow(null);
        setSuccessDialog({ open: true, message: 'Datos actualizados correctamente.' });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCheckboxChange = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    return (
        <Box className={styles.container}>
            <Typography variant="h4" className={styles.title}>
                Reposición de Cheques
            </Typography>
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
                                    indeterminate={
                                        selectedRows.length > 0 && selectedRows.length < cheques.length
                                    }
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
                                                required
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
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={cheques.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Modal de éxito */}
            <Dialog
                open={successDialog.open}
                onClose={() => setSuccessDialog({ open: false, message: '' })}
            >
                <DialogTitle>Éxito</DialogTitle>
                <DialogContent>
                    <DialogContentText>{successDialog.message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setSuccessDialog({ open: false, message: '' })}
                        color="primary"
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
