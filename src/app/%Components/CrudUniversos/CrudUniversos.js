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
import styles from './CrudUniversos.module.css';
import API_BASE_URL from '../../%Config/apiConfig'

const CrudUniversos = () => {
    let emptyUniverso = {
        id_universo: '',
        nombre_nomina: ''
    };

    const [universos, setUniversos] = useState([]);
    const [universoDialog, setUniversoDialog] = useState(false);
    const [editUniversoDialog, setEditUniversoDialog] = useState(false);
    const [deleteUniversoDialog, setDeleteUniversoDialog] = useState(false);
    const [universo, setUniverso] = useState(emptyUniverso);
    const [selectedUniversos, setSelectedUniversos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/cat/universos`)
            .then(response => setUniversos(response.data))
            .catch(error => toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los datos', life: 3000 }));
    }, []);

    const openNew = () => {
        setUniverso(emptyUniverso);
        setSubmitted(false);
        setUniversoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUniversoDialog(false);
        setEditUniversoDialog(false);
    };

    const hideDeleteUniversoDialog = () => {
        setDeleteUniversoDialog(false);
    };

    const saveUniverso = () => {
        setSubmitted(true);

        if (universo.id_universo.trim() && universo.nombre_nomina.trim()) {
            let _universos = [...universos];
            let _universo = { ...universo };

            // Método GET para crear universo
            axios.get(`${API_BASE_URL}/insertarUniverso`, {
                params: {
                    id_universo: _universo.id_universo,
                    nombre_nomina: _universo.nombre_nomina
                }
            }).then(response => {
                _universos.push(_universo);
                setUniversos(_universos);
                setUniversoDialog(false);
                setUniverso(emptyUniverso);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Universo Created', life: 3000 });
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error creating universo', life: 3000 });
            });
        }
    };

    const updateUniverso = () => {
        setSubmitted(true);

        if (universo.id_universo.trim() && universo.nombre_nomina.trim()) {
            let _universos = [...universos];
            let _universo = { ...universo };

            // Método GET para actualizar universo
            axios.get(`${API_BASE_URL}/actualizarUniverso`, {
                params: {
                    id_universo: _universo.id_universo,
                    nombre_nomina: _universo.nombre_nomina
                }
            }).then(response => {
                const index = findIndexById(universo.id_universo);
                _universos[index] = _universo;
                setUniversos(_universos);
                setEditUniversoDialog(false);
                setUniverso(emptyUniverso);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Universo Updated', life: 3000 });
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error updating universo', life: 3000 });
            });
        }
    };

    const editUniverso = (universo) => {
        setUniverso({ ...universo });
        setEditUniversoDialog(true);
    };

    const confirmDeleteUniverso = (universo) => {
        setUniverso(universo);
        setDeleteUniversoDialog(true);
    };

    const deleteUniverso = () => {
        axios.get(`${API_BASE_URL}/eliminarUniverso`, {
            params: {
                id_universo: universo.id_universo
            }
        }).then(response => {
            let _universos = universos.filter(val => val.id_universo !== universo.id_universo);
            setUniversos(_universos);
            setDeleteUniversoDialog(false);
            setUniverso(emptyUniverso);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Universo Deleted', life: 3000 });
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error deleting universo', life: 3000 });
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < universos.length; i++) {
            if (universos[i].id_universo === id) {
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
                doc.autoTable([{ title: 'ID', dataKey: 'id_universo' }, { title: 'Nombre', dataKey: 'nombre_nomina' }], universos);
                doc.save('universos.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(universos);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'universos');
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
                <Button label="Eliminar" icon="pi pi-trash" className={`${styles['button-red']} ${styles['button-margin']}`} onClick={confirmDeleteUniverso} disabled={!selectedUniversos || !selectedUniversos.length} />
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
                <Button icon="pi pi-pencil" rounded outlined className={`mr-2 ${styles['button-gold']} ${styles['button-margin']}`} onClick={() => editUniverso(rowData)} />
                <Button icon="pi pi-trash" rounded outlined className={`${styles['button-red']} ${styles['button-margin']}`} onClick={() => confirmDeleteUniverso(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div>
            <span className={styles.flex}>
                <i className="pi pi-search" />
                <InputText className={styles.barra} type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const universoDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined className={`${styles['button-teal']} ${styles['button-margin']}`} onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className={`${styles['button-gold']} ${styles['button-margin']}`} onClick={saveUniverso} />
        </React.Fragment>
    );

    const editUniversoDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined className={`${styles['button-teal']} ${styles['button-margin']}`} onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className={`${styles['button-gold']} ${styles['button-margin']}`} onClick={updateUniverso} />
        </React.Fragment>
    );

    const deleteUniversoDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined className={`${styles['button-teal']} ${styles['button-margin']}`} onClick={hideDeleteUniversoDialog} />
            <Button label="Yes" icon="pi pi-check" className={`${styles['button-red']} ${styles['button-margin']}`} onClick={deleteUniverso} />
        </React.Fragment>
    );

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _universo = { ...universo };
        _universo[`${name}`] = val;
        setUniverso(_universo);
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={universos} selection={selectedUniversos} onSelectionChange={(e) => setSelectedUniversos(e.value)} dataKey="id_universo" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} globalFilter={globalFilter} header={header} className="p-datatable-customers">
                    <Column selectionMode="multiple" exportable={false} style={{ minWidth: '50px' }}></Column>
                    <Column field="id_universo" header="ID Universo" sortable style={{ minWidth: '50px' }}></Column>
                    <Column field="nombre_nomina" header="Nombre Nómina" sortable style={{ minWidth: '200px' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '100px' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={universoDialog} style={{ width: '450px' }} header="Universo Details" modal className="p-fluid" footer={universoDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="id_universo">ID Universo</label>
                    <InputText id="id_universo" value={universo.id_universo} onChange={(e) => onInputChange(e, 'id_universo')} required autoFocus className={classNames({ 'p-invalid': submitted && !universo.id_universo })} />
                    {submitted && !universo.id_universo && <small className="p-error">ID Universo is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="nombre_nomina">Nombre Nómina</label>
                    <InputText id="nombre_nomina" value={universo.nombre_nomina} onChange={(e) => onInputChange(e, 'nombre_nomina')} required className={classNames({ 'p-invalid': submitted && !universo.nombre_nomina })} />
                    {submitted && !universo.nombre_nomina && <small className="p-error">Nombre Nómina is required.</small>}
                </div>
            </Dialog>

            <Dialog visible={editUniversoDialog} style={{ width: '450px' }} header="Universo Details" modal className="p-fluid" footer={editUniversoDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="id_universo">ID Universo</label>
                    <InputText id="id_universo" value={universo.id_universo} onChange={(e) => onInputChange(e, 'id_universo')} required autoFocus className={classNames({ 'p-invalid': submitted && !universo.id_universo })} />
                    {submitted && !universo.id_universo && <small className="p-error">ID Universo is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="nombre_nomina">Nombre Nómina</label>
                    <InputText id="nombre_nomina" value={universo.nombre_nomina} onChange={(e) => onInputChange(e, 'nombre_nomina')} required className={classNames({ 'p-invalid': submitted && !universo.nombre_nomina })} />
                    {submitted && !universo.nombre_nomina && <small className="p-error">Nombre Nómina is required.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteUniversoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUniversoDialogFooter} onHide={hideDeleteUniversoDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {universo && <span>Are you sure you want to delete <b>{universo.nombre_nomina}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default CrudUniversos;
