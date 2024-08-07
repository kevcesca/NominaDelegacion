'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './CrudConceptos.module.css';

const CrudConceptos = () => {
    let emptyConcepto = {
        id_concepto: '',
        nombre_concepto: ''
    };

    const [conceptos, setConceptos] = useState([]);
    const [conceptoDialog, setConceptoDialog] = useState(false);
    const [deleteConceptoDialog, setDeleteConceptoDialog] = useState(false);
    const [concepto, setConcepto] = useState(emptyConcepto);
    const [selectedConceptos, setSelectedConceptos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        axios.get('http://192.168.100.77:8080/cat/conceptos')
            .then(response => {
                setConceptos(response.data);
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error fetching data', life: 3000 });
            });
    }, []);

    const openNew = () => {
        setConcepto(emptyConcepto);
        setSubmitted(false);
        setConceptoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setConceptoDialog(false);
    };

    const hideDeleteConceptoDialog = () => {
        setDeleteConceptoDialog(false);
    };

    const saveConcepto = () => {
        setSubmitted(true);

        if (concepto.nombre_concepto.trim() && concepto.id_concepto.trim()) {
            let _conceptos = [...conceptos];
            let _concepto = { ...concepto };

            if (concepto.id_concepto) {
                axios.post(`http://192.168.100.77:8080/actualizarConcepto`, null, {
                    params: {
                        id_concepto: _concepto.id_concepto,
                        nombre_concepto: _concepto.nombre_concepto
                    }
                }).then(response => {
                    const index = findIndexById(concepto.id_concepto);
                    _conceptos[index] = _concepto;
                    setConceptos(_conceptos);
                    setConceptoDialog(false);
                    setConcepto(emptyConcepto);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Concepto Updated', life: 3000 });
                }).catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error updating concepto', life: 3000 });
                });
            } else {
                axios.post(`http://192.168.100.77:8080/insertarConcepto`, null, {
                    params: {
                        id_concepto: _concepto.id_concepto,
                        nombre_concepto: _concepto.nombre_concepto
                    }
                }).then(response => {
                    _concepto.id_concepto = createId();
                    _conceptos.push(_concepto);
                    setConceptos(_conceptos);
                    setConceptoDialog(false);
                    setConcepto(emptyConcepto);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Concepto Created', life: 3000 });
                }).catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error creating concepto', life: 3000 });
                });
            }
        }
    };

    const editConcepto = (concepto) => {
        setConcepto({ ...concepto });
        setConceptoDialog(true);
    };

    const confirmDeleteConcepto = (concepto) => {
        setConcepto(concepto);
        setDeleteConceptoDialog(true);
    };

    const deleteConcepto = () => {
        axios.post(`http://192.168.100.77:8080/eliminarConcepto`, null, {
            params: {
                id_concepto: concepto.id_concepto
            }
        }).then(response => {
            let _conceptos = conceptos.filter(val => val.id_concepto !== concepto.id_concepto);
            setConceptos(_conceptos);
            setDeleteConceptoDialog(false);
            setConcepto(emptyConcepto);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Concepto Deleted', life: 3000 });
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error deleting concepto', life: 3000 });
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < conceptos.length; i++) {
            if (conceptos[i].id_concepto === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable([{ title: 'ID', dataKey: 'id_concepto' }, { title: 'Nombre', dataKey: 'nombre_concepto' }], conceptos);
                doc.save('conceptos.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(conceptos);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'conceptos');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Crear" icon="pi pi-plus" className={`${styles['button-gold']} ${styles['button-margin']}`} onClick={openNew} />
                <Button label="Eliminar" icon="pi pi-trash" className={`${styles['button-red']} ${styles['button-margin']}`} onClick={confirmDeleteConcepto} disabled={!selectedConceptos || !selectedConceptos.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex align-items-center justify-content-end gap-2">
                <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className={`mr-2 ${styles['button-gold']} ${styles['button-margin']}`} onClick={() => editConcepto(rowData)} />
                <Button icon="pi pi-trash" rounded outlined className={`${styles['button-red']} ${styles['button-margin']}`} onClick={() => confirmDeleteConcepto(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Conceptos</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const conceptoDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined className={`${styles['button-teal']} ${styles['button-margin']}`} onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className={`${styles['button-gold']} ${styles['button-margin']}`} onClick={saveConcepto} />
        </React.Fragment>
    );

    const deleteConceptoDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined className={`${styles['button-teal']} ${styles['button-margin']}`} onClick={hideDeleteConceptoDialog} />
            <Button label="Yes" icon="pi pi-check" className={`${styles['button-red']} ${styles['button-margin']}`} onClick={deleteConcepto} />
        </React.Fragment>
    );

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _concepto = { ...concepto };
        _concepto[`${name}`] = val;
        setConcepto(_concepto);
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={conceptos} selection={selectedConceptos} onSelectionChange={(e) => setSelectedConceptos(e.value)} dataKey="id_concepto" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} globalFilter={globalFilter} header={header} className="p-datatable-customers">
                    <Column selectionMode="multiple" exportable={false} style={{ minWidth: '50px' }}></Column>
                    <Column field="id_concepto" header="ID Concepto" sortable style={{ minWidth: '50px' }}></Column>
                    <Column field="nombre_concepto" header="Nombre Concepto" sortable style={{ minWidth: '200px' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '100px' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={conceptoDialog} style={{ width: '450px' }} header="Concepto Details" modal className="p-fluid" footer={conceptoDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="id_concepto">ID Concepto</label>
                    <InputText id="id_concepto" value={concepto.id_concepto} onChange={(e) => onInputChange(e, 'id_concepto')} required autoFocus className={classNames({ 'p-invalid': submitted && !concepto.id_concepto })} />
                    {submitted && !concepto.id_concepto && <small className="p-error">ID Concepto is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="nombre_concepto">Nombre Concepto</label>
                    <InputText id="nombre_concepto" value={concepto.nombre_concepto} onChange={(e) => onInputChange(e, 'nombre_concepto')} required className={classNames({ 'p-invalid': submitted && !concepto.nombre_concepto })} />
                    {submitted && !concepto.nombre_concepto && <small className="p-error">Nombre Concepto is required.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteConceptoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteConceptoDialogFooter} onHide={hideDeleteConceptoDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {concepto && <span>Are you sure you want to delete <b>{concepto.nombre_concepto}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default CrudConceptos;
