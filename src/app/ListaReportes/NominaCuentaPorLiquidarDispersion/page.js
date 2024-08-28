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
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ColumnSelector from '../../%Components/ColumnSelector/ColumnSelector';
import API_BASE_URL from '../../%Config/apiConfig';
import styles from '../page.module.css';
import theme from '../../$tema/theme';

export default function TablaComparacionCampos() {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({});
    const [showTable, setShowTable] = useState(false);
    const [collapseOpen, setCollapseOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        anio: '',
        quincenas: ['', '', ''],
    });

    const dt = useRef(null);
    const toast = useRef(null);

    const availableColumns = [
        { key: 'id_empleado', label: 'ID Empleado', defaultSelected: true },
        { key: 'nombre', label: 'Nombre', defaultSelected: true },
        { key: 'apellido_1', label: 'Apellido 1', defaultSelected: true },
        { key: 'apellido_2', label: 'Apellido 2', defaultSelected: true },
        { key: 'anio', label: 'Año', defaultSelected: true },
        { key: 'quincena', label: 'Quincena', defaultSelected: true },
        { key: 'nomina', label: 'Nómina', defaultSelected: true },
        { key: 'desc_extraor', label: 'Descripción Extra', defaultSelected: false },
        { key: 'liquido', label: 'Líquido', defaultSelected: true },
        { key: 'transferencia', label: 'Transferencia', defaultSelected: false },
        { key: 'num_cuenta', label: 'Número de Cuenta', defaultSelected: false },
        { key: 'fec_pago', label: 'Fecha de Pago', defaultSelected: true },
    ];

    useEffect(() => {
        if (formValues.anio && formValues.quincenas.length > 0) {
            const fetchData = async () => {
                try {
                    setIsLoading(true);
                    const quincenasString = formValues.quincenas.join('&quincena=');
                    const response = await fetch(`${API_BASE_URL}/consultaMovimientosVariasQuincenas?anio=${formValues.anio}&quincena=${quincenasString}`);
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos: ' + response.statusText);
                    }
                    const data = await response.json();
                    setData(data);
                } catch (error) {
                    console.error('Error al obtener los datos:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [formValues]);

    const handleColumnSelectionChange = (selectedColumns) => {
        setVisibleColumns(selectedColumns);
        setShowTable(true);
        setCollapseOpen(false);
    };

    const exportCSV = () => {
        const exportData = data.map(item => {
            let filtered = {};
            Object.keys(visibleColumns).forEach(key => {
                if (visibleColumns[key]) {
                    filtered[key] = item[key];
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

                const columns = availableColumns
                    .filter(col => visibleColumns[col.key])
                    .map(col => ({ header: col.label, dataKey: col.key }));

                const rows = data.map(item => {
                    let row = {};
                    availableColumns.forEach(col => {
                        if (visibleColumns[col.key]) {
                            row[col.key] = item[col.key];
                        }
                    });
                    return row;
                });

                doc.autoTable({
                    columns,
                    body: rows,
                });

                doc.save('comparacion_campos.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const exportData = data.map(item => {
                let filtered = {};
                Object.keys(visibleColumns).forEach(key => {
                    if (visibleColumns[key]) {
                        filtered[key] = item[key];
                    }
                });
                return filtered;
            });

            const worksheet = xlsx.utils.json_to_sheet(exportData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

            saveAsExcelFile(excelBuffer, 'comparacion_campos');
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

    const header = (
        <div className="flex justify-content-between align-items-center">
            <Typography variant="h4" className={styles.titulo}>Cambios por quincena</Typography>
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

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevValues => {
            const newValues = { ...prevValues };
            if (name === 'anio') {
                newValues.anio = value;
            } else if (name.startsWith('quincena')) {
                const index = parseInt(name.split('_')[1], 10);
                newValues.quincenas[index] = value;
            }
            return newValues;
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="card">
                <Toast ref={toast} />
                
                <Box className={styles.dropForm} mb={3}>
                    <Typography variant="h6" className={styles.exportText}>Parametros de consulta</Typography>
                    <form>
                        <div>
                            <InputText
                                name="anio"
                                value={formValues.anio}
                                onChange={handleFormChange}
                                placeholder="Año"
                                style={{ marginRight: '1rem' }}
                            />
                            {[0, 1, 2].map(i => (
                                <InputText
                                    key={i}
                                    name={`quincena_${i}`}
                                    value={formValues.quincenas[i]}
                                    onChange={handleFormChange}
                                    placeholder={`Quincena ${i + 1}`}
                                    style={{ marginRight: '1rem' }}
                                />
                            ))}
                            <Button
                                label="Consultar"
                                icon="pi pi-search"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowTable(true);
                                }}
                            />
                        </div>
                    </form>
                </Box>

                <Box className={styles.dropForm}>
                    <Button
                        type="button"
                        icon={`pi ${collapseOpen ? 'pi-chevron-up' : 'pi-chevron-down'}`}
                        severity="secondary"
                        rounded
                        onClick={() => setCollapseOpen(!collapseOpen)}
                        data-pr-tooltip="Configurar columnas"
                    />
                </Box>

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
                            icon="pi pi-file-pdf"
                            rounded
                            onClick={() => exportPdf()}
                            data-pr-tooltip="PDF"
                        />
                        <Button
                            type="button"
                            icon="pi pi-file-excel"
                            rounded
                            onClick={() => exportExcel()}
                            data-pr-tooltip="Excel"
                        />
                    </div>
                )}
                />

                <Collapse in={collapseOpen}>
                    <Box>
                        <ColumnSelector
                            availableColumns={availableColumns}
                            selectedColumns={visibleColumns}
                            onChange={handleColumnSelectionChange}
                        />
                    </Box>
                </Collapse>

                {isLoading ? (
                    <div className="p-d-flex p-ai-center p-jc-center" style={{ height: '200px' }}>
                        <ProgressBar mode="indeterminate" />
                    </div>
                ) : (
                    showTable && (
                        <div className="datatable-doc-demo">
                            <DataTable
                                ref={dt}
                                value={data}
                                globalFilter={globalFilter}
                                header={header}
                                className="datatable-responsive"
                            >
                                {availableColumns.map((col) => {
                                    if (visibleColumns[col.key]) {
                                        return (
                                            <Column
                                                key={col.key}
                                                field={col.key}
                                                header={col.label}
                                                sortable
                                                filter
                                                style={{ minWidth: '12rem' }}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </DataTable>
                        </div>
                    )
                )}
            </div>
        </ThemeProvider>
    );
}
