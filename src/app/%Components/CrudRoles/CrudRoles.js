'use client';
import React, { useState, useEffect } from 'react';
import styles from './CrudRoles.module.css';
import { API_USERS_URL } from '../../%Config/apiConfig';
import Toolbar from './Toolbar';
import RolesTable from './RolesTable';
import AssignPermissionsModal from './PermissionsModal';

const CrudRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRoleId, setEditingRoleId] = useState(null);
    const [editValues, setEditValues] = useState({ name: '', description: '' });
    const [modalRole, setModalRole] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]); // IDs de roles seleccionados

    // Fetch roles desde el backend
    const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_USERS_URL}/roles-permissions`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener los roles y permisos');
            }

            const data = await response.json();
            const mappedRoles = data.map((role) => ({
                id: role.rol_id,
                name: role.nombre_rol,
                description: role.descripcion_rol,
                permissions: role.permisos || [],
            }));
            setRoles(mappedRoles);
        } catch (error) {
            console.error(error);
            setError('No se pudieron cargar los roles.');
        } finally {
            setLoading(false);
        }
    };

    // Llamar al fetch al cargar el componente
    useEffect(() => {
        fetchRoles();
    }, []);

    // Actualizar un rol
    const updateRole = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_USERS_URL}/roles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el rol');
            }
            fetchRoles(); // Refrescar la lista después de actualizar
        } catch (error) {
            console.error('Error al actualizar el rol en el servidor:', error);
        }
    };

    // Eliminar roles seleccionados
    const deleteSelectedRoles = async () => {
        try {
            const response = await fetch(`${API_USERS_URL}/roles`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roleIds: selectedRoles }),
            });

            if (!response.ok) {
                throw new Error('Error al eliminar roles seleccionados');
            }

            setRoles((prevRoles) => prevRoles.filter((role) => !selectedRoles.includes(role.id)));
            setSelectedRoles([]);
            alert('Roles eliminados correctamente');
        } catch (error) {
            console.error('Error al eliminar roles:', error);
            alert('Error al eliminar los roles seleccionados');
        }
    };

    // Abrir modal de permisos
    const handleOpenModal = (role) => setModalRole(role);

    // Cerrar modal de permisos
    const handleCloseModal = () => setModalRole(null);

    // Actualizar permisos después de modificar
    const handlePermissionsUpdated = (roleId, updatedPermissions) => {
        setRoles((prevRoles) =>
            prevRoles.map((role) =>
                role.id === roleId ? { ...role, permissions: updatedPermissions } : role
            )
        );
    };

    return (
        <div className={styles.pageContainer}>
            <Toolbar
                onDeleteSelected={deleteSelectedRoles}
                disableDelete={selectedRoles.length === 0} // Deshabilitar si no hay roles seleccionados
            />
            {loading ? (
                <div>Cargando roles...</div>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <RolesTable
                    roles={roles}
                    selectedRoles={selectedRoles}
                    setSelectedRoles={setSelectedRoles}
                    editingRoleId={editingRoleId}
                    setEditingRoleId={setEditingRoleId}
                    editValues={editValues}
                    setEditValues={setEditValues}
                    updateRole={updateRole}
                    onOpenModal={handleOpenModal}
                />
            )}
            {modalRole && (
                <AssignPermissionsModal
                    role={modalRole}
                    onClose={handleCloseModal}
                    onPermissionsUpdated={handlePermissionsUpdated}
                />
            )}
        </div>
    );
};

export default CrudRoles;
