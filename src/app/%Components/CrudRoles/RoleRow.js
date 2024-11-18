import React from 'react';
import styles from './CrudRoles.module.css';

const RoleRow = ({ role, setRoles, editingRoleId, setEditingRoleId, editValues, setEditValues, updateRole, onOpenModal }) => {
    const startEditing = () => {
        setEditingRoleId(role.id);
        setEditValues({ name: role.name, description: role.description });
    };

    const cancelEditing = () => {
        setEditingRoleId(null);
        setEditValues({ name: '', description: '' });
    };

    const saveEditing = () => {
        setRoles(prevRoles =>
            prevRoles.map(r =>
                r.id === role.id ? { ...r, name: editValues.name, description: editValues.description } : r
            )
        );
        updateRole(role.id, { nombre_rol: editValues.name, descripcion_rol: editValues.description });
        setEditingRoleId(null);
    };

    return (
        <tr>
            <td>{role.id}</td>
            <td onDoubleClick={startEditing}>
                {editingRoleId === role.id ? (
                    <input
                        type="text"
                        value={editValues.name}
                        onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                        autoFocus
                    />
                ) : (
                    role.name
                )}
            </td>
            <td onDoubleClick={startEditing}>
                {editingRoleId === role.id ? (
                    <input
                        type="text"
                        value={editValues.description}
                        onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                    />
                ) : (
                    role.description
                )}
            </td>
            <td>{role.permissions.join(', ')}</td>
            <td>
                <button className={styles.menuButton} onClick={() => onOpenModal(role)}>
                    &#x22EE;
                </button>
            </td>
            {editingRoleId === role.id && (
                <td>
                    <button className={styles.buttonSave} onClick={saveEditing}>Guardar</button>
                    <button className={styles.buttonCancel} onClick={cancelEditing}>Cancelar</button>
                </td>
            )}
        </tr>
    );
};

export default RoleRow;
