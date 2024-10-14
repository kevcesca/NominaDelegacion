'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './CrudCheques.module.css';
import API_BASE_URL from '../../%Config/apiConfig'; // Asegúrate de ajustar tu configuración

const CrudCheques = () => {
    let emptyCheque = {
        cheque: '',
        poliza: '',
        clc: '',
        id_empleado: '',
        beneficiario: '',
        nomina: '',
        sustituye_cheque: '',
        monto: ''
    };

    const [cheques, setCheques] = useState([]);
    const [chequeDialog, setChequeDialog] = useState(false);
    const [deleteChequeDialog, setDeleteChequeDialog] = useState(false);
    const [editChequeDialog, setEditChequeDialog] = useState(false);
    const [cheque, setCheque] = useState(emptyCheque);
    const [selectedCheques, setSelectedCheques] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/cheques`)
            .then(response => {
                setCheques(response.data);
            })
            .catch(error => {
                console.error("Error fetching cheques: ", error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error fetching data', life: 3000 });
            });
    }, []);

    const openNew = () => {
        setCheque(emptyCheque);
        setSubmitted(false);
        setChequeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setChequeDialog(false);
        setEditChequeDialog(false);
    };

    const hideDeleteChequeDialog = () => {
        setDeleteChequeDialog(false);
    };

    const saveCheque = () => {
        setSubmitted(true);

        if (cheque.cheque.trim()) {
            let _cheques = [...cheques];
            let _cheque = { ...cheque };

            // Llamada a la API para guardar el cheque
            axios.post(`${API_BASE_URL}/cheques`, _cheque)
                .then(response => {
                    _cheques.push(_cheque);
                    setCheques(_cheques);
                    setChequeDialog(false);
                    setCheque(emptyCheque);
                    toast.current.show({ severity: 'success', summary: 'Cheque Created', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error creating cheque', life: 3000 });
                });
        }
    };

    const updateCheque = () => {
        setSubmitted(true);

        if (cheque.cheque.trim()) {
            let _cheques = [...cheques];
            let _cheque = { ...cheque };

            // Llamada a la API para actualizar el cheque
            axios.put(`${API_BASE_URL}/cheques/${_cheque.cheque}`, _cheque)
                .then(response => {
                    const index = findIndexById(cheque.cheque);
                    _cheques[index] = _cheque;
                    setCheques(_cheques);
                    setEditChequeDialog(false);
                    setCheque(emptyCheque);
                    toast.current.show({ severity: 'success', summary: 'Cheque Updated', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error updating cheque', life: 3000 });
                });
        }
    };

    const editCheque = (cheque) => {
        setCheque({ ...cheque });
        setEditChequeDialog(true);
    };

    const confirmDeleteCheque = (cheque) => {
        setCheque(cheque);
        setDeleteChequeDialog(true);
    };

    const deleteCheque = () => {
        axios.delete(`${API_BASE_URL}/cheques/${cheque.cheque}`)
            .then(response => {
                let _cheques = cheques.filter(val => val.cheque !== cheque.cheque);
                setCheques(_cheques);
                setDeleteChequeDialog(false);
                setCheque(emptyCheque);
                toast.current.show({ severity: 'success', summary: 'Cheque Deleted', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error deleting cheque', life: 3000 });
            });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < cheques.length; i++) {
            if (cheques[i].cheque === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Crear" icon="pi pi-plus" className={styles['button-gold']} onClick={openNew} />
                <Button label="Eliminar" icon="pi pi-trash" className={styles['button-red']} onClick={confirmDeleteCheque} disabled={!selectedCheques || !selectedCheques.length} />
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className={styles['button-gold']} onClick={() => editCheque(rowData)} />
                <Button icon="pi pi-trash" rounded outlined className={styles['button-red']} onClick={() => confirmDeleteCheque(rowData)} />
            </React.Fragment>
        );
    };

    const chequeDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveCheque} />
        </React.Fragment>
    );

    const deleteChequeDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteChequeDialog} />
            <Button label="Yes" icon="pi pi-check" onClick={deleteCheque} />
        </React.Fragment>
    );

    const header = (
        <div className="table-header">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={cheques} selection={selectedCheques} onSelectionChange={(e) => setSelectedCheques(e.value)} dataKey="cheque" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="cheque" header="Cheque" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="poliza" header="Poliza" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="clc" header="CLC" sortable style={{ minWidth: '100px' }}></Column>
                    <Column field="id_empleado" header="ID Empleado" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="beneficiario" header="Beneficiario" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="nomina" header="Nomina" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="sustituye_cheque" header="Sustituye Cheque" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="monto" header="Monto" sortable style={{ minWidth: '100px' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '120px' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={chequeDialog} style={{ width: '450px' }} header="Detalles del Cheque" modal className="p-fluid" footer={chequeDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="cheque">Cheque</label>
                    <InputText id="cheque" value={cheque.cheque} onChange={(e) => setCheque({ ...cheque, cheque: e.target.value })} required autoFocus />
                </div>
                <div className="field">
                    <label htmlFor="poliza">Poliza</label>
                    <InputText id="poliza" value={cheque.poliza} onChange={(e) => setCheque({ ...cheque, poliza: e.target.value })} required />
                </div>
                <div className="field">
                    <label htmlFor="clc">CLC</label>
                    <InputText id="clc" value={cheque.clc} onChange={(e) => setCheque({ ...cheque, clc: e.target.value })} required />
                </div>
                <div className="field">
                    <label htmlFor="id_empleado">ID Empleado</label>
                    <InputText id="id_empleado" value={cheque.id_empleado} onChange={(e) => setCheque({ ...cheque, id_empleado: e.target.value })} required />
                </div>
                <div className="field">
                    <label htmlFor="beneficiario">Beneficiario</label>
                    <InputText id="beneficiario" value={cheque.beneficiario} onChange={(e) => setCheque({ ...cheque, beneficiario: e.target.value })} required />
                </div>
                <div className="field">
                    <label htmlFor="nomina">Nomina</label>
                    <InputText id="nomina" value={cheque.nomina} onChange={(e) => setCheque({ ...cheque, nomina: e.target.value })} required />
                </div>
                <div className="field">
                    <label htmlFor="sustituye_cheque">Sustituye Cheque</label>
                    <InputText id="sustituye_cheque" value={cheque.sustituye_cheque} onChange={(e) => setCheque({ ...cheque, sustituye_cheque: e.target.value })} required />
                </div>
                <div className="field">
                    <label htmlFor="monto">Monto</label>
                    <InputText id="monto" value={cheque.monto} onChange={(e) => setCheque({ ...cheque, monto: e.target.value })} required />
                </div>
            </Dialog>

            <Dialog visible={deleteChequeDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteChequeDialogFooter} onHide={hideDeleteChequeDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {cheque && <span>¿Está seguro de que desea eliminar el cheque <b>{cheque.cheque}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default CrudCheques;
