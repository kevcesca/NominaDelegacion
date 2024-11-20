'use client';

import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, IconButton, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from './page.module.css';
import { API_USERS_URL } from '../%Config/apiConfig';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const open = Boolean(anchorEl);

    // Cargar usuarios desde el servicio
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_USERS_URL}/users-with-roles`);
                if (!response.ok) throw new Error('Error al obtener usuarios');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error al cargar los usuarios:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    // Alternar el estado de usuario (habilitar/deshabilitar)
    const toggleUserStatus = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch(
                `${API_USERS_URL}/users/${selectedUser['ID Empleado']}/toggle-status`,
                { method: 'PUT' }
            );

            if (!response.ok) throw new Error('Error al alternar el estado del usuario');

            const data = await response.json();
            console.log(data.message);

            // Actualizar el estado local con el nuevo estado
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user['ID Empleado'] === selectedUser['ID Empleado']
                        ? { ...user, Activo: data.estado }
                        : user
                )
            );

            handleMenuClose();
        } catch (error) {
            console.error('Error al alternar el estado del usuario:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Gestión de Usuarios</h2>
            <Button variant="contained" color="secondary" style={{ marginRight: '10px' }}>
                Cargar
            </Button>
            <Button variant="contained" color="primary">
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
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user['ID Empleado']} className={!user.Activo ? styles.disabledRow : ''}>
                                <td>{user['ID Empleado']}</td>
                                <td>{user['Nombre Empleado']}</td>
                                <td>{user['Nombre de Usuario']}</td>
                                <td>{user.Email}</td>
                                <td>{user.Rol}</td> {/* Campo con roles agrupados */}
                                <td>{new Date(user['Fecha de Alta']).toLocaleDateString()}</td>
                                <td>{user.Asignó}</td>
                                <td>
                                    <IconButton
                                        onClick={(event) => handleMenuOpen(event, user)}
                                        aria-label="opciones"
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>
                                No se encontraron resultados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Menú desplegable */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {selectedUser?.Activo ? (
                    <MenuItem onClick={toggleUserStatus}>Deshabilitar Usuario</MenuItem>
                ) : (
                    <MenuItem onClick={toggleUserStatus}>Habilitar Usuario</MenuItem>
                )}
            </Menu>
        </div>
    );
};

export default UserTable;
