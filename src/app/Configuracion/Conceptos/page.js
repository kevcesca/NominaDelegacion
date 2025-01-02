'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL from '../../%Config/apiConfig';
import ReusableTable from '../../%Components/ReusableTable/ReusableTable'; // Importamos el componente reutilizable
import styles from './page.module.css';

export default function ConceptosTable() {
  const [conceptos, setConceptos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newConcepto, setNewConcepto] = useState({ id_concepto: '', nombre_concepto: '' });
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
  const [successDialog, setSuccessDialog] = useState({ open: false, message: '' });
  const [deleteConceptoDialog, setDeleteConceptoDialog] = useState(false);
  const [conceptoToDelete, setConceptoToDelete] = useState(null);

  useEffect(() => {
    fetchConceptos();
  }, []);

  const fetchConceptos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cat/conceptos`);
      setConceptos(response.data);
    } catch (error) {
      console.error('Error al cargar los conceptos:', error);
    }
  };

  const handleAddStart = () => {
    setNewConcepto({ id_concepto: '', nombre_concepto: '' });
    setIsAdding(true);
  };

  const handleSaveAdd = async () => {
    const { id_concepto, nombre_concepto } = newConcepto;

    if (id_concepto.trim() === '' || nombre_concepto.trim() === '') {
      setErrorDialog({ open: true, message: 'Por favor, completa todos los campos antes de guardar.' });
      return;
    }

    try {
      await axios.get(`${API_BASE_URL}/insertarConcepto`, { params: { id_concepto, nombre_concepto } });
      setConceptos((prevConceptos) => [{ id_concepto, nombre_concepto }, ...prevConceptos]);
      setIsAdding(false);
      setSuccessDialog({ open: true, message: 'Concepto creado exitosamente.' });
    } catch (error) {
      console.error('Error al crear el concepto:', error);
      setErrorDialog({ open: true, message: 'Error al crear el concepto. Verifique que el ID no esté duplicado.' });
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleEditConcepto = async (editedRow) => {
    if (editedRow.nombre_concepto.trim() === '') {
      setErrorDialog({ open: true, message: 'El nombre del concepto no puede estar vacío.' });
      return;
    }

    try {
      await axios.get(`${API_BASE_URL}/actualizarConcepto`, {
        params: { id_concepto: editedRow.id_concepto, nombre_concepto: editedRow.nombre_concepto },
      });
      setConceptos((prevConceptos) =>
        prevConceptos.map((row) =>
          row.id_concepto === editedRow.id_concepto ? editedRow : row
        )
      );
      setSuccessDialog({ open: true, message: 'Concepto actualizado exitosamente.' });
    } catch (error) {
      console.error('Error al actualizar el concepto:', error);
      setErrorDialog({ open: true, message: 'Error al actualizar el concepto.' });
    }
  };

  const handleDeleteConcepto = async () => {
    try {
      await axios.get(`${API_BASE_URL}/eliminarConcepto`, {
        params: { id_concepto: conceptoToDelete.id_concepto },
      });
      setConceptos((prevConceptos) =>
        prevConceptos.filter((row) => row.id_concepto !== conceptoToDelete.id_concepto)
      );
      setDeleteConceptoDialog(false);
      setSuccessDialog({ open: true, message: 'Concepto eliminado exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar el concepto:', error);
      setErrorDialog({ open: true, message: 'Error al eliminar el concepto.' });
    }
  };

  const columns = [
    { label: 'ID Concepto', accessor: 'id_concepto' },
    { label: 'Nombre Concepto', accessor: 'nombre_concepto' },
  ];

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
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {!isAdding && (
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddStart}>
            Crear Concepto
          </Button>
        )}
      </Box>

      {isAdding && (
        <Box display="flex" mb={2} gap={2}>
          <TextField
            label="ID Concepto"
            value={newConcepto.id_concepto}
            onChange={(e) => setNewConcepto({ ...newConcepto, id_concepto: e.target.value })}
            size="small"
          />
          <TextField
            label="Nombre Concepto"
            value={newConcepto.nombre_concepto}
            onChange={(e) => setNewConcepto({ ...newConcepto, nombre_concepto: e.target.value })}
            size="small"
          />
          <Button variant="contained" color="primary" onClick={handleSaveAdd}>
            Guardar
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancelAdd}>
            Cancelar
          </Button>
        </Box>
      )}

      <ReusableTable
        columns={columns}
        data={conceptos.filter(
          (row) =>
            row.id_concepto.toString().includes(searchQuery) ||
            row.nombre_concepto.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        editable
        deletable
        onEdit={handleEditConcepto}
        onDelete={(row) => {
          setConceptoToDelete(row);
          setDeleteConceptoDialog(true);
        }}
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
      <Dialog open={deleteConceptoDialog} onClose={() => setDeleteConceptoDialog(false)}>
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
