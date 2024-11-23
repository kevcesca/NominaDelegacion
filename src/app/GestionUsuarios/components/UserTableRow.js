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
    onRolesUpdated, // Nueva prop para manejar la actualización de roles
}) => {
    const [isRolesModalOpen, setIsRolesModalOpen] = useState(false); // Estado local para el modal de roles

    // Método para manejar la apertura del modal
    const handleOpenRolesModal = () => {
        console.log('Abriendo modal de roles...'); // Depuración
        setIsRolesModalOpen(true);
    };

    // Método para manejar el cierre del modal
    const handleCloseRolesModal = () => {
        console.log('Cerrando modal de roles...'); // Depuración
        setIsRolesModalOpen(false);
    };

    return (
        <>
            <tr className={!user.Activo ? styles.disabledRow : ''}>
                <td>{user['ID Empleado']}</td>
                <td>{user['Nombre Empleado']}</td>

                {/* Campo editable: Nombre de Usuario */}
                <td onDoubleClick={() => onDoubleClick(user, 'Nombre de Usuario')}>
                    {isEditing ? (
                        <TextField
                            variant="outlined"
                            size="small"
                            value={editedFields['Nombre de Usuario'] || ''}
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
                            value={editedFields.Email || ''}
                            onChange={(e) => onInputChange('Email', e.target.value)}
                            className={styles.editableField}
                        />
                    ) : (
                        user.Email
                    )}
                </td>

                {/* Roles */}
                <td>
                    {user.Rol}
                    <Tooltip title="Editar roles">
                        <IconButton onClick={handleOpenRolesModal}>
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </td>

                <td>{new Date(user['Fecha de Alta']).toLocaleDateString()}</td>
                <td>{user.Asignó}</td>
                <td>
                    {isEditing ? (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={onConfirmEdit}
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
                isOpen={isRolesModalOpen} // Cambiar de `open` a `isOpen` para mantener consistencia
                onClose={handleCloseRolesModal} // Usar el método para cerrar el modal
                user={user} // Pasar el usuario completo como prop
                onRolesUpdated={(newRoles) => {
                    onRolesUpdated(user['ID Empleado'], newRoles); // Llamar al método del padre para actualizar los roles
                }}
            />
        </>
    );
};

export default UserTableRow;
