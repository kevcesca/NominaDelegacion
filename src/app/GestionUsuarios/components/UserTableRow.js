import React, { useState } from 'react';
import { TextField, Button, IconButton, Tooltip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignRolesModal from './AssignRolesModal';
import styles from '../page.module.css';

const UserTableRow = ({
    user,
    isEditing,
    editedFields,
    onDoubleClick,
    onInputChange,
    onConfirmEdit,
    onMenuOpen,
    onRolesUpdated,
    isSelected,
    onToggleSelect,
}) => {
    const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);

    const handleOpenRolesModal = () => {
        setIsRolesModalOpen(true);
    };

    const handleCloseRolesModal = () => {
        setIsRolesModalOpen(false);
    };

    return (
        <>
            <tr className={!user.Activo ? styles.disabledRow : ''}>
                {/* Checkbox para seleccionar al usuario */}
                <td>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onToggleSelect}
                    />
                </td>

                <td>{user['ID Empleado']}</td>
                <td>{user['Nombre Empleado']}</td>

                {/* Campo editable: Nombre de Usuario */}
                <td onDoubleClick={() => onDoubleClick(user, 'Nombre de Usuario')}>
                    {isEditing ? (
                        <TextField
                            variant="outlined"
                            size="small"
                            value={
                                editedFields['Nombre de Usuario'] !== undefined
                                    ? editedFields['Nombre de Usuario']
                                    : user['Nombre de Usuario']
                            }
                            onChange={(e) => onInputChange('Nombre de Usuario', e.target.value)}
                            className={styles.editableField}
                        />
                    ) : (
                        user['Nombre de Usuario']
                    )}
                </td>

                {/* Campo editable: Email */}
                <td onDoubleClick={() => onDoubleClick(user, 'Email')}>
                    {isEditing ? (
                        <TextField
                            variant="outlined"
                            size="small"
                            value={
                                editedFields.Email !== undefined
                                    ? editedFields.Email
                                    : user.Email
                            }
                            onChange={(e) => onInputChange('Email', e.target.value)}
                            className={styles.editableField}
                        />
                    ) : (
                        user.Email
                    )}
                </td>

                {/* Roles */}
                <td>{user.Rol}</td>

                {/* Botón de "Editar roles" */}
                <td>
                    <Tooltip title="Editar roles">
                        <IconButton onClick={handleOpenRolesModal}>
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </td>
                <td>{new Date(user['Fecha de Alta']).toLocaleDateString()}</td>
                <td>{user.Asignó}</td>



                {/* Opciones */}
                <td>
                    {isEditing ? (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={onConfirmEdit} // Llamar la función del padre
                            className={styles.confirmButton}
                        >
                            Confirmar
                        </Button>
                    ) : (
                        <IconButton onClick={(e) => onMenuOpen(e, user)} aria-label="opciones">
                            <MoreVertIcon />
                        </IconButton>
                    )}
                </td>
            </tr>

            {/* Modal de roles */}
            <AssignRolesModal
                isOpen={isRolesModalOpen}
                onClose={handleCloseRolesModal}
                user={user}
                onRolesUpdated={(newRoles) => {
                    onRolesUpdated(user['ID Empleado'], newRoles);
                }}
            />
        </>
    );
};

export default UserTableRow;
