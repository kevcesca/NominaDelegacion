// src/app/%Components/TablaFiniquitos/TablaFiniquitos.js
'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaPostNomina.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';

export default function TablaFiniquitos({ quincena, anio, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const router = useRouter();
    const [finiquitos, setFiniquitos] = useState([
        { nombreArchivo: 'Vacío', tipoNomina: 'Finiquitos', paramTipoNomina: 'finiquitos', archivoNombre: '' },
    ]);

    useEffect(() => {
        fetchFiniquitosData();
    }, [anio, quincena]);

    const fetchFiniquitosData = async () => {
        try {
            const response = await axios.get(`http://192.168.100.215:8080/listArchivos?anio=${anio}&quincena=${quincena}`);
            const data = response.data.reduce((acc, item) => {
                if (item.nombre_nomina === 'finiquitos') {
                    acc[0] = {
                        nombreArchivo: item.nombre_archivo || 'Vacío', // Si no hay archivo, ponemos "Vacío"
                        tipoNomina: 'Finiquitos',
                        paramTipoNomina: 'finiquitos',
                        archivoNombre: item.nombre_archivo || '' // Almacenamos el nombre del archivo recuperado
                    };
                }
                return acc;
            }, [...finiquitos]);

            setFiniquitos(data);
        } catch (error) {
            console.error('Error fetching finiquitos data', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los datos de finiquitos', life: 3000 });
        }
    };

    const removeFileExtension = (filename) => {
        return filename.replace(/\.[^/.]+$/, "");
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setProgress(0);
        setUploaded(false);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`http://192.168.100.215:8080/uploads?quincena=${quincena}&anio=${String(anio)}&tipo=finiquitos&usuario=${session?.user?.name || 'unknown'}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(progress);
                },
            });
            setProgress(100); // Asegurarse de que la barra de progreso se establece al 100%
            setUploaded(true);
            console.log('File uploaded successfully', response.data);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Archivo subido correctamente: ${response.data.message}`, life: 3000 });

            // Volver a cargar los archivos después de subir uno con éxito
            fetchFiniquitosData();
        } catch (error) {
            console.error('Error uploading file', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    const handleFileDownload = async (archivoNombre) => {
        if (!archivoNombre) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se ha definido un archivo para descargar', life: 3000 });
            console.error('No se ha definido un archivo para descargar');
            return;
        }

        const nombreSinExtension = removeFileExtension(archivoNombre);

        try {
            const response = await axios.get(`http://192.168.100.215:8080/download?quincena=${quincena}&anio=${String(anio)}&tipo=finiquitos&nombre=${nombreSinExtension}`, {
                responseType: 'blob', // Indica que la respuesta será un blob para manejar archivos binarios
            });

            // Crear una URL para el archivo descargado
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', archivoNombre || `reporte_finiquitos_${anio}_${quincena}.xlsx`); // Usa el nombre del archivo recuperado
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
                <Button variant="contained" component="label" className={styles.uploadButton}>
                    Subir archivo
                    <input type="file" hidden onChange={handleFileUpload} accept=".xlsx" />
                </Button>
            </div>
        );
    };

    const descargaTemplate = (rowData) => {
        return (
            <button className={styles.downloadButton} onClick={() => handleFileDownload(rowData.archivoNombre)}>
                <i className="pi pi-download"></i>
            </button>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            <DataTable value={finiquitos} sortMode="multiple" className={styles.dataTable}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '30%' }}></Column>
                <Column field="tipoNomina" header="TIPO DE NÓMINA" sortable style={{ width: '30%' }}></Column>
                <Column body={uploadTemplate} header="SUBIR ARCHIVO" style={{ width: '20%' }}></Column>
                <Column body={descargaTemplate} header="DESCARGA" style={{ width: '20%' }}></Column>
            </DataTable>
        </div>
    );
}
