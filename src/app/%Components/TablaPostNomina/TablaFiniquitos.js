'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaPostNomina.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';  // Importa ProgressBar
import API_BASE_URL from '../../%Config/apiConfig';

export default function TablaFiniquitos({ quincena, anio, session }) {
    const toast = useRef(null);
    const [finiquitos, setFiniquitos] = useState([]);
    const [progress, setProgress] = useState(0);  // Estado para manejar el progreso de la carga

    useEffect(() => {
        fetchFiniquitosData();
    }, [anio, quincena]);

    const fetchFiniquitosData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/listArchivos`, {
                params: {
                    anio: anio,
                    quincena: quincena,
                },
            });

            // Filtrando los datos para solo incluir los archivos de "Finiquitos"
            const data = response.data
                .filter(item => item.nombre_nomina === 'Finiquitos')
                .map(item => ({
                    idx: item.idx,
                    nombreArchivo: item.nombre_archivo || 'Vacío',
                    tipoNomina: 'Finiquitos',  // Fijo a "Finiquitos"
                    archivoNombre: item.nombre_archivo,
                    fechaCarga: item.fecha_carga,
                    userCarga: item.user_carga,
                }));
            setFiniquitos(data);
        } catch (error) {
            console.error('Error fetching finiquitos data', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los archivos de finiquitos', life: 3000 });
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setProgress(0);  // Reiniciar el progreso a 0 cuando comienza la carga
        const formData = new FormData();
        formData.append('file', file);
        formData.append('extra', '');  // Mandar el parámetro extra como string vacío

        const uploadURL = `${API_BASE_URL}/validarYSubirNomina?quincena=${quincena}&anio=${String(anio)}&tipo=Finiquitos&usuario=${session?.user?.name || 'unknown'}`;

        try {
            const response = await axios.post(uploadURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(progress);  // Actualizar el estado del progreso
                },
            });
            setProgress(100);  // Asegurarse de que la barra de progreso se establece al 100%
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Archivo subido correctamente: ${response.data.message}`, life: 3000 });

            fetchFiniquitosData();  // Refrescar la tabla después de subir el archivo
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

        const nombreSinExtension = archivoNombre.replace(/\.[^/.]+$/, "");

        try {
            const response = await axios.get(`${API_BASE_URL}/download`, {
                params: {
                    quincena: quincena,
                    anio: anio,
                    tipo: 'Finiquitos',
                    nombre: nombreSinExtension,
                },
                responseType: 'blob', // Indica que la respuesta será un blob para manejar archivos binarios
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', archivoNombre || `reporte_finiquitos_${anio}_${quincena}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Archivo descargado correctamente', life: 3000 });
        } catch (error) {
            console.error('Error downloading file', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al descargar el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    const descargaTemplate = (rowData) => (
        <button className={styles.downloadButton} onClick={() => handleFileDownload(rowData.archivoNombre)}>
            <i className="pi pi-download"></i>
        </button>
    );

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            {progress > 0 && (
                <div className={styles.progressContainer}>
                    <ProgressBar value={progress} className={styles.progressBar} />
                </div>
            )}
            <DataTable value={finiquitos} sortMode="multiple" className={styles.dataTable} paginator rows={10}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '40%' }}></Column>
                <Column field="tipoNomina" header="TIPO DE NÓMINA" sortable style={{ width: '30%' }}></Column>
                <Column field="userCarga" header="USUARIO" sortable style={{ width: '20%' }}></Column>
                <Column body={descargaTemplate} header="DESCARGA" style={{ width: '10%' }}></Column>
            </DataTable>
            <div className={styles.uploadContainer}>
                <Button variant="contained" component="label" className={styles.uploadButton}>
                    Subir Nómina de Finiquitos
                    <input type="file" hidden onChange={handleFileUpload} accept=".xlsx" />
                </Button>
            </div>
        </div>
    );
}
