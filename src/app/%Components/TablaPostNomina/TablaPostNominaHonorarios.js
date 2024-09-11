'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaPostNomina.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import API_BASE_URL from '../../%Config/apiConfig';

export default function TablaPostNominaHonorarios({ quincena, anio, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const [archivos, setArchivos] = useState([]);
    const [isUploadDisabled, setIsUploadDisabled] = useState(false); // Estado para deshabilitar la carga
    const [canProcess, setCanProcess] = useState(false); // Controla si se puede procesar la nómina

    useEffect(() => {
        fetchArchivosData();
    }, [anio, quincena]);

    const fetchArchivosData = async () => {
        try {
            // Realizamos la solicitud a consultaNominaCtrl
            const response = await axios.get(`${API_BASE_URL}/consultaNominaCtrl/filtro`, {
                params: {
                    anio: anio,
                    quincena: quincena,
                    // Puedes incluir otros parámetros si lo deseas
                },
            });

            // Filtrar solo los resultados donde nombre_nomina sea "Honorarios"
            const data = response.data
                .filter(item => item.nombre_nomina === 'Honorarios') // Aplicar el filtro aquí
                .map(item => ({
                    idx: item.idx,
                    nombreArchivo: item.nombre_archivo || 'Vacío',
                    tipoNomina: 'Honorarios', // Asegurar que siempre sea "Honorarios"
                    archivoNombre: item.nombre_archivo,
                    fechaCarga: item.fecha_carga,
                    userCarga: item.user_carga,
                    aprobado: item.aprobado,
                    aprobado2: item.aprobado2,
                }));

            setArchivos(data);
            setIsUploadDisabled(data.length >= 1); // Desactivar botón de carga si hay 2 o más archivos
            setCanProcess(data.length >= 1); // Habilitar el botón "Procesar Nómina" cuando hay 2 archivos o más
        } catch (error) {
            console.error('Error fetching archivos data', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los archivos', life: 3000 });
        }
    };

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files.length) return;

        setProgress(0);
        setUploaded(false);

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);  // Añadir el archivo al FormData
            formData.append('extra', '');   // El campo `extra` está vacío

            const uploadURL = `${API_BASE_URL}/SubirNomina?quincena=${quincena}&anio=${String(anio)}&tipo=Honorarios&usuario=${session?.user?.name || 'unknown'}`;

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
                fetchArchivosData();  // Refrescar la tabla tras cargar el archivo

            } catch (error) {
                console.error('Error uploading file', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, life: 5000 });
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
                    tipo: tipoNomina, // Filtrado por tipo de nómina "Honorarios"
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
            const usuario = session?.user?.name || 'unknown';  // Obtener el nombre del usuario
            const endpoint = `${API_BASE_URL}/SubirNomina/dataBase?quincena=${quincena}&anio=${anio}&tipo=Honorarios&usuario=${usuario}&extra=gatitoverdecito`;

            const response = await axios.get(endpoint);

            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Nómina procesada correctamente.', life: 3000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al procesar la nómina.', life: 3000 });
            }
        } catch (error) {
            console.error('Error al procesar la nómina:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un error al procesar la nómina.', life: 3000 });
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
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '40%' }}></Column>
                <Column field="tipoNomina" header="TIPO DE NÓMINA" sortable style={{ width: '30%' }}></Column>
                <Column field="userCarga" header="USUARIO" sortable style={{ width: '20%' }}></Column>
                <Column body={descargaTemplate} header="DESCARGA" style={{ width: '10%' }}></Column>
            </DataTable>
            <div className={styles.uploadContainer}>
                <Button
                    variant="contained"
                    component="label"
                    className={styles.uploadButton}
                    disabled={isUploadDisabled}  // Deshabilitar el botón de carga si ya hay 2 archivos
                >
                    Subir Nómina de Honorarios
                    <input type="file" hidden onChange={handleFileUpload} accept=".xlsx" multiple />  {/* Permitimos la carga de múltiples archivos */}
                </Button>

                {/* Mostrar el botón "Procesar Nómina" solo si se han cargado archivos suficientes */}
                {canProcess && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleProcesarNomina}
                        className={styles.procesarButton}
                        style={{ marginTop: '1rem' }}
                    >
                        Procesar Nómina de Honorarios
                    </Button>
                )}
            </div>
        </div>
    );
}
