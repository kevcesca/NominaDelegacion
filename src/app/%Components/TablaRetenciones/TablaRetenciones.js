'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaRetenciones.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import API_BASE_URL from '../../%Config/apiConfig';

export default function TablaRetenciones({ anio, mes, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const [retenciones, setRetenciones] = useState([
        { nombreArchivo: 'Vacío', paramTipoEstado: 'retencion', archivoNombre: '', mes: '' }
    ]);

    useEffect(() => {
        fetchRetencionesData();
    }, [anio, mes]);

    const fetchRetencionesData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/listArchivos?anio=${anio}&mes=${mes}&tipo=Retencion`);
            const data = response.data.reduce((acc, item) => {
                const tipoIndex = acc.findIndex(row => row.paramTipoEstado === item.nombre_estado);
                if (tipoIndex !== -1) {
                    acc[tipoIndex] = {
                        nombreArchivo: item.nombre_archivo || 'Vacío',
                        paramTipoEstado: item.nombre_estado,
                        archivoNombre: item.nombre_archivo || '',
                        mes: item.mes || ''
                    };
                }
                return acc;
            }, [...retenciones]);

            setRetenciones(data);
        } catch (error) {
            console.error('Error fetching retenciones data', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar las retenciones', life: 3000 });
        }
    };

    const handleFileUpload = async (event, tipoEstado) => {
        if (!tipoEstado || !mes) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un mes y tipo de estado', life: 3000 });
            console.error('Mes o tipo de estado no definidos');
            return;
        }

        const file = event.target.files[0];
        if (!file) return;

        setProgress(0);
        setUploaded(false);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('extra', '');  // Siempre enviar el parámetro extra

        try {
            const response = await axios.post(`${API_BASE_URL}/uploads?anio=${String(anio)}&mes=${mes}&tipo=${capitalizeFirstLetter(tipoEstado)}&usuario=${session?.user?.name || 'unknown'}`, formData, {
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
            console.log('File uploaded successfully', response.data);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Archivo subido correctamente: ${response.data.message}`, life: 3000 });

            fetchRetencionesData();
        } catch (error) {
            console.error('Error uploading file', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    const handleFileDownload = async (tipoEstado, archivoNombre) => {
        if (!tipoEstado || !mes) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un mes y tipo de estado', life: 3000 });
            console.error('Mes o tipo de estado no definidos');
            return;
        }

        const nombreSinExtension = removeFileExtension(archivoNombre);

        try {
            const response = await axios.get(`${API_BASE_URL}/download?anio=${String(anio)}&mes=${mes}&tipo=${capitalizeFirstLetter(tipoEstado)}&nombre=${nombreSinExtension}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', archivoNombre || `reporte_${tipoEstado}_${anio}_${mes}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Archivo descargado correctamente', life: 3000 });
        } catch (error) {
            console.error('Error downloading file', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al descargar el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    const uploadTemplate = (rowData) => {
        return (
            <div>
                <Button variant="contained" component="label" className={styles.uploadButton} disabled={!mes}>
                    Subir archivo
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, rowData.paramTipoEstado)} accept=".xlsx" />
                </Button>
            </div>
        );
    };

    const descargaTemplate = (rowData) => {
        return (
            <button className={styles.downloadButton} onClick={() => handleFileDownload(rowData.paramTipoEstado, rowData.archivoNombre)} disabled={!mes}>
                <i className="pi pi-download"></i>
            </button>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            <DataTable value={retenciones} sortMode="multiple" className={styles.dataTable}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '50%' }}></Column>
                <Column body={uploadTemplate} header="SUBIR ARCHIVO" style={{ width: '25%' }}></Column>
                <Column body={descargaTemplate} header="DESCARGA" style={{ width: '25%' }}></Column>
            </DataTable>
        </div>
    );
}
