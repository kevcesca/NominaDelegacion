// pages/AsignacionRoles.js
"use client";

import { useState } from 'react';
import CambioRolModal from '../%Components/CambioRolModal/CambioRolModal';
import CambioContra from '../%Components/CambioContra/CambioContra'; // Modal para cambiar la contraseña
import styles from './page.module.css';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check'; // Icono de palomita para guardar
import CloseIcon from '@mui/icons-material/Close'; // Icono de X para cancelar

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
    const [passwordModalOpen, setPasswordModalOpen] = useState(false); // Modal de contraseña
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [newUser, setNewUser] = useState({ id: '', nombre: '', email: '', rol: '', fechaAlta: '', asigno: '' });
    const [editMode, setEditMode] = useState(null); // ID del usuario en edición

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

    // Función para asignar nombre cuando se introduce el ID del nuevo usuario
    const handleNewUserSubmit = (e) => {
        if (e.key === 'Enter' && newUser.id) {
            const newId = newUser.id;
            if (!usuarios[newId]) {
                // Asignación de nombre predeterminado
                const nombreAsignado = nombresDisponibles.find((nombre) => !Object.values(usuarios).some((u) => u.nombre === nombre));
                setNewUser((prevUser) => ({ ...prevUser, nombre: nombreAsignado || '' }));
            } else {
                alert('Este ID ya está en uso.');
            }
        }
    };
    
    const nombresDisponibles = ['Nombre Generado 1', 'Nombre Generado 2', 'Nombre Generado 3']; // Nombres de ejemplo
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
                                    
                                    {/* Campo editable: Nombre */}
                                    <td onDoubleClick={() => setEditMode(id)}>
                                        {editMode === id ? (
                                            <input
                                                type="text"
                                                value={usuario.nombre}
                                                onChange={(e) => setUsuarios((prevUsuarios) => ({
                                                    ...prevUsuarios,
                                                    [id]: { ...usuario, nombre: e.target.value },
                                                }))}
                                            />
                                        ) : (
                                            usuario.nombre
                                        )}
                                    </td>
                                    
                                    {/* Campo editable: Email */}
                                    <td onDoubleClick={() => setEditMode(id)}>
                                        {editMode === id ? (
                                            <input
                                                type="text"
                                                value={usuario.email}
                                                onChange={(e) => setUsuarios((prevUsuarios) => ({
                                                    ...prevUsuarios,
                                                    [id]: { ...usuario, email: e.target.value },
                                                }))}
                                            />
                                        ) : (
                                            usuario.email
                                        )}
                                    </td>
                                    
                                    {/* Campo editable: Rol */}
                                    <td onDoubleClick={() => setEditMode(id)}>
                                        {editMode === id ? (
                                            <select
                                                value={usuario.rol}
                                                onChange={(e) => setUsuarios((prevUsuarios) => ({
                                                    ...prevUsuarios,
                                                    [id]: { ...usuario, rol: e.target.value },
                                                }))}
                                            >
                                                <option value="Administrador">Administrador</option>
                                                <option value="Gestor de Cheques">Gestor de Cheques</option>
                                                <option value="Revisor">Revisor</option>
                                                <option value="Supervisor">Supervisor</option>
                                            </select>
                                        ) : (
                                            usuario.rol
                                        )}
                                    </td>
                                    
                                    {/* Campo editable: Fecha de Alta */}
                                    <td onDoubleClick={() => setEditMode(id)}>
                                        {editMode === id ? (
                                            <input
                                                type="text"
                                                value={usuario.fechaAlta}
                                                onChange={(e) => setUsuarios((prevUsuarios) => ({
                                                    ...prevUsuarios,
                                                    [id]: { ...usuario, fechaAlta: e.target.value },
                                                }))}
                                            />
                                        ) : (
                                            usuario.fechaAlta
                                        )}
                                    </td>
                                    
                                    {/* Campo editable: Asignó */}
                                    <td onDoubleClick={() => setEditMode(id)}>
                                        {editMode === id ? (
                                            <input
                                                type="text"
                                                value={usuario.asigno}
                                                onChange={(e) => setUsuarios((prevUsuarios) => ({
                                                    ...prevUsuarios,
                                                    [id]: { ...usuario, asigno: e.target.value },
                                                }))}
                                            />
                                        ) : (
                                            usuario.asigno
                                        )}
                                    </td>
                                    
                                    {/* Botones de Guardar y Cancelar en Modo Edición */}
                                    <td>
                                        {editMode === id ? (
                                            <>
                                                <button
                                                    className={styles.cancelButton}
                                                    onClick={() => setEditMode(null)}
                                                >
                                                    <CloseIcon />
                                                </button>
                                                <button
                                                    className={styles.saveButton}
                                                    onClick={() => {
                                                        setEditMode(null);
                                                    }}
                                                >
                                                    <CheckIcon />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className={styles.menuButton}
                                                onClick={(event) => toggleMenu(event, `menu-${id}`)}
                                            >
                                                ⋮
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center' }}>
                                    No se encontraron resultados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modales */}
            <CambioRolModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                usuario={usuarios[selectedUser]}
                onRoleChange={handleRoleChange}
            />

            <CambioContra
                isOpen={passwordModalOpen} 
                onClose={() => setPasswordModalOpen(false)} 
            />
        </div>
    );
}