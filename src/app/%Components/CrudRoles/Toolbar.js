import React, { useState } from 'react';
import styles from './CrudRoles.module.css';
import { Button } from '@mui/material';
import CreateRoleModal from './CreateRolModal';

const Toolbar = ({ onDeleteSelected, disableDelete, onRoleCreated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={styles.toolbar}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setIsModalOpen(true)} // Abrir modal
            >
                Crear Rol
            </Button>
            <Button variant="contained" color="secondary" onClick={() => console.log('Exportar CSV')}>
                Exportar CSV
            </Button>
            <Button variant="contained" color="secondary" onClick={() => console.log('Exportar Excel')}>
                Exportar Excel
            </Button>
            <Button variant="contained" color="secondary" onClick={() => console.log('Exportar PDF')}>
                Exportar PDF
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={onDeleteSelected}
                disabled={disableDelete}
            >
                Eliminar seleccionados
            </Button>
            {/* Modal para crear un rol */}
            <CreateRoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Cerrar modal
                onRoleCreated={onRoleCreated} // Notificar al componente principal
            />
        </div>
    );
};

export default Toolbar;
