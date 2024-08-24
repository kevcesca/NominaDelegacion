import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import API_BASE_URL from '../../%Config/apiConfig';
import styles from './ComparativeTable.module.css'

const ComparativaTable = ({ userRevision, quincena, anio }) => {  // Recibe quincena y anio como props
    const [records, setRecords] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Pasar los parámetros quincena y anio al endpoint
                const response = await axios.get(`${API_BASE_URL}/filtrarNominaCtrl`, {
                    params: {
                        quincena: quincena,
                        anio: anio
                    }
                });
                setRecords(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error fetching data', life: 3000 });
            }
        };

        if (quincena && anio) {
            fetchData();
        }
    }, [quincena, anio]); // Actualiza si quincena o anio cambian

    const approveTemplate = (rowData) => {
        return (
            <div className="p-field-radiobutton">
                <RadioButton inputId={`approve${rowData.idx}`} name={rowData.idx} value="Aprobar" onChange={(e) => onRadioChange(e, rowData)} checked={rowData.status === 'Aprobar'} />
                <label htmlFor={`approve${rowData.idx}`}>Aprobar</label>
                <RadioButton inputId={`cancel${rowData.idx}`} name={rowData.idx} value="Cancelar" onChange={(e) => onRadioChange(e, rowData)} checked={rowData.status === 'Cancelar'} />
                <label htmlFor={`cancel${rowData.idx}`}>Cancelar</label>
            </div>
        );
    };

    const onRadioChange = (e, rowData) => {
        let updatedRecords = [...records];
        let recordIndex = updatedRecords.findIndex(record => record.idx === rowData.idx);
        updatedRecords[recordIndex] = { ...rowData, status: e.value };
        setRecords(updatedRecords);
    };

    const handleConfirm = async () => {
        const confirmed = window.confirm("¿Son correctos los datos?");
        if (!confirmed) {
            return;
        }

        const updatePromises = records.map(async (record) => {
            if (!record.status) {
                return; // No actualizar los registros que no tienen un estado seleccionado
            }
            const params = new URLSearchParams({
                cancelado: record.status === 'Cancelar',
                aprobado: record.status === 'Aprobar',
                user_revision: userRevision,  // Aquí se usa el usuario recibido
                rol_user: 'Admin',  // Se añade el rol
                pendiente_dem: true, // Pendiente ahora es false
                idx: record.idx
            }).toString();

            try {
                await axios.get(`${API_BASE_URL}/validarNominaCtrl1?${params}`);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Estado de la nómina ${record.idx} actualizado correctamente`, life: 3000 });
            } catch (error) {
                console.error('Error updating record', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al actualizar la nómina ${record.idx}`, life: 3000 });
            }
        });

        await Promise.all(updatePromises.filter(Boolean)); // Filtrar las promesas nulas
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default();
                doc.autoTable({
                    head: [['Idx', 'Año', 'Quincena', 'Nombre Nómina', 'Nombre Archivo', 'Fecha Carga', 'Usuario Carga']],
                    body: records.map(record => [record.idx, record.anio, record.quincena, record.nombre_nomina, record.nombre_archivo, record.fecha_carga, record.user_carga])
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
            <h2 className={styles.header}>Aprobación 1</h2>
            <Toolbar className="mb-4" right={() => (
                <div className="flex align-items-center justify-content-end gap-2">
                    <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV()} data-pr-tooltip="CSV" />
                    <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={() => exportExcel()} data-pr-tooltip="XLS" />
                    <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={() => exportPdf()} data-pr-tooltip="PDF" />
                </div>
            )} />
            <DataTable ref={dt} value={records} responsiveLayout="scroll">
                <Column field="idx" header="Idx" sortable />
                <Column field="anio" header="Año" sortable />
                <Column field="quincena" header="Quincena" sortable />
                <Column field="nombre_nomina" header="Nombre Nómina" sortable />
                <Column field="nombre_archivo" header="Nombre Archivo" sortable />
                <Column field="fecha_carga" header="Fecha Carga" sortable />
                <Column field="user_carga" header="Usuario Carga" sortable />
                <Column body={approveTemplate} header="Acción" />
            </DataTable>
            <Button label='Confirmar' type="button" icon="pi pi-file-excel" severity="success" onClick={handleConfirm} />
        </div>
    );
};

export default ComparativaTable;
