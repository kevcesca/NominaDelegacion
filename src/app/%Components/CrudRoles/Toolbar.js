import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import styles from './CrudRoles.module.css';
import CreateRoleModal from './CreateRolModal';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import "jspdf-autotable";

const Toolbar = ({ selectedRoles, onDeleteSelected, disableDelete, onRoleCreated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);

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
        if (!selectedRoles || !selectedRoles.length) return; // Verifica que haya roles seleccionados
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
    
        // Datos para la tabla
        const worksheet = XLSX.utils.json_to_sheet(
            selectedRoles.map((role) => ({
                ID: role.id,
                Nombre: role.name,
                Descripción: role.description,
                Permisos: role.permissions.join(', '),
            }))
        );
    
        // Agregar encabezados a la tabla
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles');
        XLSX.writeFile(workbook, 'roles.xlsx');
        handleMenuClose();
    };    

    // Exportar a PDF
    const handleExportPDF = () => {
        if (!selectedRoles || !selectedRoles.length) return;
    
        const doc = new jsPDF();
    
        // Título del documento
        doc.text('Roles Exportados', 10, 10);
    
        // Datos de la tabla
        const tableData = selectedRoles.map((role) => [
            role.id,
            role.name,
            role.description,
            role.permissions.join(', '),
        ]);
    
        // Encabezados de la tabla
        const tableHeaders = ['ID', 'Nombre', 'Descripción', 'Permisos'];
    
        // Crear la tabla con jsPDF autotable
        doc.autoTable({
            head: [tableHeaders],
            body: tableData,
            startY: 20,
            styles: { fontSize: 10, cellPadding: 2 },
        });
    
        // Guardar el PDF
        doc.save('roles.pdf');
        handleMenuClose();
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
                disabled={!selectedRoles || selectedRoles.length === 0} // Botón deshabilitado si no hay roles seleccionados
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
                onClick={onDeleteSelected}
                disabled={disableDelete}
            >
                Eliminar seleccionados
            </Button>

            {/* Modal para crear un rol */}
            <CreateRoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRoleCreated={onRoleCreated}
            />
        </div>
    );
};

export default Toolbar;
