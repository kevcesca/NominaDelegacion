'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext'; // <--- Asegúrate de tener esta línea
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './CrudCheques.module.css';
import API_BASE_URL from '../../%Config/apiConfig';

const CrudCheques = () => {
    const [cheques, setCheques] = useState([]);
    const [chequeDialog, setChequeDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const emptyCheque = {
        cheque: '',
        poliza: '',
        clc: '',
        id_empleado: '',
        beneficiario: '',
        nomina: '',
        sustituye_cheque: '',
        monto: ''
    };

    const [cheque, setCheque] = useState(emptyCheque);

    useEffect(() => {
        // Llamada a la API para obtener los cheques
        axios.get(`${API_BASE_URL}/cheques`)
            .then(response => {
                setCheques(response.data);
            })
            .catch(error => {
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
    };

    const saveCheque = () => {
        setSubmitted(true);
        if (cheque.cheque.trim()) {
            let _cheques = [...cheques];
            let _cheque = { ...cheque };

            // Llamada a la API para guardar el cheque
            axios.post(`${API_BASE_URL}/insertarCheque`, _cheque)
                .then(response => {
                    _cheques.push(_cheque);
                    setCheques(_cheques);
                    setChequeDialog(false);
                    setCheque(emptyCheque);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cheque Created', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error creating cheque', life: 3000 });
                });
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Generar Cheques" icon="pi " className={`${styles['button-gold']} ${styles['button-margin']}`} onClick={openNew} />
            </div>
        );
    };

    const header = (
        <div className="flex align-items-center">
            <span className={styles.flex}>
                <i className="pi pi-search" />
                <InputText className={styles.barra} type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className={`mr-2 ${styles['button-gold']} ${styles['button-margin']}`} onClick={() => editCheque(rowData)} />
                <Button icon="pi pi-trash" rounded outlined className={`${styles['button-red']} ${styles['button-margin']}`} onClick={() => confirmDeleteCheque(rowData)} />
            </React.Fragment>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={cheques} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} globalFilter={globalFilter} header={header} className="datatable-responsive">
                    <Column field="cheque" header="Cheque" sortable style={{ minWidth: '100px' }}></Column>
                    <Column field="poliza" header="Poliza" sortable style={{ minWidth: '100px' }}></Column>
                    <Column field="clc" header="CLC" sortable style={{ minWidth: '100px' }}></Column>
                    <Column field="id_empleado" header="ID Empleado" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="beneficiario" header="Beneficiario" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="nomina" header="Nomina" sortable style={{ minWidth: '100px' }}></Column>
                    <Column field="sustituye_cheque" header="Sustituye Cheque" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="monto" header="Monto" sortable style={{ minWidth: '100px' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '120px' }}></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default CrudCheques;
