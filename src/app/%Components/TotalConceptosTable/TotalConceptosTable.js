// src/app/%Components/TotalConceptosTable.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const TotalConceptosTable = () => {
    const [records, setRecords] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://192.168.100.77:8080/totalConceptos');
                setRecords(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error fetching data', life: 3000 });
            }
        };

        fetchData();
    }, []);

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default();
                doc.autoTable({
                    head: [['Fecha', 'Código', 'Descripción', 'Transacción', 'Cargo', 'Abono']],
                    body: records.map(record => [record.fecha_val, record.codigo, record.descrip, record.transac, record.cargo, record.abono])
                });
                doc.save('totalConceptos.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(records);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

            saveAsExcelFile(excelBuffer, 'totalConceptos');
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
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Total Conceptos</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <Toolbar className="mb-4" right={() => (
                <div className="flex align-items-center justify-content-end gap-2">
                    <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                    <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                    <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
                </div>
            )} />
            <DataTable
                ref={dt}
                value={records}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                responsiveLayout="scroll"
                globalFilter={globalFilter}
                header={header}
            >
                <Column field="fecha_val" header="Fecha" sortable style={{ minWidth: '150px' }}></Column>
                <Column field="codigo" header="Código" sortable style={{ minWidth: '100px' }}></Column>
                <Column field="descrip" header="Descripción" sortable style={{ minWidth: '200px' }}></Column>
                <Column field="transac" header="Transacción" sortable style={{ minWidth: '100px' }}></Column>
                <Column field="cargo" header="Cargo" sortable style={{ minWidth: '150px' }}></Column>
                <Column field="abono" header="Abono" sortable style={{ minWidth: '150px' }}></Column>
            </DataTable>
        </div>
    );
};

export default TotalConceptosTable;
