"use client";

import { useState } from 'react';
import CambioRolModal from '../%Components/CambioRolModal/CambioRolModal';
import styles from './page.module.css';

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

    return (
        <div className={styles.pageContainer}>
            <div className={styles.container}>
                <h1>Asignación de Roles a Usuarios</h1>
                <a className={styles.button} href="/GestionUsuarios/Roles">Gestionar Roles</a>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Buscar en todas las columnas"
                        value={searchTerm}
                        onChange={handleSearchInput}
                    />
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
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
                                                    href="/GestionUsuarios/CambioContra"
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                    No se encontraron resultados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
