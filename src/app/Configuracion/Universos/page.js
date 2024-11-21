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
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Edit, Delete, Save, Add } from '@mui/icons-material';
import API_BASE_URL from '../../%Config/apiConfig';
import styles from './page.module.css';

export default function UniversosTable() {
  const [universos, setUniversos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEditing, setIsEditing] = useState(null);
  const [editCache, setEditCache] = useState({});
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
  const [successDialog, setSuccessDialog] = useState({ open: false, message: '' });
  const [deleteUniversoDialog, setDeleteUniversoDialog] = useState(false);
  const [universoToDelete, setUniversoToDelete] = useState(null);
  const nominaOptions = ['BASE', 'ESTRUCTURA', 'NOMINA 8', 'HONORARIOS'];

  // Obtener los datos de la API al cargar el componente
  const fetchUniversos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cat/universos`);
      setUniversos(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error al cargar los universos:', error);
    }
  };

  useEffect(() => {
    fetchUniversos();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      universos.filter(
        (universo) =>
          universo.id_universo.toLowerCase().includes(query) ||
          universo.nombre_nomina.toLowerCase().includes(query)
      )
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    setIsEditing(id);
    const universoToEdit = universos.find((universo) => universo.id_universo === id);
    setEditCache({ ...universoToEdit });
  };

  const handleSave = async (oldId) => {
    try {
      const editedUniverso = { ...editCache };

      if (!editedUniverso.nombre_nomina || (oldId === null && !editedUniverso.id_universo)) {
        setErrorDialog({
          open: true,
          message: 'Por favor, rellena todos los campos antes de guardar.',
        });
        return;
      }

      if (oldId === null) {
        // Crear un nuevo universo
        await axios.get(`${API_BASE_URL}/insertarUniverso`, {
          params: {
            id_universo: editedUniverso.id_universo,
            nombre_nomina: editedUniverso.nombre_nomina,
          },
        });
        setSuccessDialog({ open: true, message: 'Universo creado correctamente.' });
      } else {
        // Actualizar universo existente
        await axios.get(`${API_BASE_URL}/actualizarUniverso`, {
          params: {
            id_universo: editedUniverso.id_universo,
            nombre_nomina: editedUniverso.nombre_nomina,
          },
        });
        setSuccessDialog({ open: true, message: 'Universo actualizado correctamente.' });
      }

      // Refrescar el componente para actualizar los datos
      await fetchUniversos();

      setIsEditing(null);
      setEditCache({});
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      setErrorDialog({
        open: true,
        message: oldId === null ? 'Error al crear el universo.' : 'Error al actualizar el universo.',
      });
    }
  };

  const handleRowChange = (field, value) => {
    setEditCache((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddUniverso = () => {
    const newUniverso = { id_universo: '', nombre_nomina: '' };
    setUniversos((prev) => [newUniverso, ...prev]);
    setFilteredData((prev) => [newUniverso, ...prev]);
    setIsEditing(newUniverso.id_universo);
    setEditCache(newUniverso);
  };

  const confirmDeleteUniverso = (universo) => {
    setUniversoToDelete(universo);
    setDeleteUniversoDialog(true);
  };

  const handleDeleteUniverso = async () => {
    try {
      await axios.get(`${API_BASE_URL}/eliminarUniverso`, {
        params: {
          id_universo: universoToDelete.id_universo,
        },
      });

      const updatedUniversos = universos.filter(
        (universo) => universo.id_universo !== universoToDelete.id_universo
      );
      setUniversos(updatedUniversos);
      setFilteredData(updatedUniversos);

      setSuccessDialog({ open: true, message: 'Universo eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar el universo:', error);
      setErrorDialog({
        open: true,
        message: 'Error al eliminar el universo. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setDeleteUniversoDialog(false);
      setUniversoToDelete(null);
    }
  };

  const closeSuccessDialog = () => setSuccessDialog({ open: false, message: '' });
  const closeErrorDialog = () => setErrorDialog({ open: false, message: '' });

  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Gestión de Universos
      </Typography>
      <Box className={styles.actions} display="flex" justifyContent="space-between">
        <TextField
          label="Buscar en la tabla..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchBar}
        />
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddUniverso}>
          Crear Universo
        </Button>
      </Box>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Identificador Universo</TableCell>
              <TableCell>Nombre Nómina</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((universo) => (
                <TableRow key={universo.id_universo || 'new'}>
                  <TableCell>
                    {isEditing === universo.id_universo && !universo.id_universo ? (
                      <TextField
                        value={editCache.id_universo}
                        onChange={(e) => handleRowChange('id_universo', e.target.value)}
                      />
                    ) : (
                      universo.id_universo
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing === universo.id_universo ? (
                      <Select
                        value={editCache.nombre_nomina}
                        onChange={(e) => handleRowChange('nombre_nomina', e.target.value)}
                      >
                        {nominaOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      universo.nombre_nomina
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing === universo.id_universo ? (
                      <IconButton
                        color="primary"
                        onClick={() => handleSave(universo.id_universo || null)}
                      >
                        <Save />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(universo.id_universo)}
                      >
                        <Edit />
                      </IconButton>
                    )}
                    <IconButton
                      color="secondary"
                      onClick={() => confirmDeleteUniverso(universo)}
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
        className={styles.pagination}
      />

      <Dialog open={successDialog.open} onClose={closeSuccessDialog}>
        <DialogTitle>Éxito</DialogTitle>
        <DialogContent>
          <DialogContentText>{successDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSuccessDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={errorDialog.open} onClose={closeErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeErrorDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteUniversoDialog} onClose={() => setDeleteUniversoDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el universo "{universoToDelete?.id_universo}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUniversoDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteUniverso} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
