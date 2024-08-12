'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaPostNomina.module.css';
import { Button, Select, MenuItem } from '@mui/material';
import { Toast } from 'primereact/toast';
import API_BASE_URL from '../../%Config/apiConfig'

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

export default function TablaQuincenasExtraordinarias({ quincena, anio, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const [extraordinarios, setExtraordinarios] = useState([
        { nombreArchivo: 'Vacío', tipoNomina: 'Extraordinarios', paramTipoNomina: 'extraordinarios', archivoNombre: '', tipoExtraordinario: '' }
    ]);

    useEffect(() => {
        fetchNominaData();
    }, [anio, quincena]);

    const fetchNominaData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/listArchivos?anio=${anio}&quincena=${quincena}&tipo=Extraordinarios`);
            const data = response.data.reduce((acc, item) => {
                const tipoIndex = acc.findIndex(row => row.paramTipoNomina === item.nombre_nomina);
                if (tipoIndex !== -1) {
                    acc[tipoIndex] = {
                        nombreArchivo: item.nombre_archivo || 'Vacío',
                        tipoNomina: capitalizeFirstLetter(item.nombre_nomina),
                        paramTipoNomina: item.nombre_nomina,
                        archivoNombre: item.nombre_archivo || '',
                        tipoExtraordinario: item.tipoExtraordinario || ''
                    };
                }
                return acc;
            }, [...extraordinarios]);

            setExtraordinarios(data);
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

    const handleFileUpload = async (event, tipoNomina, tipoExtraordinario) => {
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
        formData.append('tipoExtraordinario', tipoExtraordinario);

        const capitalizedTipoNomina = capitalizeFirstLetter(tipoNomina);  // Capitalizar el tipo de nómina

        try {
            const response = await axios.post(`${API_BASE_URL}/uploads?quincena=${quincena}&anio=${String(anio)}&tipo=${capitalizedTipoNomina}&usuario=${session?.user?.name || 'unknown'}&extra=${tipoExtraordinario}`, formData, {
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

    const handleFileDownload = async (tipoNomina, archivoNombre, tipoExtraordinario) => {
        if (!tipoNomina) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Tipo de nómina no definido', life: 3000 });
            console.error('Tipo de nómina no definido');
            return;
        }

        const capitalizedTipoNomina = capitalizeFirstLetter(tipoNomina);  // Capitalizar el tipo de nómina
        const nombreSinExtension = removeFileExtension(archivoNombre);

        try {
            const response = await axios.get(`${API_BASE_URL}/download?quincena=${quincena}&anio=${String(anio)}&tipo=${capitalizedTipoNomina}&nombre=${nombreSinExtension}&extra=${tipoExtraordinario}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', archivoNombre || `reporte_${capitalizedTipoNomina}_${anio}_${quincena}.xlsx`);
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
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, rowData.paramTipoNomina, rowData.tipoExtraordinario)} accept=".xlsx" />
                </Button>
            </div>
        );
    };

    const descargaTemplate = (rowData) => {
        return (
            <button className={styles.downloadButton} onClick={() => handleFileDownload(rowData.paramTipoNomina, rowData.archivoNombre, rowData.tipoExtraordinario)}>
                <i className="pi pi-download"></i>
            </button>
        );
    };

    const tipoExtraordinarioTemplate = (rowData) => {
        return (
            <Select
                value={rowData.tipoExtraordinario}
                onChange={(e) => {
                    const newExtraordinarios = [...extraordinarios];
                    const index = newExtraordinarios.findIndex(x => x.paramTipoNomina === rowData.paramTipoNomina);
                    newExtraordinarios[index].tipoExtraordinario = e.target.value;
                    setExtraordinarios(newExtraordinarios);
                }}
                variant="outlined"
                displayEmpty
                className={styles.select}
            >
                <MenuItem value="" disabled>
                    Selecciona tipo extraordinario
                </MenuItem>
                {tiposExtraordinarios.map((tipo, index) => (
                    <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
                ))}
            </Select>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            <DataTable value={extraordinarios} sortMode="multiple" className={styles.dataTable}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '20%' }}></Column>
                <Column field="tipoNomina" header="TIPO DE NÓMINA" sortable style={{ width: '20%' }}></Column>
                <Column body={tipoExtraordinarioTemplate} header="TIPO EXTRAORDINARIO" style={{ width: '20%' }}></Column>
                <Column body={uploadTemplate} header="SUBIR ARCHIVO" style={{ width: '20%' }}></Column>
                <Column body={descargaTemplate} header="DESCARGA" style={{ width: '20%' }}></Column>
            </DataTable>
        </div>
    );
}
