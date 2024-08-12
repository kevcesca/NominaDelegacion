'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaEstadosCuenta.module.css';
import { Button, Select, MenuItem } from '@mui/material';
import { Toast } from 'primereact/toast';
import API_BASE_URL from '../../%Config/apiConfig'

const meses = [
    { label: 'Enero', value: '01' },
    { label: 'Febrero', value: '02' },
    { label: 'Marzo', value: '03' },
    { label: 'Abril', value: '04' },
    { label: 'Mayo', value: '05' },
    { label: 'Junio', value: '06' },
    { label: 'Julio', value: '07' },
    { label: 'Agosto', value: '08' },
    { label: 'Septiembre', value: '09' },
    { label: 'Octubre', value: '10' },
    { label: 'Noviembre', value: '11' },
    { label: 'Diciembre', value: '12' },
];

export default function TablaEstadosCuenta({ anio, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const [estadosCuenta, setEstadosCuenta] = useState([
        { nombreArchivo: 'Vacío', paramTipoEstado: 'cuenta', archivoNombre: '', mes: '' }
    ]);
    const [selectedMes, setSelectedMes] = useState('');

    useEffect(() => {
        fetchEstadosCuentaData();
    }, [anio]);

    const fetchEstadosCuentaData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/listArchivos?anio=${anio}&mes=${selectedMes}&tipo=Cuenta`);
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
            }, [...estadosCuenta]);

            setEstadosCuenta(data);
        } catch (error) {
            console.error('Error fetching estados de cuenta data', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los estados de cuenta', life: 3000 });
        }
    };

    const handleFileUpload = async (event, tipoEstado) => {
        if (!tipoEstado || !selectedMes) {
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
            const response = await axios.post(`${API_BASE_URL}/uploads?anio=${String(anio)}&mes=${selectedMes}&tipo=${capitalizeFirstLetter(tipoEstado)}&usuario=${session?.user?.name || 'unknown'}`, formData, {
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

            fetchEstadosCuentaData();
        } catch (error) {
            console.error('Error uploading file', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    const handleFileDownload = async (tipoEstado, archivoNombre) => {
        if (!tipoEstado || !selectedMes) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un mes y tipo de estado', life: 3000 });
            console.error('Mes o tipo de estado no definidos');
            return;
        }

        const nombreSinExtension = removeFileExtension(archivoNombre);

        try {
            const response = await axios.get(`${API_BASE_URL}/download?anio=${String(anio)}&mes=${selectedMes}&tipo=${capitalizeFirstLetter(tipoEstado)}&nombre=${nombreSinExtension}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', archivoNombre || `reporte_${tipoEstado}_${anio}_${selectedMes}.xlsx`);
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
                <Button variant="contained" component="label" className={styles.uploadButton} disabled={!selectedMes}>
                    Subir archivo
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, rowData.paramTipoEstado)} accept=".xlsx" />
                </Button>
            </div>
        );
    };

    const descargaTemplate = (rowData) => {
        return (
            <button className={styles.downloadButton} onClick={() => handleFileDownload(rowData.paramTipoEstado, rowData.archivoNombre)} disabled={!selectedMes}>
                <i className="pi pi-download"></i>
            </button>
        );
    };

    const mesTemplate = (rowData) => {
        return (
            <Select
                value={selectedMes}
                onChange={(e) => setSelectedMes(e.target.value)}
                variant="outlined"
                displayEmpty
                className={styles.select}
            >
                <MenuItem value="" disabled>
                    Selecciona un mes
                </MenuItem>
                {meses.map((mes, index) => (
                    <MenuItem key={index} value={mes.value}>{mes.label}</MenuItem>
                ))}
            </Select>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            <DataTable value={estadosCuenta} sortMode="multiple" className={styles.dataTable}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '30%' }}></Column>
                <Column body={mesTemplate} header="MES" style={{ width: '20%' }}></Column>
                <Column body={uploadTemplate} header="SUBIR ARCHIVO" style={{ width: '25%' }}></Column>
                <Column body={descargaTemplate} header="DESCARGA" style={{ width: '25%' }}></Column>
            </DataTable>
        </div>
    );
}
