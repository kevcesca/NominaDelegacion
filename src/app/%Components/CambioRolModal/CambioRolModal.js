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
    Checkbox,
    FormControlLabel,
    Menu,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import styles from './CambioRolModal.module.css'; // Importar el archivo CSS

const rolesDisponibles = ['Administrador', 'Revisor', 'Usuario', 'Gerente'];
const permisosPorRol = {
    Administrador: ['Calendario', 'Reportes de Nómina', 'Cheques', 'Gestión de Usuarios'],
    Revisor: ['Calendario', 'Reportes de Nómina'],
    Usuario: ['Calendario'],
    Gerente: ['Calendario', 'Reportes de Nómina', 'Cheques']
};

export default function CambioRolModal({ open, onClose, usuario, onRoleChange }) {
    const [rolesSeleccionados, setRolesSeleccionados] = useState(usuario?.roles || []);
    const [permisos, setPermisos] = useState(
        usuario?.roles?.flatMap((rol) => permisosPorRol[rol]) || []
    );
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);

    const actualizarPermisos = (roles) => {
        const nuevosPermisos = roles.flatMap((rol) => permisosPorRol[rol] || []);
        setPermisos([...new Set(nuevosPermisos)]);
    };

    const handleRoleToggle = (rol) => {
        if (rolesSeleccionados.includes(rol)) {
            if (window.confirm(`¿Deseas eliminar el rol de ${rol}?`)) {
                const nuevosRoles = rolesSeleccionados.filter((r) => r !== rol);
                setRolesSeleccionados(nuevosRoles);
                actualizarPermisos(nuevosRoles);
            }
        } else {
            const nuevosRoles = [...rolesSeleccionados, rol];
            setRolesSeleccionados(nuevosRoles);
            actualizarPermisos(nuevosRoles);
        }
    };

    const handleRoleChange = () => {
        onRoleChange(rolesSeleccionados);
        onClose();
    };

    const handleOpenMenu = (event, rol) => {
        setMenuAnchorEl(event.currentTarget);
        setRolSeleccionado(rol);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
        setRolSeleccionado(null);
    };

    const handleModifyPermissions = () => {
        alert(`Modificar permisos para el rol: ${rolSeleccionado}`);
        handleCloseMenu();
    };

    const handleSettingsClick = () => {
        alert("Configuración de roles y permisos");
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth> {/* maxWidth sm para tamaño medio */}
            <DialogTitle className={styles.modalTitle}>
                <Typography variant="h6" className={styles.titleText}>Cambio de Rol de Empleado</Typography>
                
                <div>
                    <IconButton onClick={handleSettingsClick} className={styles.iconButton}>
                        <SettingsSuggestIcon fontSize="medium" />
                    </IconButton>
                    <IconButton onClick={onClose} className={`${styles.iconButton} ${styles.closeButton}`}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent className={styles.content}>
                <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                    Nombre del Empleado: <strong>{usuario?.nombre || 'N/A'}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '1rem' }}>
                    Roles Actuales: <strong>{rolesSeleccionados.join(', ') || 'N/A'}</strong>
                </Typography>
                
                <Typography variant="body2" style={{ marginBottom: '0.5rem' }}>
                    Cambiar Roles:
                </Typography>

                <div className={styles.gridContainer}> {/* Aplica la clase para la cuadrícula */}
                    {rolesDisponibles.map((rol) => (
                        <div key={rol} style={{ display: 'flex', alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rolesSeleccionados.includes(rol)}
                                        onChange={() => handleRoleToggle(rol)}
                                        color="primary"
                                    />
                                }
                                label={rol}
                                style={{ marginRight: '0.5rem' }}
                            />
                            <IconButton
                                onClick={(event) => handleOpenMenu(event, rol)}
                                edge="end"
                                aria-label="more-options"
                            >
                                <MoreVertIcon />
                            </IconButton>
                        </div>
                    ))}
                </div>
                
                <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={handleModifyPermissions}>Modificar permisos</MenuItem>
                </Menu>

                <Typography className={styles.accessControl}>Control de Acceso</Typography>
                <ul className={styles.permissionsList}>
                    {permisos.map((permiso, index) => (
                        <li key={index}>{permiso}</li>
                    ))}
                </ul>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center' }}>
                <Button onClick={handleRoleChange} className={styles.changeButton}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
