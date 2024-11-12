// src/components/CambioRolModal.js
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
    Select,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const rolesDisponibles = ['Administrador', 'Revisor', 'Usuario', 'Gerente'];
const permisosPorRol = {
    Administrador: ['Calendario', 'Reportes de Nómina', 'Cheques', 'Gestión de Usuarios'],
    Revisor: ['Calendario', 'Reportes de Nómina'],
    Usuario: ['Calendario'],
    Gerente: ['Calendario', 'Reportes de Nómina', 'Cheques']
};

export default function CambioRolModal({ open, onClose, usuario, onRoleChange }) {
    const [nuevoRol, setNuevoRol] = useState(usuario?.rol || '');
    const [permisos, setPermisos] = useState(permisosPorRol[usuario?.rol] || []);

    const handleRoleChange = () => {
        onRoleChange(nuevoRol);
        onClose();
    };

    const handleAgregarRol = () => {
        setPermisos(permisosPorRol[nuevoRol] || []);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs">
            <DialogTitle>
                <Typography variant="h6" style={{ color: '#8B2635' }}>Cambio de Rol de Empleado</Typography>
                <IconButton onClick={onClose} style={{ position: 'absolute', right: 8, top: 8, color: '#8B2635' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                    Nombre del Empleado: <strong>{usuario?.nombre || 'N/A'}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '1rem' }}>
                    Rol Actual: <strong>{usuario?.rol || 'N/A'}</strong>
                </Typography>
                
                <Typography variant="body2" style={{ marginBottom: '0.5rem' }}>
                    Cambiar Rol:
                </Typography>
                <Select
                    fullWidth
                    value={nuevoRol}
                    onChange={(e) => {
                        setNuevoRol(e.target.value);
                        setPermisos(permisosPorRol[e.target.value] || []);
                    }}
                    style={{ marginBottom: '1rem' }}
                >
                    {rolesDisponibles.map((rol) => (
                        <MenuItem key={rol} value={rol}>
                            {rol}
                        </MenuItem>
                    ))}
                </Select>
                
                <Typography variant="subtitle1" style={{ color: '#8B2635' }}>Control de Acceso</Typography>
                <ul>
                    {permisos.map((permiso, index) => (
                        <li key={index} style={{ marginLeft: '1rem', listStyleType: 'disc' }}>{permiso}</li>
                    ))}
                </ul>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center' }}>
                <Button onClick={handleRoleChange} variant="contained" style={{ backgroundColor: '#8B2635', color: 'white', marginRight: '1rem' }}>
                    Cambiar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
