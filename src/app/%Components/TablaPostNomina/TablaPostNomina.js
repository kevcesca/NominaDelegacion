'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaPostNomina.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import API_BASE_URL from '../../%Config/apiConfig';

export default function TablaPostNomina({ quincena, anio, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const router = useRouter();
    const [archivos, setArchivos] = useState([]);

    useEffect(() => {
        fetchArchivosData();
    }, [anio, quincena]);

    const fetchArchivosData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/listArchivos?anio=${anio}&quincena=${quincena}`);
            const data = response.data.map(item => ({
                idx: item.idx,
                nombreArchivo: item.nombre_archivo || 'Vacío',
                tipoNomina: item.nombre_nomina,
                archivoNombre: item.nombre_archivo,
                fechaCarga: item.fecha_carga,
                userCarga: item.user_carga,
            }));
            setArchivos(data);
        } catch (error) {
            console.error('Error fetching archivos data', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los archivos', life: 3000 });
        }
    };

    const removeFileExtension = (filename) => {
        return filename.replace(/\.[^/.]+$/, "");
    };

    const handleFileDownload = async (tipoNomina, archivoNombre) => {
        if (!tipoNomina) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Tipo de nómina no definido', life: 3000 });
            console.error('Tipo de nómina no definido');
            return;
        }

        const nombreSinExtension = removeFileExtension(archivoNombre);

        try {
            const response = await axios.get(`${API_BASE_URL}/download?quincena=${quincena}&anio=${String(anio)}&tipo=${tipoNomina}&nombre=${nombreSinExtension}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', archivoNombre || `reporte_${tipoNomina}_${anio}_${quincena}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Archivo descargado correctamente', life: 3000 });
        } catch (error) {
            console.error('Error downloading file', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al descargar el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    const descargaTemplate = (rowData) => {
        return (
            <button className={styles.downloadButton} onClick={() => handleFileDownload(rowData.tipoNomina, rowData.archivoNombre)}>
                <i className="pi pi-download"></i>
            </button>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            <DataTable value={archivos} sortMode="multiple" className={styles.dataTable} paginator rows={10}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '40%' }}></Column>
                <Column field="tipoNomina" header="TIPO DE NÓMINA" sortable style={{ width: '30%' }}></Column>
                <Column field="userCarga" header="USUARIO" sortable style={{ width: '20%' }}></Column>
                <Column body={descargaTemplate} header="DESCARGA" style={{ width: '10%' }}></Column>
            </DataTable>
        </div>
    );
}
