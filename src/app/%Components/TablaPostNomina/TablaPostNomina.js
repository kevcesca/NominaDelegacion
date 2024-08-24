'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaPostNomina.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import API_BASE_URL from '../../%Config/apiConfig';

export default function TablaPostNomina({ quincena, anio, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const [archivos, setArchivos] = useState([]);
    const [isUploadDisabled, setIsUploadDisabled] = useState(false);

    useEffect(() => {
        fetchArchivosData();
    }, [anio, quincena]);

    const fetchArchivosData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/listArchivos`, {
                params: {
                    anio: anio,
                    quincena: quincena,
                },
            });

            const data = response.data
                .filter(item => item.nombre_nomina === 'Compuesta')
                .map(item => ({
                    idx: item.idx,
                    nombreArchivo: item.nombre_archivo || 'Vacío',
                    tipoNomina: 'Compuesta',
                    archivoNombre: item.nombre_archivo,
                    fechaCarga: item.fecha_carga,
                    userCarga: item.user_carga,
                    aprobado: item.aprobado,
                    aprobado2: item.aprobado2,
                }));

            setArchivos(data);
            setIsUploadDisabled(data.length >= 2); // Desactivar botón de carga si hay 2 o más archivos
        } catch (error) {
            console.error('Error fetching archivos data', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los archivos', life: 3000 });
        }
    };

    const formatDate = (value) => {
        if (!value) return '';
        const date = new Date(value);
        return `${date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setProgress(0);
        setUploaded(false);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('extra', '');

        const uploadURL = `${API_BASE_URL}/validarYSubirNomina?quincena=${quincena}&anio=${String(anio)}&tipo=Compuesta&usuario=${session?.user?.name || 'unknown'}`;

        try {
            const response = await axios.post(uploadURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(progress);
                },
            });

            setProgress(100);
            setUploaded(true);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Archivo subido correctamente: ${response.data.message}`, life: 3000 });
            fetchArchivosData(); // Refrescar la tabla después de subir el archivo
        } catch (error) {
            console.error('Error uploading file', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    const handleFileDownload = async (tipoNomina, archivoNombre) => {
        const nombreSinExtension = archivoNombre.replace(/\.[^/.]+$/, "");

        try {
            const response = await axios.get(`${API_BASE_URL}/download`, {
                params: {
                    quincena: quincena,
                    anio: anio,
                    tipo: tipoNomina,
                    nombre: nombreSinExtension,
                },
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
        const isDisabled = rowData.aprobado !== true || rowData.aprobado2 !== true;

        return (
            <button
                className={styles.downloadButton}
                onClick={() => handleFileDownload(rowData.tipoNomina, rowData.archivoNombre)}
                disabled={isDisabled}
                title={isDisabled ? 'No se puede descargar, aún no está aprobado' : ''}
            >
                <i className="pi pi-download"></i>
            </button>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            <DataTable value={archivos} sortMode="multiple" className={styles.dataTable} paginator rows={10}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '30%' }}></Column>
                <Column field="tipoNomina" header="TIPO DE NÓMINA" sortable style={{ width: '20%' }}></Column>
                <Column field="userCarga" header="USUARIO" sortable style={{ width: '20%' }}></Column>
                <Column field="fechaCarga" header="FECHA DE CARGA" sortable body={(rowData) => formatDate(rowData.fechaCarga)} style={{ width: '20%' }}></Column>
                <Column body={descargaTemplate} header="DESCARGA" style={{ width: '10%' }}></Column>
            </DataTable>
            <div className={styles.uploadContainer}>
                <Button
                    variant="contained"
                    component="label"
                    className={styles.uploadButton}
                    disabled={isUploadDisabled}
                >
                    Subir Nómina Compuesta
                    <input type="file" hidden onChange={handleFileUpload} accept=".xlsx" />
                </Button>
            </div>
        </div>
    );
}
