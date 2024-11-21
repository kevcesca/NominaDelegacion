import React from 'react';
import { TextField, Button, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from '../page.module.css';

const UserTableRow = ({
    user,
    isEditing,
    editedFields,
    onDoubleClick,
    onInputChange,
    onConfirmEdit,
    onMenuOpen,
}) => {
    return (
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

            <td>{user.Rol}</td>
            <td>{new Date(user['Fecha de Alta']).toLocaleDateString()}</td>
            <td>{user.Asignó}</td>
            <td>
                {isEditing ? (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={onConfirmEdit} // Aquí llamamos al padre para confirmar
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
    );
};

export default UserTableRow;
