'use client';

import React, { useState } from 'react';
import { Button } from '@mui/material';
import styles from './page.module.css';
import AddUserModal from './components/AddUserModal';
import UserTableRow from './components/UserTableRow';
import UserActionsMenu from './components/UserActionsMenu';
import AssignRolesModal from './components/AssignRolesModal'; // Modal para asignar roles
import useUsers from './components/useUsers';
import { useAuth } from '../context/AuthContext';
import { API_USERS_URL } from '../%Config/apiConfig';

const UserTable = () => {
    const { users, setUsers, fetchUsers, toggleUserStatus } = useUsers(); // Incluimos `setUsers` para actualizar la lista localmente
    const { user: currentUser } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editedFields, setEditedFields] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRolesModalOpen, setIsRolesModalOpen] = useState(false); // Estado del modal de roles

    const openMenu = Boolean(anchorEl);

    // Abrir el menú contextual de opciones
    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    // Cerrar el menú contextual de opciones
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    // Entrar en modo edición al hacer doble clic
    const handleDoubleClick = (user, field) => {
        setEditingUser(user['ID Empleado']);
        setEditedFields({
            'Nombre de Usuario': user['Nombre de Usuario'],
            Email: user.Email,
        });
    };

    // Manejar cambios en los campos editables
    const handleInputChange = (field, value) => {
        setEditedFields((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    // Confirmar cambios al editar un usuario
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

            console.log('Detalles actualizados exitosamente.');
            await fetchUsers(); // Refrescar la lista de usuarios
            setEditingUser(null);
            setEditedFields({});
        } catch (error) {
            console.error('Error al confirmar la edición:', error);
        }
    };

    // Abrir el modal de roles
    const handleOpenRolesModal = (user) => {
        setSelectedUser(user);
        setIsRolesModalOpen(true);
    };

    // Manejar la actualización de roles desde el modal
    const handleRolesUpdated = (userId, newRoles) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user['ID Empleado'] === userId
                    ? { ...user, Rol: newRoles.join(', ') } // Actualizar los roles en la lista local
                    : user
            )
        );
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
                            onRolesUpdated={handleRolesUpdated} // Pasar el handler al componente
                            onOpenRolesModal={handleOpenRolesModal} // Pasar para abrir el modal de roles
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

            <AssignRolesModal
                isOpen={isRolesModalOpen}
                onClose={() => setIsRolesModalOpen(false)}
                user={selectedUser}
                onRolesUpdated={(newRoles) =>
                    handleRolesUpdated(selectedUser?.['ID Empleado'], newRoles)
                } // Actualizamos roles tras guardar
            />
        </div>
    );
};

export default UserTable;
