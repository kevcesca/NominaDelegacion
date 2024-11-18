import React from 'react';
import styles from './CrudRoles.module.css';

const PermissionsModal = ({ role, onClose }) => (
    <div className={styles.modal}>
        <div className={styles.modalContent}>
            <h3>Editar Permisos: {role.name}</h3>
            <div>{role.permissions.join(', ')}</div>
            <button className={styles.button} onClick={onClose}>Cerrar</button>
        </div>
    </div>
);

export default PermissionsModal;
