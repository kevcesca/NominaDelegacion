"use client"

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { Collapse } from '@mui/material';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ColumnSelector from '../ColumnSelector/ColumnSelector';
import API_BASE_URL from '../../%Config/apiConfig';
import styles from './TablaUsuarios.module.css';

export default function TablaEmpleados() {
    const [empleados, setEmpleados] = useState([]);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleColumns, setVisibleColumns] = useState({});
    const [showTable, setShowTable] = useState(false);
    const [collapseOpen, setCollapseOpen] = useState(false);
    const dt = useRef(null);
    const toast = useRef(null);

    const availableColumns = [
        { key: 'nombre', label: 'Nombre', defaultSelected: true },
        { key: 'apellido1', label: 'Apellido Paterno', defaultSelected: true },
        { key: 'apellido2', label: 'Apellido Materno', defaultSelected: true },
        { key: 'curp', label: 'CURP' },
        { key: 'idLegal', label: 'ID Legal' },
        { key: 'idSexo', label: 'Sexo' },
        { key: 'fecNac', label: 'Fecha de Nacimiento' },
        { key: 'fecAltaEmpleado', label: 'Fecha de Alta' },
        { key: 'fecAntiguedad', label: 'Fecha de Antigüedad' },
        { key: 'numeroSs', label: 'Número de Seguro Social' },
        { key: 'diasLab', label: 'Días Laborados' },
        { key: 'idRegIssste', label: 'ID Reg. ISSSTE' },
        { key: 'ahorrSoliPorc', label: 'Ahorro Solidario (%)' },
        { key: 'estado', label: 'Estado' },
        { key: 'delegMunic', label: 'Delegación/Municipio' },
        { key: 'poblacion', label: 'Población' },
        { key: 'colonia', label: 'Colonia' },
        { key: 'direccion', label: 'Dirección' },
        { key: 'codigoPostal', label: 'Código Postal' },
        { key: 'numInterior', label: 'Número Interior' },
        { key: 'numExterior', label: 'Número Exterior' },
        { key: 'calle', label: 'Calle' },
        { key: 'nDelegacionMunicipio', label: 'Nombre Delegación/Municipio' },
        { key: 'entFederativa', label: 'Entidad Federativa' },
        { key: 'sectPres', label: 'Sector Presupuestal' },
        { key: 'nPuesto', label: 'Puesto' },
        { key: 'fechaInsercion', label: 'Fecha de Inserción' },
        { key: 'fechaCambio', label: 'Fecha de Cambio' },
        { key: 'activo', label: 'Activo' }
    ];

    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/empleados`);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const data = await response.json();
                setEmpleados(data);
            } catch (error) {
                console.error('Error fetching the empleados:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmpleados();
    }, []);

    const handleRowClick = (rowData) => {
        setSelectedEmpleado(rowData);
        setIsDialogVisible(true);
    };

    const formatDate = (value) => {
        if (!value) return '';
        const date = new Date(value);
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() + offset);
        return localDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h2 className={styles.titulo}>TABLA EMPLEADOS</h2>
            <span className="p-input-icon-left" style={{ width: '400px', marginTop:'2rem' }}> {/* Aumenta el ancho del campo de búsqueda */}
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar..."
                    style={{ width: '100%', marginLeft:'2rem' }} // Hace que el input ocupe todo el contenedor
                />
            </span>
        </div>
    );

    const empleadoDialogFooter = (
        <div className="flex justify-content-end">
            <button onClick={() => setIsDialogVisible(false)} className="p-button p-component p-button-text">
                Cerrar
            </button>
        </div>
    );

    const handleColumnSelectionChange = (selectedColumns) => {
        setVisibleColumns(selectedColumns);
        setShowTable(true);
        setCollapseOpen(false); // Cierra el formulario después de aplicar la selección
    };

    const renderIdColumn = (rowData) => {
        return (
            <span
                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => handleRowClick(rowData)}
            >
                {rowData.idEmpleado}
            </span>
        );
    };

    const exportCSV = () => {
        const exportData = empleados.map(emp => {
            let filtered = { idEmpleado: emp.idEmpleado };
            Object.keys(visibleColumns).forEach(key => {
                if (visibleColumns[key]) {
                    filtered[key] = emp[key];
                }
            });
            return filtered;
        });

        dt.current.exportCSV({ data: exportData });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default();

                const columns = [
                    { header: 'ID', dataKey: 'idEmpleado' },
                    ...availableColumns.filter(col => visibleColumns[col.key]).map(col => ({
                        header: col.label, dataKey: col.key
                    }))
                ];

                const rows = empleados.map(emp => {
                    let row = { idEmpleado: emp.idEmpleado };
                    availableColumns.forEach(col => {
                        if (visibleColumns[col.key]) {
                            row[col.key] = col.key === 'activo' ? (emp[col.key] ? 'Sí' : 'No') : emp[col.key];
                            if (col.key.includes('fec')) {
                                row[col.key] = formatDate(emp[col.key]);
                            }
                        }
                    });
                    return row;
                });

                doc.autoTable({
                    columns,
                    body: rows,
                });

                doc.save('empleados.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const exportData = empleados.map(emp => {
                let filtered = { idEmpleado: emp.idEmpleado };
                Object.keys(visibleColumns).forEach(key => {
                    if (visibleColumns[key]) {
                        filtered[key] = key.includes('fec') ? formatDate(emp[key]) : emp[key];
                    }
                });
                return filtered;
            });

            const worksheet = xlsx.utils.json_to_sheet(exportData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

            saveAsExcelFile(excelBuffer, 'empleados');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], { type: EXCEL_TYPE });
                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className={styles.dropForm}>
                <h3 className={styles.exportText}>Campos para generar tabla</h3>
                <Button
                    type="button"
                    icon={`pi ${collapseOpen ? 'pi-chevron-up' : 'pi-chevron-down'}`}
                    severity="secondary"
                    rounded
                    onClick={() => setCollapseOpen(!collapseOpen)}
                    data-pr-tooltip="Configurar columnas"
                />
            </div>

            {/* Toolbar with export and column configuration buttons */}
            <Toolbar className="mb-4" right={() => (
                <div className="flex align-items-center justify-content-end gap-2">
                    <Button
                        type="button"
                        icon="pi pi-file"
                        rounded
                        onClick={() => exportCSV()}
                        data-pr-tooltip="CSV"
                    />
                    <Button
                        type="button"
                        icon="pi pi-file-excel"
                        severity="success"
                        rounded
                        onClick={() => exportExcel()}
                        data-pr-tooltip="XLS"
                    />
                    <Button
                        type="button"
                        icon="pi pi-file-pdf"
                        severity="warning"
                        rounded
                        onClick={() => exportPdf()}
                        data-pr-tooltip="PDF"
                    />
                </div>
            )} />

            {/* Collapse for column selector */}
            <Collapse in={collapseOpen}>
                <div className="p-3">
                    <ColumnSelector
                        availableColumns={availableColumns}
                        onSelectionChange={handleColumnSelectionChange}
                    />
                </div>
            </Collapse>

            {/* Data table */}
            {isLoading ? (
                <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
            ) : (
                showTable && (
                    <DataTable
                        ref={dt}
                        value={empleados}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        dataKey="idEmpleado"
                        globalFilter={globalFilter}
                        header={header}
                    >
                        <Column
                            field="idEmpleado"
                            header="ID"
                            sortable
                            style={{ minWidth: '100px' }}
                            body={renderIdColumn}
                        ></Column>
                        {availableColumns.map(
                            (column) =>
                                visibleColumns[column.key] && (
                                    <Column
                                        key={column.key}
                                        field={column.key}
                                        header={column.label}
                                        sortable
                                        style={{ minWidth: '150px' }}
                                        body={
                                            column.key === 'activo'
                                                ? (rowData) => (rowData.activo ? "Sí" : "No")
                                                : column.key.includes('fec')
                                                    ? (rowData) => formatDate(rowData[column.key])
                                                    : undefined
                                        }
                                    />
                                )
                        )}
                    </DataTable>
                )
            )}

            {/* Dialog for employee details */}
            <Dialog
                header="Detalles del Empleado"
                visible={isDialogVisible}
                style={{ width: '50vw' }}
                modal
                footer={empleadoDialogFooter}
                onHide={() => setIsDialogVisible(false)}
            >
                {selectedEmpleado && (
                    <div>
                        {Object.entries(selectedEmpleado).map(([key, value]) => (
                            <p key={key}>
                                <strong>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong> {value || 'N/A'}
                            </p>
                        ))}
                    </div>
                )}
            </Dialog>
        </div>
    );
}
