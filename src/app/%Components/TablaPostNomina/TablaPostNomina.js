'use client'
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PostNominaService } from './PostNominaService'; // Asegúrate de crear este servicio
import styles from './TablaPostNomina.module.css';

export default function TablaPostNomina() {
    const [archivos, setArchivos] = useState([]);

    useEffect(() => {
        PostNominaService.getArchivos().then(data => setArchivos(data));
    }, []);

    const descargaTemplate = (rowData) => {
        return (
            <button className={styles.downloadButton}>
                <i className="pi pi-download"></i>
            </button>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            <DataTable value={archivos} sortMode="multiple" className={styles.dataTable}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '30%' }}></Column>
                <Column field="fechaCarga" header="FECHA DE CARGA" sortable style={{ width: '20%' }}></Column>
                <Column field="identificadorDatos" header="IDENTIFICADOR DE DATOS X ARCHIVO" sortable style={{ width: '30%' }}></Column>
                <Column body={descargaTemplate} header="DESCARGA" style={{ width: '20%' }}></Column>
            </DataTable>
        </div>
    );
}
