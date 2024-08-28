'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { Collapse } from '@mui/material';
import { ThemeProvider, Typography, Box } from '@mui/material';
import ColumnSelector from '../../%Components/ColumnSelector/ColumnSelector'; // Importa tu componente ColumnSelector
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import API_BASE_URL from '../../%Config/apiConfig';
import styles from '../page.module.css';
import theme from '../../$tema/theme';

export default function TablaMovimientos() {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [anio, setAnio] = useState('2024');
    const [codigo, setCodigo] = useState('548');
    const [showTable, setShowTable] = useState(false);
    const [collapseOpen, setCollapseOpen] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState([
        { key: 'anio', label: 'Año' },
        { key: 'quincena', label: 'Quincena' },
        { key: 'fecha_val', label: 'Fecha Valor' },
        { key: 'movto', label: 'Movimiento' },
        { key: 'concepto', label: 'Concepto' },
        { key: 'abono', label: 'Abono' },
    ]);
    const [availableColumns, setAvailableColumns] = useState([
        { key: 'anio', label: 'Año' },
        { key: 'quincena', label: 'Quincena' },
        { key: 'fecha_val', label: 'Fecha Valor' },
        { key: 'movto', label: 'Movimiento' },
        { key: 'concepto', label: 'Concepto' },
        { key: 'abono', label: 'Abono' },
    ]);
    const dt = useRef(null);
    const toast = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/consultaMovimientos?anio=${anio}&codigo=${codigo}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos: ' + response.statusText);
                }
                const data = await response.json();
                setData(data);
                setShowTable(true);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [anio, codigo]);

    const handleSearch = () => {
        setShowTable(false);
        fetchData();
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default();

                const columns = selectedColumns.map(col => ({
                    header: col.label,
                    dataKey: col.key,
                }));

                const rows = data.map(item => {
                    const row = {};
                    selectedColumns.forEach(col => row[col.key] = item[col.key]);
                    return row;
                });

                doc.autoTable({
                    columns,
                    body: rows,
                });

                doc.save('movimientos.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(data);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

            saveAsExcelFile(excelBuffer, 'movimientos');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                const EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], { type: EXCEL_TYPE });
                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <Typography variant="h4" className={styles.titulo}>Movimientos</Typography>
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

    return (
        <ThemeProvider theme={theme}>
            <div className="card">
                <Toast ref={toast} />

                <Box className={styles.dropForm}>
                    <Typography variant="h6" className={styles.exportText}>Filtrar por parámetros</Typography>
                    <Box className="p-fluid">
                        <Box className="p-field">
                            <label htmlFor="anio">Año</label>
                            <InputText id="anio" value={anio} onChange={(e) => setAnio(e.target.value)} />
                        </Box>
                        <Box className="p-field">
                            <label htmlFor="codigo">Código</label>
                            <InputText id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                        </Box>
                        <Button
                            type="button"
                            label="Buscar"
                            onClick={handleSearch}
                            icon="pi pi-search"
                            severity="primary"
                            rounded
                        />
                    </Box>
                </Box>

                <Toolbar className="mb-4" right={() => (
                    <div className="flex align-items-center justify-content-end gap-2">
                        <Button
                            type="button"
                            icon="pi pi-file"
                            rounded
                            onClick={exportCSV}
                            data-pr-tooltip="CSV"
                        />
                        <Button
                            type="button"
                            icon="pi pi-file-excel"
                            severity="success"
                            rounded
                            onClick={exportExcel}
                            data-pr-tooltip="XLS"
                        />
                        <Button
                            type="button"
                            icon="pi pi-file-pdf"
                            severity="warning"
                            rounded
                            onClick={exportPdf}
                            data-pr-tooltip="PDF"
                        />
                        <Button
                            type="button"
                            icon={`pi ${collapseOpen ? 'pi-chevron-up' : 'pi-chevron-down'}`}
                            onClick={() => setCollapseOpen(!collapseOpen)}
                            data-pr-tooltip="Seleccionar Columnas"
                        />
                    </div>
                )} />

                <Collapse in={collapseOpen}>
                    <Box className={styles.columnSelector}>
                        <ColumnSelector
                            availableColumns={availableColumns}
                            selectedColumns={selectedColumns}
                            onSelectionChange={setSelectedColumns}
                        />
                    </Box>
                </Collapse>

                {isLoading ? (
                    <ProgressBar />
                ) : (
                    showTable && (
                        <DataTable
                            ref={dt}
                            value={data}
                            globalFilter={globalFilter}
                            header={header}
                            responsiveLayout="scroll"
                            paginator
                            rows={10}
                            className="p-datatable-sm"
                        >
                            {selectedColumns.map(col => (
                                <Column
                                    key={col.key}
                                    field={col.key}
                                    header={col.label}
                                    sortable
                                    filter
                                />
                            ))}
                        </DataTable>
                    )
                )}
            </div>
        </ThemeProvider>
    );
}

