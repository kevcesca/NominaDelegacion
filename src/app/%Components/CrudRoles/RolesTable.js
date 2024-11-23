import React from 'react';
import RoleRow from './RoleRow';
import styles from './CrudRoles.module.css';
import { Checkbox } from '@mui/material';

const RolesTable = ({
    roles,
    selectedRoles,
    setSelectedRoles,
    editingRoleId,
    setEditingRoleId,
    editValues,
    setEditValues,
    updateRole,
    onOpenModal,
}) => {
    const handleToggleRole = (roleId) => {
        setSelectedRoles((prevSelected) =>
            prevSelected.includes(roleId)
                ? prevSelected.filter((id) => id !== roleId)
                : [...prevSelected, roleId]
        );
    };

    const handleToggleAll = (event) => {
        if (event.target.checked) {
            const allRoleIds = roles.map((role) => role.id);
            setSelectedRoles(allRoleIds);
        } else {
            setSelectedRoles([]);
        }
    };

    const allSelected = roles.length > 0 && selectedRoles.length === roles.length;

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>
                        <Checkbox
                            checked={allSelected}
                            onChange={handleToggleAll}
                            indeterminate={
                                selectedRoles.length > 0 && selectedRoles.length < roles.length
                            }
                        />
                    </th>
                    <th>ID</th>
                    <th>Role Name</th>
                    <th>Description</th>
                    <th>Permissions</th>
                    {editingRoleId && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {roles.map((role) => (
                    <RoleRow
                        key={role.id}
                        role={role}
                        isSelected={selectedRoles.includes(role.id)}
                        onToggleRole={() => handleToggleRole(role.id)}
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
};

export default RolesTable;
