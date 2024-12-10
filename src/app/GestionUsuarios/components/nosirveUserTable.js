// src/pages/components/UserTable.js
import React from 'react';
import UserRow from './UserRow';
import UserFormRow from './UserFormRow';
import styles from '../page.module.css';

export default function UserTable({
    usuariosFiltrados,
    selectedUsers,
    handleSelectAll,
    handleSelectUser,
    toggleMenu,
    menus,
    setModalOpen,
    setSelectedUser,
    setPasswordModalOpen,
    toggleHabilitarUsuario,
    isAddingUser,
    newUser,
    handleNewUserChange,
    handleNewUserSubmit,
    handleCancelAddUser
}) {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={
                                selectedUsers.length === usuariosFiltrados.length &&
                                usuariosFiltrados.length > 0
                            }
                        />
                    </th>
                    <th>ID Empleado</th>
                    <th>Nombre Empleado</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Fecha de Alta</th>
                    <th>Asignó</th>
                    <th>Opciones</th>
                </tr>
            </thead>
            <tbody>
                {usuariosFiltrados.length > 0 ? (
                    usuariosFiltrados.map(([id, usuario]) => (
                        <UserRow
                            key={id}
                            id={id}
                            usuario={usuario}
                            selectedUsers={selectedUsers}
                            handleSelectUser={handleSelectUser}
                            toggleMenu={toggleMenu}
                            menus={menus}
                            setModalOpen={setModalOpen}
                            setSelectedUser={setSelectedUser}
                            setPasswordModalOpen={setPasswordModalOpen}
                            toggleHabilitarUsuario={toggleHabilitarUsuario}
                        />
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                            No se encontraron resultados
                        </td>
                    </tr>
                )}
                {isAddingUser && (
                    <UserFormRow
                        newUser={newUser}
                        handleNewUserChange={handleNewUserChange}
                        handleNewUserSubmit={handleNewUserSubmit}
                        handleCancelAddUser={handleCancelAddUser}
                    />
                )}
            </tbody>
        </table>
    );
}
