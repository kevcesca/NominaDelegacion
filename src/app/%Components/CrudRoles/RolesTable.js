import React from 'react';
import RoleRow from './RoleRow';
import styles from './CrudRoles.module.css';

const RolesTable = ({ roles, setRoles, editingRoleId, setEditingRoleId, editValues, setEditValues, updateRole, onOpenModal }) => (
    <table className={styles.table}>
        <thead>
            <tr>
                <th>ID</th>
                <th>Role Name</th>
                <th>Description</th>
                <th>Permissions</th>
                <th>Actions</th>
                {editingRoleId && <th>Save/Cancel</th>}
            </tr>
        </thead>
        <tbody>
            {roles.map(role => (
                <RoleRow
                    key={role.id}
                    role={role}
                    setRoles={setRoles}
                    editingRoleId={editingRoleId}
                    setEditingRoleId={setEditingRoleId}
                    editValues={editValues}
                    setEditValues={setEditValues}
                    updateRole={updateRole}
                    onOpenModal={onOpenModal}
                />
            ))}
        </tbody>
    </table>
);

export default RolesTable;
