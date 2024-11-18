'use client';
import React, { useState, useEffect } from 'react';
import styles from './CrudRoles.module.css';
import { API_USERS_URL } from '../../%Config/apiConfig';
import Toolbar from './Toolbar';
import RolesTable from './RolesTable';
import PermissionsModal from './PermissionsModal';

const CrudRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRoleId, setEditingRoleId] = useState(null);
    const [editValues, setEditValues] = useState({ name: '', description: '' });
    const [modalRole, setModalRole] = useState(null);

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
            const mappedRoles = data.map(role => ({
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

    useEffect(() => {
        fetchRoles();
    }, []);

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
        } catch (error) {
            console.error('Error al actualizar el rol en el servidor:', error);
            fetchRoles(); // Revertir cambios si la actualización falla
        }
    };

    const handleOpenModal = (role) => setModalRole(role);
    const handleCloseModal = () => setModalRole(null);

    return (
        <div className={styles.pageContainer}>
            <Toolbar />
            {loading ? (
                <div>Cargando roles...</div>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <RolesTable
                    roles={roles}
                    setRoles={setRoles}
                    editingRoleId={editingRoleId}
                    setEditingRoleId={setEditingRoleId}
                    editValues={editValues}
                    setEditValues={setEditValues}
                    updateRole={updateRole}
                    onOpenModal={handleOpenModal}
                />
            )}
            {modalRole && (
                <PermissionsModal role={modalRole} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default CrudRoles;
