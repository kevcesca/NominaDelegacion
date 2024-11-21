'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  TextField,
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Edit, Save, Delete, Add } from '@mui/icons-material';
import API_BASE_URL from '../../%Config/apiConfig';
import styles from './page.module.css';

export default function ConceptosTable() {
  const [conceptos, setConceptos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editedRow, setEditedRow] = useState(null); // ID de la fila en modo edición
  const [editedValue, setEditedValue] = useState(''); // Valor editado
  const [isAdding, setIsAdding] = useState(false); // Estado para saber si estamos añadiendo un concepto
  const [newConcepto, setNewConcepto] = useState({ id_concepto: '', nombre_concepto: '' }); // Datos del nuevo concepto
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Modales
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
  const [successDialog, setSuccessDialog] = useState({ open: false, message: '' });
  const [deleteConceptoDialog, setDeleteConceptoDialog] = useState(false);
  const [conceptoToDelete, setConceptoToDelete] = useState(null);

  // Obtener los datos de la API al cargar el componente
  const fetchConceptos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cat/conceptos`);
      setConceptos(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error al cargar los conceptos:', error);
    }
  };

  useEffect(() => {
    fetchConceptos();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      conceptos.filter(
        (concepto) =>
          concepto.id_concepto.toString().includes(query) ||
          concepto.nombre_concepto.toLowerCase().includes(query)
      )
    );
  };

  const handleAddStart = () => {
    setNewConcepto({ id_concepto: '', nombre_concepto: '' });
    setIsAdding(true);
  };

  const handleSaveAdd = () => {
    const { id_concepto, nombre_concepto } = newConcepto;

    if (id_concepto.trim() === '' || nombre_concepto.trim() === '') {
      setErrorDialog({ open: true, message: 'Por favor, completa todos los campos antes de guardar.' });
      return;
    }

    axios
      .get(`${API_BASE_URL}/insertarConcepto`, {
        params: { id_concepto, nombre_concepto },
      })
      .then(() => {
        const updatedConceptos = [{ id_concepto, nombre_concepto }, ...conceptos];
        setConceptos(updatedConceptos);
        setFilteredData(updatedConceptos);
        setIsAdding(false);
        setSuccessDialog({ open: true, message: 'Concepto creado exitosamente.' });
      })
      .catch((error) => {
        console.error('Error al crear el concepto:', error);
        setErrorDialog({ open: true, message: 'Error al crear el concepto. Verifique que el ID no esté duplicado.' });
      });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleEditStart = (concepto) => {
    setEditedRow(concepto.id_concepto);
    setEditedValue(concepto.nombre_concepto);
  };

  const handleSaveEdit = (concepto) => {
    if (editedValue.trim() === '') {
      setErrorDialog({ open: true, message: 'El nombre del concepto no puede estar vacío.' });
      return;
    }

    axios
      .get(`${API_BASE_URL}/actualizarConcepto`, {
        params: { id_concepto: concepto.id_concepto, nombre_concepto: editedValue },
      })
      .then(() => {
        setConceptos((prevConceptos) =>
          prevConceptos.map((row) =>
            row.id_concepto === concepto.id_concepto
              ? { ...row, nombre_concepto: editedValue }
              : row
          )
        );
        setFilteredData((prevFilteredData) =>
          prevFilteredData.map((row) =>
            row.id_concepto === concepto.id_concepto
              ? { ...row, nombre_concepto: editedValue }
              : row
          )
        );
        setEditedRow(null);
        setSuccessDialog({ open: true, message: 'Concepto actualizado exitosamente.' });
      })
      .catch((error) => {
        console.error('Error al actualizar el concepto:', error);
        setErrorDialog({ open: true, message: 'Error al actualizar el concepto.' });
      });
  };

  const handleDeleteConcepto = () => {
    axios
      .get(`${API_BASE_URL}/eliminarConcepto`, {
        params: { id_concepto: conceptoToDelete.id_concepto },
      })
      .then(() => {
        const updatedConceptos = conceptos.filter(
          (row) => row.id_concepto !== conceptoToDelete.id_concepto
        );
        setConceptos(updatedConceptos);
        setFilteredData(updatedConceptos);
        setDeleteConceptoDialog(false);
        setSuccessDialog({ open: true, message: 'Concepto eliminado exitosamente.' });
      })
      .catch((error) => {
        console.error('Error al eliminar el concepto:', error);
        setErrorDialog({ open: true, message: 'Error al eliminar el concepto.' });
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Gestión de Conceptos
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Buscar en la tabla..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
        />
        {!isAdding && (
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddStart}>
            Crear Concepto
          </Button>
        )}
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Concepto</TableCell>
              <TableCell>Nombre Concepto</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isAdding && (
              <TableRow>
                <TableCell>
                  <TextField
                    value={newConcepto.id_concepto}
                    onChange={(e) => setNewConcepto({ ...newConcepto, id_concepto: e.target.value })}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newConcepto.nombre_concepto}
                    onChange={(e) =>
                      setNewConcepto({ ...newConcepto, nombre_concepto: e.target.value })
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={handleSaveAdd}>
                    <Save />
                  </IconButton>
                  <IconButton color="secondary" onClick={handleCancelAdd}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((concepto) => (
                <TableRow key={concepto.id_concepto}>
                  <TableCell>{concepto.id_concepto}</TableCell>
                  <TableCell>
                    {editedRow === concepto.id_concepto ? (
                      <TextField
                        value={editedValue}
                        onChange={(e) => setEditedValue(e.target.value)}
                        fullWidth
                        size="small"
                      />
                    ) : (
                      concepto.nombre_concepto
                    )}
                  </TableCell>
                  <TableCell>
                    {editedRow === concepto.id_concepto ? (
                      <IconButton color="primary" onClick={() => handleSaveEdit(concepto)}>
                        <Save />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="primary"
                        onClick={() => handleEditStart(concepto)}
                      >
                        <Edit />
                      </IconButton>
                    )}
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setConceptoToDelete(concepto);
                        setDeleteConceptoDialog(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Modal de error */}
      <Dialog open={errorDialog.open} onClose={() => setErrorDialog({ open: false, message: '' })}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog({ open: false, message: '' })} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de éxito */}
      <Dialog open={successDialog.open} onClose={() => setSuccessDialog({ open: false, message: '' })}>
        <DialogTitle>Éxito</DialogTitle>
        <DialogContent>
          <DialogContentText>{successDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialog({ open: false, message: '' })} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación para eliminar */}
      <Dialog
        open={deleteConceptoDialog}
        onClose={() => setDeleteConceptoDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el concepto "{conceptoToDelete?.id_concepto}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConceptoDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConcepto} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
