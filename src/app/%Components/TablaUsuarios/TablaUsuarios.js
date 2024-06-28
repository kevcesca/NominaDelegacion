'use client'
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from './DataUsuarios.jsx'; // Ajusta la ruta si es necesario
import styles from './TablaUsuarios.module.css';

export default function TablaUsuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        ProductService.getUsuarios().then(data => setUsuarios(data));
    }, []);

    const actionTemplate = () => {
        return (
            <div className={styles.actions}>
                <i className={`pi pi-ellipsis-v ${styles['action-icon']}`}></i>
            </div>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            <DataTable value={usuarios} sortMode="multiple" className={styles.dataTable}>
                <Column body={actionTemplate} header="ACCIONES" headerClassName={styles['dataTable-header']} className={styles['dataTable-row']} style={{ width: '10%' }}></Column>
                <Column field="id" header="ID" sortable headerClassName={styles['dataTable-header']} className={styles['dataTable-row']} style={{ width: '10%' }}></Column>
                <Column field="fechaAlta" header="FECHA ALTA" sortable headerClassName={styles['dataTable-header']} className={styles['dataTable-row']} style={{ width: '15%' }}></Column>
                <Column field="nombre" header="NOMBRE" sortable headerClassName={styles['dataTable-header']} className={styles['dataTable-row']} style={{ width: '15%' }}></Column>
                <Column field="apellidos" header="APELLIDOS" sortable headerClassName={styles['dataTable-header']} className={styles['dataTable-row']} style={{ width: '20%' }}></Column>
                <Column field="email" header="EMAIL" sortable headerClassName={styles['dataTable-header']} className={styles['dataTable-row']} style={{ width: '25%' }}></Column>
                <Column field="activo" header="ACTIVO" sortable headerClassName={styles['dataTable-header']} className={styles['dataTable-row']} style={{ width: '10%' }}></Column>
            </DataTable>
        </div>
    );
}