'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import styles from './TablaPostNomina.module.css';
import { Button, Select, MenuItem } from '@mui/material';
import { Toast } from 'primereact/toast';
import API_BASE_URL from '../../%Config/apiConfig';

const tiposExtraordinarios = [
    'DIA DE LA MUJER',
    'DIA DE LA MADRE',
    'DIA DEL PADRE',
    'SEPARACION VOLUNTARIA',
    'FONAC',
    'VESTUARIO ADMINISTRATIVO',
    'PREMIO DE ANTIGÜEDAD',
    'PREMIO DE ESTIMULOS Y RECOMPENSAS',
    'VALES DE DESPENSA NOMINA PAGADA EN VALES',
    'PAGO UNICO HONORARIOS',
    'AGUINALDO'
];

export default function TablaQuincenasExtraordinarias({ quincena, anio, session }) {
    const toast = useRef(null);
    const [extraordinarios, setExtraordinarios] = useState([]);
    const [progress, setProgress] = useState(0);
    const [selectedTipo, setSelectedTipo] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchExtraordinariosData();
    }, [anio, quincena]);

    const fetchExtraordinariosData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/listArchivos`, {
                params: {
                    anio: anio,
                    quincena: quincena,
                    tipo: 'Extraordinarios'
                },
            });

            const data = response.data.map(item => ({
                idx: item.idx,
                nombreArchivo: item.nombre_archivo || 'Vacío',
                tipoNomina: 'Extraordinarios',
                archivoNombre: item.nombre_archivo,
                tipoExtraordinario: item.extra_desc || '', // Utilizando `extra_desc`
                userCarga: item.user_carga || 'Desconocido' // Añadiendo el usuario que cargó el archivo
            }));
            setExtraordinarios(data);
        } catch (error) {
            console.error('Error fetching extraordinarios data', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los archivos', life: 3000 });
        }
    };

    const handleFileUpload = async (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        if (!selectedFile || !selectedTipo) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debes seleccionar un archivo y un tipo de extraordinario', life: 3000 });
            return;
        }

        setProgress(0);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('extra', selectedTipo);

        try {
            const response = await axios.post(`${API_BASE_URL}/uploads?quincena=${quincena}&anio=${String(anio)}&tipo=Extraordinarios&usuario=${session?.user?.name || 'unknown'}&extra=${selectedTipo}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(progress);
                },
            });

            setProgress(100);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Archivo subido correctamente: ${response.data.message}`, life: 3000 });
            fetchExtraordinariosData();
            setFile(null);
        } catch (error) {
            console.error('Error uploading file', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    const handleFileDownload = async (archivoNombre, tipoExtraordinario) => {
        const nombreSinExtension = archivoNombre.replace(/\.[^/.]+$/, "");

        try {
            const response = await axios.get(`${API_BASE_URL}/download`, {
                params: {
                    quincena: quincena,
                    anio: anio,
                    tipo: 'Extraordinarios',
                    nombre: nombreSinExtension,
                    extra: tipoExtraordinario
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', archivoNombre || `reporte_extraordinarios_${anio}_${quincena}.xlsx`);
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
        <button className={styles.downloadButton} onClick={() => handleFileDownload(rowData.archivoNombre, rowData.tipoExtraordinario)}>
            <i className="pi pi-download"></i>
        </button>
    );

    const tipoExtraordinarioTemplate = (rowData) => (
        <span>{rowData.tipoExtraordinario}</span>
    );

    const userCargaTemplate = (rowData) => (
        <span>{rowData.userCarga}</span>
    );

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            {progress > 0 && (
                <div className={styles.progressContainer}>
                    <ProgressBar value={progress} className={styles.progressBar} />
                </div>
            )}
            <DataTable value={extraordinarios} sortMode="multiple" className={styles.dataTable} paginator rows={10}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '30%' }}></Column>
                <Column field="tipoNomina" header="TIPO DE NÓMINA" sortable style={{ width: '25%' }}></Column>
                <Column body={tipoExtraordinarioTemplate} header="TIPO EXTRAORDINARIO" style={{ width: '25%' }}></Column>
                <Column body={userCargaTemplate} header="USUARIO" style={{ width: '10%' }}></Column>
                <Column body={descargaTemplate} header="DESCARGA" style={{ width: '10%' }}></Column>
            </DataTable>
            <div className={styles.uploadContainer}>
                <Button
                    variant="contained"
                    component="label"
                    className={styles.uploadButton}
                    disabled={!selectedTipo}
                >
                    Subir Nómina Extraordinaria
                    <input type="file" hidden onChange={handleFileUpload} accept=".xlsx" />
                </Button>
                <Select
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                    variant="outlined"
                    displayEmpty
                    className={styles.select}
                >
                    <MenuItem value="" disabled>
                        Selecciona tipo extraordinario para subir
                    </MenuItem>
                    {tiposExtraordinarios.map((tipo, index) => (
                        <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
                    ))}
                </Select>
            </div>
        </div>
    );
}
