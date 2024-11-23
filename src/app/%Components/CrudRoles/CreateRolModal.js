import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Checkbox,
    Grid,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
} from '@mui/material';
import { API_USERS_URL } from '../../%Config/apiConfig';

const CreateRoleModal = ({ isOpen, onClose, onRoleCreated }) => {
    const [permissions, setPermissions] = useState([]); // Todos los permisos disponibles
    const [selectedPermissions, setSelectedPermissions] = useState([]); // IDs de los permisos seleccionados
    const [searchTerm, setSearchTerm] = useState(''); // Texto de búsqueda
    const [roleData, setRoleData] = useState({ name: '', description: '' }); // Datos del nuevo rol

    // Cargar permisos disponibles al abrir el modal
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await fetch(`${API_USERS_URL}/permissions`, {
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Error al obtener permisos');
                const data = await response.json();
                setPermissions(data);
            } catch (error) {
                console.error('Error al cargar permisos:', error);
            }
        };

        if (isOpen) {
            fetchPermissions();
        }
    }, [isOpen]);

    // Manejar selección de permisos
    const handleTogglePermission = (permissionId) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId) // Deseleccionar
                : [...prev, permissionId] // Seleccionar
        );
    };

    // Manejar el cambio en los inputs del nombre y descripción del rol
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoleData((prev) => ({ ...prev, [name]: value }));
    };

    // Guardar el nuevo rol
    const handleSave = async () => {
        if (!roleData.name || !roleData.description || selectedPermissions.length === 0) {
            alert('Por favor completa todos los campos y selecciona al menos un permiso.');
            return;
        }

        try {
            const response = await fetch(`${API_USERS_URL}/roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre_rol: roleData.name,
                    descripcion_rol: roleData.description,
                    permisos: selectedPermissions,
                }),
            });

            if (!response.ok) throw new Error('Error al crear el rol');

            const newRole = await response.json();
            onRoleCreated(newRole.data); // Notificar al componente principal
            onClose(); // Cerrar el modal
        } catch (error) {
            console.error('Error al crear el rol:', error);
        }
    };

    const filteredPermissions = permissions.filter(
        (permission) =>
            permission.acceso.toLowerCase().includes(searchTerm.toLowerCase()) ||
            permission.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Crear Nuevo Rol</DialogTitle>
            <DialogContent>
                {/* Inputs para nombre y descripción */}
                <TextField
                    label="Nombre del Rol"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="name"
                    value={roleData.name}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Descripción del Rol"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="description"
                    value={roleData.description}
                    onChange={handleInputChange}
                />

                {/* Barra de búsqueda */}
                <TextField
                    label="Buscar permisos"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Lista de permisos */}
                <Grid container spacing={2}>
                    {filteredPermissions.map((permission) => (
                        <Grid item xs={12} sm={6} md={4} key={permission.permiso_id}>
                            <ListItem
                                button
                                onClick={() => handleTogglePermission(permission.permiso_id)}
                                style={{ padding: '8px 16px' }}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={selectedPermissions.includes(permission.permiso_id)}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={permission.acceso}
                                    secondary={permission.descripcion}
                                    style={{
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        whiteSpace: 'normal',
                                    }}
                                />
                            </ListItem>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleSave} color="primary">
                    Crear Rol
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateRoleModal;


