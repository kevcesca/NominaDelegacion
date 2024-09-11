'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaEstadosCuenta.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import API_BASE_URL from '../../%Config/apiConfig';

export default function TablaEstadosCuenta({ anio, mes, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const [estadosCuenta, setEstadosCuenta] = useState([
        { nombreArchivo: 'Vacío', paramTipoEstado: 'cuenta', archivoNombre: '', mes: '' }
    ]);
    const [canProcess, setCanProcess] = useState(false); // Controla si se muestra el botón "Procesar Estados de Cuenta"

    useEffect(() => {
        fetchEstadosCuentaData();
    }, [anio, mes]);

    const fetchEstadosCuentaData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/listArchivos?anio=${anio}&mes=${mes}&tipo=Cuenta`);
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
            setCanProcess(data.some(item => item.archivoNombre !== 'Vacío')); // Habilitar el botón solo si hay archivos subidos
        } catch (error) {
            console.error('Error fetching estados de cuenta data', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los estados de cuenta', life: 3000 });
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
            const response = await axios.post(`${API_BASE_URL}/SubirEdoCuenta?mes=${mes}&anio=${anio}&vuser=${session?.user?.name || 'unknown'}&tipo_carga=EstadosCuenta`, formData, {
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

    const handleProcesarEstadosCuenta = async () => {
        try {
            const usuario = session?.user?.name || 'unknown';  // Obtener el nombre del usuario
            const endpoint = `${API_BASE_URL}/SubirEdoCuenta/dataBase?mes=${mes}&anio=${anio}&vuser=${usuario}&tipo_carga=EstadosCuenta&varchivo1=edoCuenta_01720122252006_012024`; // Ajustar el endpoint con parámetros

            // Hacer la solicitud al endpoint para procesar
            const response = await axios.get(endpoint);

            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Estados de Cuenta procesados correctamente.', life: 3000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al procesar los estados de cuenta.', life: 3000 });
            }
        } catch (error) {
            console.error('Error al procesar los estados de cuenta:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un error al procesar los estados de cuenta.', life: 3000 });
        }
    };

    const uploadTemplate = (rowData) => {
        return (
            <div>
                <Button variant="contained" component="label" className={styles.uploadButton} disabled={!mes}>
                    Subir archivo
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, rowData.paramTipoEstado)} accept=".txt" />
                </Button>
            </div>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            <DataTable value={estadosCuenta} sortMode="multiple" className={styles.dataTable}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '50%' }}></Column>
                <Column body={uploadTemplate} header="SUBIR ARCHIVO" style={{ width: '25%' }}></Column>
            </DataTable>

            {/* Botón para procesar los Estados de Cuenta */}

            <Button
                variant="contained"
                color="primary"
                onClick={handleProcesarEstadosCuenta}
                className={styles.procesarButton}
                style={{ marginTop: '1rem' }}
            >
                Procesar Estados de Cuenta
            </Button>
        </div>
    );
}
