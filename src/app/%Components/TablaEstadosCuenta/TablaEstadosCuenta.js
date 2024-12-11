'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaEstadosCuenta.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import API_BASE_URL from '../../%Config/apiConfig';

export default function TablaEstadosCuenta({ anio, quincena, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const [estadosCuenta, setEstadosCuenta] = useState([]);  // Estado para guardar los datos de la tabla
    const [isUploadDisabled, setIsUploadDisabled] = useState(false);  // Estado para controlar la habilitación del botón de subida
    const [localProgress, setLocalProgress] = useState(0);  // Para mostrar el progreso de subida
    const [refresh, setRefresh] = useState(false);  // Controla la actualización manual de los datos después de subir un archivo

    // Effecto para cargar los datos al cambiar el año o la quincena
    useEffect(() => {
        if (anio && quincena) {
            fetchEstadosCuentaData();  // Llamar a la función de obtener los datos
        }
    }, [anio, quincena, refresh]);  // Dependencias: se vuelve a cargar cuando anio, quincena o refresh cambian

    // Función para obtener los datos de los estados de cuenta desde la API
    const fetchEstadosCuentaData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/consultaEdoCta?anio=${anio}&quincena=${quincena}`);
            console.log('Datos de la API:', response.data);  // Verificar la estructura de los datos
            setEstadosCuenta(response.data);  // Actualizar el estado con los datos obtenidos
        } catch (error) {
            console.error('Error al cargar los datos de Estados de Cuenta', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los datos', life: 3000 });
        }
    };

    // Función para manejar la subida de archivos
    const handleFileUpload = async (event, tipoEstado) => {
        if (!tipoEstado || !quincena) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar una quincena y tipo de estado', life: 3000 });
            return;
        }

        const file = event.target.files[0];
        if (!file) return;

        setProgress(0);
        setUploaded(false);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('extra', '');  // Parámetro extra (si se requiere)

        const usuario = session?.user?.name.replace(/\s+/g, '_') || 'unknown';

        try {
            const response = await axios.post(`${API_BASE_URL}/SubirEdoCuenta?quincena=${quincena}&anio=${anio}&vuser=${usuario}&tipo_carga=EstadosCuenta`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(progress);
                    setLocalProgress(progress);
                },
            });
            setProgress(100);
            setUploaded(true);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Archivo subido correctamente: ${response.data.message}`, life: 3000 });

            setRefresh(prev => !prev);  // Cambiar el estado de refresh para forzar la recarga de los datos
        } catch (error) {
            console.error('Error al subir el archivo', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            {localProgress > 0 && (
                <ProgressBar value={localProgress} className={styles.progressBar} />
            )}
            {/* Tabla que muestra los datos de los estados de cuenta */}
            <DataTable value={estadosCuenta} sortMode="multiple" className={styles.dataTable}>
                <Column field="nombre_archivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '50%' }}></Column>
                <Column field="user_carga" header="USUARIO" sortable style={{ width: '30%' }}></Column>
                <Column field="fecha_carga" header="FECHA DE CARGA" sortable style={{ width: '20%' }}></Column> {/* Si tienes otros campos, puedes agregarlos */}
            </DataTable>

            {/* Botón para subir un archivo */}
            <Button
                variant="contained"
                component="label"
                className={styles.uploadButton}
                disabled={isUploadDisabled}  // Deshabilitar si no se puede subir el archivo
            >
                Subir Estados de Cuenta
                <input type="file" hidden onChange={(e) => handleFileUpload(e, 'estadoCuenta')} />
            </Button>
        </div>
    );
}
