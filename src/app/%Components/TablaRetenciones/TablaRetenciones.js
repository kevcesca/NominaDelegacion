'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaRetenciones.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import API_BASE_URL from '../../%Config/apiConfig';

export default function TablaDispersiones({ anio, quincena, session, setProgress, setUploaded }) {
    const toast = useRef(null);
    const [dispersiones, setDispersiones] = useState([]);

    useEffect(() => {
        // Llamar a la función de obtener los datos cuando cambian anio o quincena
        fetchDispersionesData();
    }, [anio, quincena]);  // Ahora usamos quincena en lugar de mes

    // Función para obtener los datos de las dispersiones
    const fetchDispersionesData = async () => {
        try {
            // Verificar los valores de anio y quincena
            console.log(`Fetching data for anio: ${anio}, quincena: ${quincena}`);

            const response = await axios.get(`${API_BASE_URL}/listArchivos?anio=${anio}&quincena=${quincena}&tipo=Dispersión`);
            
            // Asignar los datos de la API directamente al estado
            setDispersiones(response.data.map(item => ({
                nombreArchivo: item.nombre_archivo || 'Vacío',
                paramTipoEstado: item.nombre_estado,
                archivoNombre: item.nombre_archivo || '',
                quincena: item.quincena || '',
            })));

        } catch (error) {
            console.error('Error fetching dispersiones data', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar las dispersiones', life: 3000 });
        }
    };

    // Función para manejar la subida de archivos
    const handleFileUpload = async (event, tipoEstado) => {
        if (!tipoEstado || !quincena) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar una quincena y tipo de estado', life: 3000 });
            console.error('Quincena o tipo de estado no definidos');
            return;
        }

        const file = event.target.files[0];
        if (!file) return;

        setProgress(0);
        setUploaded(false);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('extra', '');  // Siempre enviar el parámetro extra

        // Reemplazar espacios en el nombre de usuario por '_'
        const usuario = session?.user?.name.replace(/\s+/g, '_') || 'unknown';

        try {
            const response = await axios.post(`${API_BASE_URL}/SubirEdoCuenta?quincena=${quincena}&anio=${anio}&vuser=${usuario}&tipo_carga=Dispersion`, formData, {
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

            // Recargar los datos después de subir el archivo
            fetchDispersionesData();
        } catch (error) {
            console.error('Error uploading file', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            
            {/* Tabla que muestra los datos de dispersiones */}
            <DataTable value={dispersiones} sortMode="multiple" className={styles.dataTable}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '50%' }}></Column>
                <Column field="paramTipoEstado" header="TIPO DE ESTADO" sortable style={{ width: '25%' }}></Column>
                <Column field="quincena" header="QUINCENA" sortable style={{ width: '25%' }}></Column>
            </DataTable>

            {/* Botón para subir un archivo */}
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Button
                    variant="contained"
                    component="label"
                    className={styles.uploadButton}
                    disabled={!quincena}  // Deshabilitar si no se seleccionó quincena
                >
                    Subir nuevo archivo
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, 'dispersión')} accept=".xlsx" />
                </Button>
            </div>
        </div>
    );
}
