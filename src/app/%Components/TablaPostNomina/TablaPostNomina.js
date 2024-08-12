'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaPostNomina.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';

export default function TablaPostNomina({ quincena, anio, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const router = useRouter();
    const [tiposNomina, setTiposNomina] = useState([
        { nombreArchivo: 'Vacío', tipoNomina: 'Compuesta, Nomina 8, Estructura', paramTipoNomina: 'compuesta', archivoNombre: '' },
        { nombreArchivo: 'Vacío', tipoNomina: 'Honorarios', paramTipoNomina: 'honorarios', archivoNombre: '' },
    ]);

    useEffect(() => {
        fetchNominaData();
    }, [anio, quincena]);

    const fetchNominaData = async () => {
        try {
            const response = await axios.get(`http://192.168.100.215:8080/listArchivos?anio=${anio}&quincena=${quincena}`);
            const data = response.data.reduce((acc, item) => {
                const tipoNominaCap = capitalizeFirstLetter(item.nombre_nomina);
                const tipoIndex = acc.findIndex(row => row.paramTipoNomina.toLowerCase() === item.nombre_nomina.toLowerCase());
                if (tipoIndex !== -1) {
                    acc[tipoIndex] = {
                        nombreArchivo: item.nombre_archivo || 'Vacío',
                        tipoNomina: tipoNominaCap,
                        paramTipoNomina: tipoNominaCap,
                        archivoNombre: item.nombre_archivo || ''
                    };
                }
                return acc;
            }, [...tiposNomina]);

            setTiposNomina(data);
        } catch (error) {
            console.error('Error fetching nomina data', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los datos de nómina', life: 3000 });
        }
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const removeFileExtension = (filename) => {
        return filename.replace(/\.[^/.]+$/, "");
    };

    const handleFileUpload = async (event, tipoNomina, extra = '') => {
        if (!tipoNomina) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Tipo de nómina no definido', life: 3000 });
            console.error('Tipo de nómina no definido');
            return;
        }

        const file = event.target.files[0];
        if (!file) return;

        setProgress(0);
        setUploaded(false);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('extra', extra);

        const capitalizedTipoNomina = capitalizeFirstLetter(tipoNomina);  // Capitalizar el tipo de nómina

        try {
            const response = await axios.post(`http://192.168.100.215:8080/uploads?quincena=${quincena}&anio=${String(anio)}&tipo=${capitalizedTipoNomina}&usuario=${session?.user?.name || 'unknown'}`, formData, {
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

            fetchNominaData();
        } catch (error) {
            console.error('Error uploading file', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    const handleFileDownload = async (tipoNomina, archivoNombre) => {
        if (!tipoNomina) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Tipo de nómina no definido', life: 3000 });
            console.error('Tipo de nómina no definido');
            return;
        }

        const nombreSinExtension = removeFileExtension(archivoNombre);

        try {
            const response = await axios.get(`http://192.168.100.215:8080/download?quincena=${quincena}&anio=${String(anio)}&tipo=${capitalizeFirstLetter(tipoNomina)}&nombre=${nombreSinExtension}`, {
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

    const uploadTemplate = (rowData) => {
        return (
            <div>
                <Button variant="contained" component="label" className={styles.uploadButton}>
                    Subir archivo
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, rowData.paramTipoNomina, '')} accept=".xlsx" />
                </Button>
            </div>
        );
    };

    const descargaTemplate = (rowData) => {
        return (
            <button className={styles.downloadButton} onClick={() => handleFileDownload(rowData.paramTipoNomina, rowData.archivoNombre)}>
                <i className="pi pi-download"></i>
            </button>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            <DataTable value={tiposNomina} sortMode="multiple" className={styles.dataTable}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '30%' }}></Column>
                <Column field="tipoNomina" header="TIPO DE NÓMINA" sortable style={{ width: '30%' }}></Column>
                <Column body={uploadTemplate} header="SUBIR ARCHIVO" style={{ width: '20%' }}></Column>
                <Column body={descargaTemplate} header="DESCARGA" style={{ width: '20%' }}></Column>
            </DataTable>
            <Button variant="contained" color="primary" className={styles.validateButton} onClick={() => router.push('/AprobarCargaNomina')}>
                Validar Datos
            </Button>
        </div>
    );
}
