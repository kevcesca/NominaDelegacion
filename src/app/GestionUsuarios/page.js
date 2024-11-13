// pages/AsignacionRoles.js
"use client";

import { useState } from 'react';
import CambioRolModal from '../%Components/CambioRolModal/CambioRolModal';
import styles from './page.module.css';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function AsignacionRoles() {
    const [menus, setMenus] = useState({});
    const [usuarios, setUsuarios] = useState({
        '001': { nombre: 'Juan Pérez', email: 'juan.perez@empresa.com', rol: 'Administrador', fechaAlta: '2023-01-15', asigno: 'Maria Garcia', habilitado: true },
        '002': { nombre: 'Laura Martínez', email: 'laura.martinez@empresa.com', rol: 'Revisor', fechaAlta: '2023-03-22', asigno: 'Pedro Alvarez', habilitado: true },
        '003': { nombre: 'Carlos Gómez', email: 'carlos.gomez@empresa.com', rol: 'Usuario', fechaAlta: '2023-05-10', asigno: 'Andrea Perez', habilitado: false },
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isAddingUser, setIsAddingUser] = useState(false); // Estado para saber si se está agregando un usuario
    const [newUser, setNewUser] = useState({ nombre: '', email: '', rol: '', fechaAlta: '', asigno: '' }); // Estado del nuevo usuario

    const toggleMenu = (event, id) => {
        event.stopPropagation();
        setMenus((prevMenus) => ({
            ...prevMenus,
            [id]: !prevMenus[id],
        }));
    };

    const handleRoleChange = (nuevoRol, rolesAdicionales) => {
        if (selectedUser) {
            setUsuarios((prevUsuarios) => ({
                ...prevUsuarios,
                [selectedUser]: {
                    ...prevUsuarios[selectedUser],
                    rol: nuevoRol,
                    rolesAdicionales,
                },
            }));
        }
    };

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    };

    const toggleHabilitarUsuario = (id) => {
        setUsuarios((prevUsuarios) => ({
            ...prevUsuarios,
            [id]: {
                ...prevUsuarios[id],
                habilitado: !prevUsuarios[id].habilitado,
            },
        }));
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(usuariosFiltrados.map(([id]) => id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (id) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(id)
                ? prevSelectedUsers.filter((userId) => userId !== id)
                : [...prevSelectedUsers, id]
        );
    };

    const handleDisableUsers = () => {
        setUsuarios((prevUsuarios) => {
            const updatedUsuarios = { ...prevUsuarios };
            selectedUsers.forEach((userId) => {
                if (updatedUsuarios[userId]) {
                    updatedUsuarios[userId].habilitado = false;
                }
            });
            return updatedUsuarios;
        });
        setSelectedUsers([]);
    };

    const handleEnableUsers = () => {
        setUsuarios((prevUsuarios) => {
            const updatedUsuarios = { ...prevUsuarios };
            selectedUsers.forEach((userId) => {
                if (updatedUsuarios[userId]) {
                    updatedUsuarios[userId].habilitado = true;
                }
            });
            return updatedUsuarios;
        });
        setSelectedUsers([]);
    };

    const usuariosFiltrados = Object.entries(usuarios).filter(([id, usuario]) => {
        const search = searchTerm.toLowerCase();
        return (
            id.includes(search) ||
            usuario.nombre.toLowerCase().includes(search) ||
            usuario.email.toLowerCase().includes(search) ||
            usuario.rol.toLowerCase().includes(search) ||
            usuario.fechaAlta.includes(search) ||
            usuario.asigno.toLowerCase().includes(search)
        );
    });

    const selectedEnabledUsersCount = selectedUsers.filter(
        (userId) => usuarios[userId] && usuarios[userId].habilitado
    ).length;

    const selectedDisabledUsersCount = selectedUsers.filter(
        (userId) => usuarios[userId] && !usuarios[userId].habilitado
    ).length;

    // Función para agregar un nuevo usuario a la tabla
    const handleAddUser = () => {
        setIsAddingUser(true);
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleNewUserSubmit = (e) => {
        if (e.key === 'Enter') {
            const newId = String(Object.keys(usuarios).length + 1).padStart(3, '0');
            setUsuarios((prevUsuarios) => ({
                ...prevUsuarios,
                [newId]: { ...newUser, habilitado: true },
            }));
            setIsAddingUser(false);
            setNewUser({ nombre: '', email: '', rol: '', fechaAlta: '', asigno: '' });
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.container}>
                <h1>Gestión de Usuarios</h1>

                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Buscar en todas las columnas"
                        value={searchTerm}
                        onChange={handleSearchInput}
                    />
                </div>

                {/* Contenedor para los botones de "Cargar" y "Añadir Usuario" */}
                <div className={styles.buttonContainer}>
                    <button className={styles.uploadButton}>
                        <UploadFileIcon className={styles.uploadIcon} /> Cargar
                    </button>
                    <button className={styles.addButton} onClick={handleAddUser}>
                        <PersonAddIcon className={styles.addIcon} /> Añadir Usuario
                    </button>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={
                                        selectedUsers.length === usuariosFiltrados.length && usuariosFiltrados.length > 0
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
                                <tr key={id}>
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
                                                <a href="/GestionUsuarios/CambioContra">
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                    No se encontraron resultados
                                </td>
                            </tr>
                        )}
                        {isAddingUser && (
                            <tr>
                                <td></td>
                                <td className={styles.newUserField}>{String(Object.keys(usuarios).length + 1).padStart(3, '0')}</td>
                                <td>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={newUser.nombre}
                                        onChange={handleNewUserChange}
                                        onKeyDown={handleNewUserSubmit}
                                        placeholder="Nombre"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="email"
                                        value={newUser.email}
                                        onChange={handleNewUserChange}
                                        onKeyDown={handleNewUserSubmit}
                                        placeholder="Email"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="rol"
                                        value={newUser.rol}
                                        onChange={handleNewUserChange}
                                        onKeyDown={handleNewUserSubmit}
                                        placeholder="Rol"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="fechaAlta"
                                        value={newUser.fechaAlta}
                                        onChange={handleNewUserChange}
                                        onKeyDown={handleNewUserSubmit}
                                        placeholder="Fecha de Alta"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="asigno"
                                        value={newUser.asigno}
                                        onChange={handleNewUserChange}
                                        onKeyDown={handleNewUserSubmit}
                                        placeholder="Asignó"
                                    />
                                </td>
                                <td></td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className={styles.buttonDeshabilitar}>
                    {selectedEnabledUsersCount >= 2 && (
                        <button className={styles.disableButton} onClick={handleDisableUsers}>
                            Deshabilitar usuarios
                        </button>
                    )}
                    {selectedDisabledUsersCount >= 2 && (
                        <button className={styles.enableButton} onClick={handleEnableUsers}>
                            Habilitar usuarios
                        </button>
                    )}
                </div>
            </div>

            <CambioRolModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                usuario={usuarios[selectedUser]}
                onRoleChange={handleRoleChange}
            />
        </div>
    );
}
