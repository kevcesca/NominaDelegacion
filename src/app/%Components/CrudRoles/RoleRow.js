import React from 'react';
import { Checkbox, IconButton, Tooltip, TextField, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styles from './CrudRoles.module.css';

const RoleRow = ({
    role,
    isSelected,
    onToggleRole,
    setRoles,
    editingRoleId,
    setEditingRoleId,
    editValues,
    setEditValues,
    updateRole,
    onOpenModal,
}) => {
    const startEditing = () => {
        setEditingRoleId(role.id);
        setEditValues({ name: role.name, description: role.description });
    };

    const cancelEditing = () => {
        setEditingRoleId(null);
        setEditValues({ name: '', description: '' });
    };

    const saveEditing = () => {
        setRoles((prevRoles) =>
            prevRoles.map((r) =>
                r.id === role.id
                    ? { ...r, name: editValues.name, description: editValues.description }
                    : r
            )
        );
        updateRole(role.id, {
            nombre_rol: editValues.name,
            descripcion_rol: editValues.description,
        });
        setEditingRoleId(null);
    };

    return (
        <tr>
            <td>
                <Checkbox checked={isSelected} onChange={onToggleRole} />
            </td>
            <td>{role.id}</td>
            <td onDoubleClick={startEditing}>
                {editingRoleId === role.id ? (
                    <TextField
                        variant="outlined"
                        size="small"
                        value={editValues.name}
                        onChange={(e) =>
                            setEditValues((prev) => ({ ...prev, name: e.target.value }))
                        }
                        autoFocus
                    />
                ) : (
                    role.name
                )}
            </td>
            <td onDoubleClick={startEditing}>
                {editingRoleId === role.id ? (
                    <TextField
                        variant="outlined"
                        size="small"
                        value={editValues.description}
                        onChange={(e) =>
                            setEditValues((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />
                ) : (
                    role.description
                )}
            </td>
            <td>
                <div className={styles.permissionsCell}>
                    <span>{role.permissions.join(', ') || 'Sin permisos'}</span>
                    <Tooltip title="Editar permisos">
                        <IconButton
                            className={styles.addPermissionButton}
                            onClick={() => onOpenModal(role)}
                        >
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </td>
            {editingRoleId === role.id && (
                <td>
                    <div className={styles.botonesAceptCancel}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={saveEditing}
                            className={styles.buttonSave}
                        >
                            Guardar
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={cancelEditing}
                            className={styles.buttonCancel}
                        >
                            Cancelar
                        </Button>
                    </div>
                </td>
            )}
        </tr>
    );
};

export default RoleRow;
