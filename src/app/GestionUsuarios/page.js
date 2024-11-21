'use client';

import React, { useState } from 'react';
import { Button } from '@mui/material';
import styles from './page.module.css';
import AddUserModal from './components/AddUserModal';
import UserTableRow from './components/UserTableRow';
import UserActionsMenu from './components/UserActionsMenu';
import useUsers from './components/useUsers';
import { useAuth } from '../context/AuthContext';
import { API_USERS_URL } from '../%Config/apiConfig';

const UserTable = () => {
    const { users, fetchUsers, toggleUserStatus } = useUsers();
    const { user: currentUser } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editedFields, setEditedFields] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openMenu = Boolean(anchorEl);

    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const handleDoubleClick = (user, field) => {
        setEditingUser(user['ID Empleado']);
        setEditedFields({
            'Nombre de Usuario': user['Nombre de Usuario'],
            Email: user.Email,
        });
    };

    const handleInputChange = (field, value) => {
        setEditedFields((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleConfirmEdit = async () => {
        try {
            const updatedDetails = {
                nombre_usuario: editedFields['Nombre de Usuario'],
                correo_usuario: editedFields.Email,
            };
    
            const response = await fetch(
                `${API_USERS_URL}/users/${editingUser}/update-details`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedDetails),
                }
            );
    
            if (!response.ok) throw new Error('Error al actualizar los detalles del usuario');
    
            const data = await response.json();
            console.log(data.message);
    
            // Recargar la lista de usuarios
            await fetchUsers();
    
            // Salir del modo de edición
            setEditingUser(null); // << Aquí es donde nos aseguramos de salir del modo de edición
            setEditedFields({});
        } catch (error) {
            console.error('Error al confirmar la edición:', error);
        }
    };
    

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Gestión de Usuarios</h2>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setIsModalOpen(true)}
                style={{ marginBottom: '10px' }}
            >
                Añadir Usuario
            </Button>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID Empleado</th>
                        <th>Nombre Empleado</th>
                        <th>Nombre Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Fecha de Alta</th>
                        <th>Asignó</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <UserTableRow
                            key={user['ID Empleado']}
                            user={user}
                            isEditing={editingUser === user['ID Empleado']}
                            editedFields={editedFields}
                            onDoubleClick={handleDoubleClick}
                            onInputChange={handleInputChange}
                            onConfirmEdit={handleConfirmEdit}
                            onMenuOpen={handleMenuOpen}
                        />
                    ))}
                </tbody>
            </table>

            <UserActionsMenu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                onToggleStatus={() => {
                    toggleUserStatus(selectedUser['ID Empleado']);
                    handleMenuClose();
                }}
                isActive={selectedUser?.Activo}
            />

            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUserAdded={fetchUsers}
                currentUser={currentUser?.nombre_usuario}
            />
        </div>
    );
};

export default UserTable;
