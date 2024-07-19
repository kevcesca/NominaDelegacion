'use client';
import React, { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'primereact/resources/themes/saga-blue/theme.css';  // o el tema que estés usando
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './ConfigurableTable.module.css'; // Asegúrate de tener este archivo para los estilos personalizados

const ViewOnlyTable = ({ year, data }) => {
    const dt = useRef(null);

    const cols = [
        { field: 'quincena', header: 'Quincena' },
        { field: 'capturaImportacion', header: 'Captura e Importación' },
        { field: 'revision1', header: 'Revisiones y Cálculo de Nómina 1' },
        { field: 'revision2', header: 'Revisiones y Cálculo de Nómina 2' },
        { field: 'preNomina', header: 'Pre-Nómina' },
        { field: 'validacionPreNomina', header: 'Validación de Pre-Nómina' },
        { field: 'atencion1', header: 'Atención a los Problemas 1' },
        { field: 'atencion2', header: 'Atención a los Problemas 2' },
        { field: 'cierre', header: 'Cierre de Proceso' },
        { field: 'publicacionWeb1', header: 'Publicación en Web 1' },
        { field: 'traslado', header: 'Traslado de la CLC' },
        { field: 'ministracion', header: 'Ministración de Tarjetas' },
        { field: 'diasPago1', header: 'Días de Pago 1' },
        { field: 'diasPago2', header: 'Días de Pago 2' },
        { field: 'cierreCaptura', header: 'Cierre de Captura' },
        { field: 'publicacionWeb2', header: 'Publicación en Web 2' }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        const doc = new jsPDF('landscape');
        doc.autoTable({
            head: [exportColumns.map(col => col.title)],
            body: data.map(row => exportColumns.map(col => new Date(row[col.dataKey]).toLocaleDateString()))
        });
        doc.save(`Calendario_${year}.pdf`);
    };

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(row => {
            const rowData = {};
            cols.forEach(col => {
                rowData[col.header] = new Date(row[col.field]).toLocaleDateString();
            });
            return rowData;
        }));
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAsExcelFile(excelBuffer, `Calendario_${year}`);
    };

    const saveAsExcelFile = (buffer, fileName) => {
        const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
    };

    const header = (
        <div className={`${styles.flex} ${styles.alignItemsCenter} ${styles.justifyContentEnd} ${styles.gap2}`}>
            <Button type="button" icon="pi pi-file" onClick={exportCSV} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );

    const columnGroup = (
        <ColumnGroup>
            <Row>
                <Column header="Quincena" rowSpan={2} />
                <Column header="Captura e Importación" rowSpan={2} />
                <Column header="Revisiones y Cálculo de Nómina" colSpan={2} />
                <Column header="Pre-Nómina" rowSpan={2} />
                <Column header="Validación de Pre-Nómina" rowSpan={2} />
                <Column header="Atención a los Problemas" colSpan={2} />
                <Column header="Cierre de Proceso" rowSpan={2} />
                <Column header="Publicación en Web" rowSpan={2} />
                <Column header="Traslado de la CLC" rowSpan={2} />
                <Column header="Ministración de Tarjetas" rowSpan={2} />
                <Column header="Días de Pago" colSpan={2} />
                <Column header="Cierre de Captura" rowSpan={2} />
                <Column header="Publicación en Web" rowSpan={2} />
            </Row>
            <Row>
                <Column header="1" />
                <Column header="2" />
                <Column header="1" />
                <Column header="2" />
                <Column header="1" />
                <Column header="2" />
            </Row>
        </ColumnGroup>
    );

    return (
        <div className={styles.card}>
            <Tooltip target=".export-buttons>button" position="bottom" />
            <h3>Calendario de Procesos de la Nómina {year}</h3>
            <div className={styles.dataTableWrapper}>
                <DataTable ref={dt} value={data} header={header} scrollable scrollHeight="500px" columnGroup={columnGroup}>
                    {cols.map((col, index) => (
                        <Column key={index} field={col.field} header={col.header} style={{ minWidth: '150px' }} />
                    ))}
                </DataTable>
            </div>
        </div>
    );
};

export default ViewOnlyTable;
