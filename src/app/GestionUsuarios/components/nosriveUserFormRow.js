// src/pages/components/UserFormRow.js
import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../page.module.css';

export default function UserFormRow({
    newUser,
    handleNewUserChange,
    handleNewUserSubmit,
    handleCancelAddUser,
}) {
    return (
        <tr>
            <td></td>
            <td>
                <input
                    type="text"
                    name="id"
                    value={newUser.id}
                    onChange={handleNewUserChange}
                    placeholder="ID"
                />
            </td>
            <td>{newUser.nombre}</td>
            <td>
                <input
                    type="text"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    placeholder="Email"
                />
            </td>
            <td>
                <select
                    name="rol"
                    value={newUser.rol}
                    onChange={handleNewUserChange}
                >
                    <option value="">Seleccionar Rol</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Gestor de Cheques">Gestor de Cheques</option>
                    <option value="Revisor">Revisor</option>
                    <option value="Supervisor">Supervisor</option>
                </select>
            </td>
            <td>
                <input
                    type="text"
                    name="fechaAlta"
                    value={newUser.fechaAlta}
                    onChange={handleNewUserChange}
                    placeholder="Fecha de Alta"
                />
            </td>
            <td>
                <input
                    type="text"
                    name="asigno"
                    value={newUser.asigno}
                    onChange={handleNewUserChange}
                    placeholder="Asignó"
                />
            </td>
            <td>
                <button onClick={handleNewUserSubmit} className={styles.saveButton}>
                    <CheckIcon />
                </button>
                <button onClick={handleCancelAddUser} className={styles.cancelButton}>
                    <CloseIcon />
                </button>
            </td>
        </tr>
    );
}
