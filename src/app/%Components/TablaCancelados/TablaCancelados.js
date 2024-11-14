// src/components/TablaChequesCancelados.js

"use client";

import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { Collapse } from '@mui/material';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ColumnSelector from '../ColumnSelector/ColumnSelector';
import styles from './TablaCancelados.module.css';
import Link from 'next/link';

export default function TablaChequesCancelados({ cancelados }) {  // Aquí usamos "cancelados"
    const [selectedCheque, setSelectedCheque] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        idEmpleado: true,
        nombre: true,
        apellido: true,
        nomina: true,
        quincena: true,
        clc: true,
        numeroCheque: true,
        motivoCancelacion: true,
        fechaCancelacion: true,
        evidencia: true
    });
    const [collapseOpen, setCollapseOpen] = useState(false);
    const dt = useRef(null);
    const toast = useRef(null);

    const availableColumns = [
        { key: 'idEmpleado', label: 'ID Empleado' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellido', label: 'Apellido' },
        { key: 'nomina', label: 'Tipo de Nómina' },
        { key: 'quincena', label: 'Quincena' },
        { key: 'clc', label: 'CLC' },
        { key: 'numeroCheque', label: 'Número de Cheque' },
        { key: 'motivoCancelacion', label: 'Motivo de Cancelación' },
        { key: 'fechaCancelacion', label: 'Fecha de Cancelación' },
        { key: 'evidencia', label: 'Evidencia' }
    ];

    const handleRowClick = (rowData) => {
        setSelectedCheque(rowData);
        setIsDialogVisible(true);
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h2 className={styles.titulo}>Cheques Cancelados</h2>
            <span className="p-input-icon-left" style={{ width: '400px', marginTop: '2rem' }}>
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar..."
                    style={{ width: '100%', marginLeft: '2rem' }}
                />
            </span>
        </div>
    );

    const chequeDialogFooter = (
        <div className="flex justify-content-end">
            <Button onClick={() => setIsDialogVisible(false)} label="Cerrar" className="p-button-text" />
        </div>
    );

    const handleColumnSelectionChange = (selectedColumns) => {
        setVisibleColumns(selectedColumns);
        setCollapseOpen(false);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default();
                const columns = availableColumns
                    .filter(col => visibleColumns[col.key])
                    .map(col => ({ header: col.label, dataKey: col.key }));

                const rows = cancelados.map((cheque) => {  // Aquí usamos "cancelados"
                    let row = {};
                    availableColumns.forEach((col) => {
                        if (visibleColumns[col.key]) {
                            row[col.key] = cheque[col.key];
                        }
                    });
                    return row;
                });

                doc.autoTable({
                    columns,
                    body: rows,
                });

                doc.save('cheques_cancelados.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const exportData = cancelados.map((cheque) => {  // Aquí usamos "cancelados"
                let filtered = {};
                Object.keys(visibleColumns).forEach((key) => {
                    if (visibleColumns[key]) {
                        filtered[key] = cheque[key];
                    }
                });
                return filtered;
            });

            const worksheet = xlsx.utils.json_to_sheet(exportData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

            saveAsExcelFile(excelBuffer, 'cheques_cancelados');
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
                    icon={`pi ${collapseOpen ? 'pi-spin pi-cog' : 'pi-filter'}`}
                    severity="secondary"
                    rounded
                    onClick={() => setCollapseOpen(!collapseOpen)}
                    data-pr-tooltip="Configurar columnas"
                />
            </div>

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

            <Collapse in={collapseOpen}>
                <div className="p-3">
                    <ColumnSelector
                        availableColumns={availableColumns}
                        onSelectionChange={handleColumnSelectionChange}
                    />
                </div>
            </Collapse>

            <DataTable
                ref={dt}
                value={cancelados}  // Aquí usamos "cancelados"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                dataKey="idEmpleado"
                globalFilter={globalFilter}
                header={header}
            >
                {availableColumns.map((column) => (
                    visibleColumns[column.key] && (
                        <Column
                            key={column.key}
                            field={column.key}
                            header={column.label}
                            sortable
                            style={{ minWidth: '150px' }}
                            body={column.key === 'evidencia' ? (rowData) => (
                                rowData.evidencia !== "No Subido" ? (
                                    <a href="#" download={rowData.evidencia}>{rowData.evidencia}</a>
                                ) : "No Subido"
                            ) : undefined}
                        />
                    )
                ))}
            </DataTable>

            <Dialog
                header="Detalles del Cheque"
                visible={isDialogVisible}
                style={{ width: '50vw' }}
                modal
                footer={chequeDialogFooter}
                onHide={() => setIsDialogVisible(false)}
            >
                {selectedCheque && (
                    <div>
                        {Object.entries(selectedCheque).map(([key, value]) => (
                            <p key={key}>
                                <strong>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong> {value || 'N/A'}
                            </p>
                        ))}
                    </div>
                )}
            </Dialog>

            <Link href="/Cheques/Reposicion">
                <Button variant="contained" color="primary" className={styles.buttons}>Reponer Cheque</Button>
            </Link>
        </div>
    );
}
