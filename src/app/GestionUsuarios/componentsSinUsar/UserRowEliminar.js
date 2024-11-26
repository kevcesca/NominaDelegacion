// src/pages/components/UserRow.js
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import styles from '../page.module.css';

export default function UserRow({
    id,
    usuario,
    selectedUsers,
    handleSelectUser,
    toggleMenu,
    menus,
    setModalOpen,
    setSelectedUser,
    setPasswordModalOpen,
    toggleHabilitarUsuario
}) {
    return (
        <tr>
            <td>
                <input
                    type="checkbox"
                    checked={selectedUsers.includes(id)}
                    onChange={() => handleSelectUser(id)}
                />
            </td>
            <td className={!usuario.habilitado ? styles.disabledCell : ''}>{id}</td>
            <td className={!usuario.habilitado ? styles.disabledCell : ''}>{usuario.nombre}</td>
            <td className={!usuario.habilitado ? styles.disabledCell : ''}>{usuario.email}</td>
            <td className={!usuario.habilitado ? styles.disabledCell : ''}>{usuario.rol}</td>
            <td className={!usuario.habilitado ? styles.disabledCell : ''}>{usuario.fechaAlta}</td>
            <td className={!usuario.habilitado ? styles.disabledCell : ''}>{usuario.asigno}</td>
            <td>
                <button
                    className={styles.menuButton}
                    onClick={(event) => toggleMenu(event, `menu-${id}`)}
                >
                    ⋮
                </button>
                {menus[`menu-${id}`] && (
                    <div className={styles.dropdownMenu}>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedUser(id);
                                setModalOpen(true);
                                setMenus({});
                            }}
                        >
                            Cambiar Rol
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setPasswordModalOpen(true);
                                setMenus({});
                            }}
                        >
                            Cambiar contraseña
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                toggleHabilitarUsuario(id);
                                setMenus({});
                            }}
                        >
                            {usuario.habilitado ? 'Deshabilitar' : 'Habilitar'}
                        </a>
                    </div>
                )}
            </td>
        </tr>
    );
}
