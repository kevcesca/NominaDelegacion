'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaPostNomina.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import API_BASE_URL from '../../%Config/apiConfig';
import Image from 'next/image'; // Importamos Image para mostrar el SVG

export default function TablaPostNomina({ quincena, anio, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const [archivos, setArchivos] = useState([]);
    const [isUploadDisabled, setIsUploadDisabled] = useState(false); // Controla si se habilita el botón de carga
    const [canProcess, setCanProcess] = useState(false); // Controla si se muestra el botón "Procesar Nómina"
    const [isLoading, setIsLoading] = useState(false); // Controla si se está mostrando el GIF de carga

    useEffect(() => {
        fetchArchivosData();
    }, [anio, quincena]);

    const fetchArchivosData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/consultaNominaCtrl/filtro`, {
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
            setCanProcess(data.length >= 2); // Habilitar botón de procesar nómina cuando hay 2 archivos o más
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
        const files = event.target.files; // Obtén múltiples archivos seleccionados
        if (!files.length) return;
    
        setIsLoading(true); // Mostrar el GIF de carga
    
        for (const file of files) { // Itera sobre cada archivo seleccionado
            const formData = new FormData();
            formData.append('file', file);
            formData.append('extra', '');
    
            const uploadURL = `${API_BASE_URL}/SubirNomina?quincena=${quincena}&anio=${String(anio)}&tipo=Compuesta&usuario=${session?.user?.name || 'unknown'}`;
    
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
    
                // **Aplicar setTimeout para SVG y toast**
                setTimeout(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `Archivo subido correctamente: ${response.data.message}`,
                        life: 3000,
                    });
                    setIsLoading(false); // Ocultar el GIF de carga después del toast
                }, 1000); // Retrasar 1 segundo
    
                fetchArchivosData(); // Refrescar la tabla después de subir el archivo
            } catch (error) {
                console.error('Error uploading file', error);
    
                const errorCode = error.response?.status || 'Desconocido';
                const errorDetails = error.response?.data || 'Error desconocido al subir el archivo.';
    
                const errorMessage = `Error al subir archivo. Código de error: ${errorCode}. Detalle: ${errorDetails}`;
    
                setTimeout(() => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error al Subir Archivo',
                        detail: errorMessage,
                        life: 5000,
                    });
                    setIsLoading(false); // Ocultar el GIF de carga después del toast de error
                }, 3000); // Retrasar 1 segundo
            }
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

    const handleProcesarNomina = async () => {
        try {
            const usuario = session?.user?.name || 'unknown';
            const endpoint = `${API_BASE_URL}/SubirNomina/dataBase?quincena=${quincena}&anio=${anio}&tipo=Compuesta&usuario=${usuario}&extra=gatitoverdecito`;
            const response = await axios.get(endpoint);

            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Nómina procesada correctamente.', life: 3000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al procesar la nómina.', life: 3000 });
            }
        } catch (error) {
            console.error('Error al procesar la nómina:', error);
            const errorMessage = error.response?.data || 'Hubo un error al procesar la nómina.';
            toast.current.show({ severity: 'error', summary: 'Error al procesar la nómina', detail: errorMessage, life: 5000 });
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
            {isLoading && (
                <div className={styles.loadingContainer}>
                    <Image src="/barraCarga.svg" alt="Barra de carga" width={150} height={150} className={styles.image} />
                </div>
            )}
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
                    <input type="file" hidden onChange={handleFileUpload} accept=".xlsx" multiple />
                </Button>

                {canProcess && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleProcesarNomina}
                        className={styles.procesarButton}
                        style={{ marginTop: '1rem' }}
                    >
                        Procesar Nómina
                    </Button>
                )}
            </div>
        </div>
    );
}
