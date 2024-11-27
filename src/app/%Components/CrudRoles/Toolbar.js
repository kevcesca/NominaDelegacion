import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import styles from './CrudRoles.module.css';
import CreateRoleModal from './CreateRolModal';
import ConfirmationModal from './ConfirmationModal'; // Importamos el componente reutilizable
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import "jspdf-autotable";

const Toolbar = ({ selectedRoles, onDeleteSelected, disableDelete, onRoleCreated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal de creación de roles
    const [menuAnchor, setMenuAnchor] = useState(null); // Anclaje del menú de exportación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal de confirmación de eliminación
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false); // Modal de validación para creación de roles
    const [roleToDelete, setRoleToDelete] = useState(null); // Rol seleccionado para eliminar

    // Abrir el menú desplegable
    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    // Cerrar el menú desplegable
    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    // Exportar a CSV
    const handleExportCSV = () => {
        if (!selectedRoles || !selectedRoles.length) return;
        const csvContent = selectedRoles
            .map(role => `${role.id},${role.name},${role.description},${role.permissions.join(';')}`)
            .join('\n');
        const blob = new Blob([`ID,Nombre,Descripción,Permisos\n${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'roles.csv';
        link.click();
        handleMenuClose();
    };

    // Exportar a Excel
    const handleExportExcel = () => {
        if (!selectedRoles || !selectedRoles.length) return;

        const worksheet = XLSX.utils.json_to_sheet(
            selectedRoles.map((role) => ({
                ID: role.id,
                Nombre: role.name,
                Descripción: role.description,
                Permisos: role.permissions.join(', '),
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles');
        XLSX.writeFile(workbook, 'roles.xlsx');
        handleMenuClose();
    };

    // Exportar a PDF
    const handleExportPDF = () => {
        if (!selectedRoles || !selectedRoles.length) return;

        const doc = new jsPDF();
        doc.text('Roles Exportados', 10, 10);

        const tableData = selectedRoles.map((role) => [
            role.id,
            role.name,
            role.description,
            role.permissions.join(', '),
        ]);

        const tableHeaders = ['ID', 'Nombre', 'Descripción', 'Permisos'];

        doc.autoTable({
            head: [tableHeaders],
            body: tableData,
            startY: 20,
            styles: { fontSize: 10, cellPadding: 2 },
        });

        doc.save('roles.pdf');
        handleMenuClose();
    };

    // Validar y mostrar modal si no se seleccionaron permisos
    const handleCreateRole = () => {
        setIsModalOpen(true);
    };

    const handleValidateCreateRole = () => {
        setIsValidationModalOpen(true); // Mostrar modal de validación
    };

    // Eliminar rol seleccionado
    const handleDeleteRole = () => {
        if (!selectedRoles || selectedRoles.length === 0) {
            setIsValidationModalOpen(true); // Mostrar mensaje si no hay roles seleccionados
            return;
        }
        setRoleToDelete(selectedRoles[0]); // Simular el rol que se va a borrar
        setIsDeleteModalOpen(true); // Abrir modal de eliminación
    };

    // Confirmar eliminación de rol
    const confirmDeleteRole = () => {
        onDeleteSelected(roleToDelete); // Llamamos la función para eliminar
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
    };

    return (
        <div className={styles.toolbar}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setIsModalOpen(true)}
            >
                Crear Rol
            </Button>

            {/* Botón desplegable para exportar */}
            <Button
                variant="contained"
                color="secondary"
                onClick={handleMenuOpen}
                disabled={!selectedRoles || !selectedRoles.length} // Botón deshabilitado si no hay roles seleccionados
            >
                Exportar
            </Button>

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleExportCSV}>Exportar a CSV</MenuItem>
                <MenuItem onClick={handleExportExcel}>Exportar a Excel</MenuItem>
                <MenuItem onClick={handleExportPDF}>Exportar a PDF</MenuItem>
            </Menu>

            <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteRole}
                disabled={disableDelete}
            >
                Eliminar seleccionados
            </Button>

            {/* Modal de validación para crear rol */}
            <ConfirmationModal
                isOpen={isValidationModalOpen}
                title="Validación de Campos"
                message="Por favor, selecciona al menos un permiso antes de crear el rol."
                onConfirm={() => setIsValidationModalOpen(false)}
                confirmText="Aceptar"
            />

            {/* Modal para eliminar un rol */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Eliminar Rol"
                message={`¿Estás seguro de que deseas eliminar el rol "${roleToDelete?.name}"?`}
                onConfirm={confirmDeleteRole}
                onCancel={() => setIsDeleteModalOpen(false)}
                confirmText="Eliminar"
                cancelText="Cancelar"
            />

            {/* Modal para crear un rol */}
            <CreateRoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRoleCreated={onRoleCreated}
                resetOnOpen // <-- Agregamos esta prop
            />
        </div>
    );
};

export default Toolbar;
