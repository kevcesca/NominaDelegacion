import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaEstadosCuenta.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar'; // Importamos ProgressBar para mostrar progreso
import API_BASE_URL from '../../%Config/apiConfig';

export default function TablaEstadosCuenta({ anio, quincena, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const [estadosCuenta, setEstadosCuenta] = useState([]); // Almacenará los datos obtenidos del servicio
    const [isUploadDisabled, setIsUploadDisabled] = useState(false); // Deshabilita el botón de carga si es necesario
    const [localProgress, setLocalProgress] = useState(0); // Para manejar el progreso de la carga localmente
    const [refresh, setRefresh] = useState(false); // Estado para forzar refresco del componente

    // Efecto para obtener los datos al cambiar el año o la quincena o cuando se refresca
    useEffect(() => {
        if (anio && quincena) {
            fetchEstadosCuentaData();
        }
    }, [anio, quincena, refresh]);

    // Función para obtener los datos desde el servicio
    const fetchEstadosCuentaData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/consultaEdoCta?anio=${anio}&quincena=${quincena}`);
            setEstadosCuenta(response.data); // Asume que la respuesta contiene el array esperado
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los datos', life: 3000 });
        }
    };

    // Función para subir archivo
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
        formData.append('extra', '');  // Siempre enviar el parámetro extra

        try {
            const response = await axios.post(`${API_BASE_URL}/SubirEdoCuenta?quincena=${quincena}&anio=${anio}&vuser=${session?.user?.name || 'unknown'}&tipo_carga=EstadosCuenta`, formData, {
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
            
            // Forzar el refresco de la tabla de estados de cuenta
            setRefresh(prev => !prev); // Cambia el estado de refresh para forzar el re-render
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    // Función para procesar el archivo de un registro específico
    const handleProcesarArchivo = async (archivoNombre) => {
        try {
            const usuario = session?.user?.name || 'unknown'; // Obtener el nombre del usuario
            const endpoint = `${API_BASE_URL}/SubirEdoCuenta/dataBase?anio=${anio}&quincena=${quincena}&vuser=${usuario}&tipo_carga=EstadosCuenta&varchivo1=${archivoNombre}`;
            const response = await axios.get(endpoint);

            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Archivo ${archivoNombre} procesado correctamente.`, life: 3000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al procesar el archivo.', life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Hubo un error al procesar el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    // Renderiza el botón de "Procesar" en cada fila de la tabla
    const procesarArchivoTemplate = (rowData) => {
        return (
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleProcesarArchivo(rowData.nombre_archivo)} // Procesar este archivo específico
                className={styles.procesarButton}
            >
                Procesar
            </Button>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            <DataTable value={estadosCuenta} sortMode="multiple" className={styles.dataTable}>
                <Column field="nombre_archivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '40%' }}></Column>
                <Column field="user_carga" header="USUARIO" sortable style={{ width: '20%' }}></Column>
                <Column body={procesarArchivoTemplate} header="PROCESAR ARCHIVO" style={{ width: '20%' }}></Column>
            </DataTable>

            <Button
                variant="contained"
                component="label"
                className={styles.uploadButton}
                disabled={isUploadDisabled}
            >
                Subir Estados de Cuenta
                <input type="file" hidden onChange={(e) => handleFileUpload(e, 'estadoCuenta')} />
            </Button>

            {localProgress > 0 && (
                <ProgressBar value={localProgress} className={styles.progressBar} />
            )}
        </div>
    );
}
