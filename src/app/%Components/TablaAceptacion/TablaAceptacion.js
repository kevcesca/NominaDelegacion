// src/app/%Components/ComparativaTable.js
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { UserService } from './UserService'; // Asegúrate de tener este servicio configurado para obtener datos
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const ComparativaTable = () => {
    const [records, setRecords] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        UserService.getComparativaData().then(data => setRecords(data));
    }, []);

    const approveTemplate = (rowData) => {
        return (
            <div className="p-field-radiobutton">
                <RadioButton inputId={`approve${rowData.key}`} name={rowData.key} value="Aprobar" onChange={(e) => onRadioChange(e, rowData)} checked={rowData.status === 'Aprobar'} />
                <label htmlFor={`approve${rowData.key}`}>Aprobar</label>
                <RadioButton inputId={`cancel${rowData.key}`} name={rowData.key} value="Cancelar" onChange={(e) => onRadioChange(e, rowData)} checked={rowData.status === 'Cancelar'} />
                <label htmlFor={`cancel${rowData.key}`}>Cancelar</label>
            </div>
        );
    };

    const onRadioChange = (e, rowData) => {
        let updatedRecords = [...records];
        let recordIndex = updatedRecords.findIndex(record => record.key === rowData.key);
        updatedRecords[recordIndex] = { ...rowData, status: e.value };
        setRecords(updatedRecords);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default();
                doc.autoTable({
                    head: [['Key', 'Año', 'Quincena', 'Tipo Nómina', 'Usuario', 'Fecha Carga', 'Deducciones', 'Prestaciones', 'Líquido']],
                    body: records.map(record => [record.key, record.anio, record.quincena, record.tipo_nomina, record.usuario, record.fecha_carga, record.deducciones, record.prestaciones, record.liquido])
                });
                doc.save('comparativa.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(records);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

            saveAsExcelFile(excelBuffer, 'comparativa');
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
        <div>
            <Toast ref={toast} />
            <Toolbar className="mb-4" right={() => (
                <div className="flex align-items-center justify-content-end gap-2">
                    <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV()} data-pr-tooltip="CSV" />
                    <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={() => exportExcel()} data-pr-tooltip="XLS" />
                    <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={() => exportPdf()} data-pr-tooltip="PDF" />
                </div>
            )} />
            <DataTable ref={dt} value={records} responsiveLayout="scroll">
                <Column field="key" header="Key" sortable />
                <Column field="anio" header="Año" sortable />
                <Column field="quincena" header="Quincena" sortable />
                <Column field="tipo_nomina" header="Tipo Nómina" sortable />
                <Column field="usuario" header="Usuario" sortable />
                <Column field="fecha_carga" header="Fecha Carga" sortable />
                <Column field="deducciones" header="Deducciones" sortable />
                <Column field="prestaciones" header="Prestaciones" sortable />
                <Column field="liquido" header="Líquido" sortable />
                <Column body={approveTemplate} header="Acción" />
            </DataTable>
        </div>
    );
};

export default ComparativaTable;
