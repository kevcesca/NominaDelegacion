'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from './TablaRetenciones.module.css';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import API_BASE_URL from '../../%Config/apiConfig';

export default function TablaDispersiones({ anio, quincena, session, setProgress, setUploaded }) {  // Cambié mes por quincena
    const toast = useRef(null);
    const [dispersiones, setDispersiones] = useState([
        { nombreArchivo: 'Vacío', paramTipoEstado: 'dispersión', archivoNombre: '', quincena: '' }
    ]);
    const [canProcess, setCanProcess] = useState(false); // Controla si se muestra el botón "Procesar Dispersiones"

    useEffect(() => {
        fetchDispersionesData();
    }, [anio, quincena]);  // Ahora usamos quincena en lugar de mes

    const fetchDispersionesData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/listArchivos?anio=${anio}&quincena=${quincena}&tipo=Dispersión`);  // Cambié el query param de mes a quincena
            const data = response.data.reduce((acc, item) => {
                const tipoIndex = acc.findIndex(row => row.paramTipoEstado === item.nombre_estado);
                if (tipoIndex !== -1) {
                    acc[tipoIndex] = {
                        nombreArchivo: item.nombre_archivo || 'Vacío',
                        paramTipoEstado: item.nombre_estado,
                        archivoNombre: item.nombre_archivo || '',
                        quincena: item.quincena || ''
                    };
                }
                return acc;
            }, [...dispersiones]);

            setDispersiones(data);
            setCanProcess(data.some(item => item.archivoNombre !== 'Vacío')); // Habilitar el botón solo si hay archivos subidos
        } catch (error) {
            console.error('Error fetching dispersiones data', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar las dispersiones', life: 3000 });
        }
    };

    const handleFileUpload = async (event, tipoEstado) => {
        if (!tipoEstado || !quincena) {  // Cambié mes por quincena
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

        try {
            const response = await axios.post(`${API_BASE_URL}/SubirEdoCuenta?mes=${quincena}&anio=${anio}&vuser=${session?.user?.name || 'unknown'}&tipo_carga=Dispersion`, formData, {
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

            fetchDispersionesData();
        } catch (error) {
            console.error('Error uploading file', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, life: 3000 });
        }
    };

    const handleProcesarDispersiones = async () => {
        try {
            const usuario = session?.user?.name || 'unknown';  // Obtener el nombre del usuario
            const endpoint = `${API_BASE_URL}/SubirEdoCuenta/dataBase?mes=${quincena}&anio=${anio}&vuser=${usuario}&tipo_carga=Dispersion&varchivo1=dispersión_012024`; // Cambié mes por quincena en el endpoint

            // Hacer la solicitud al endpoint para procesar
            const response = await axios.get(endpoint);

            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Dispersiones procesadas correctamente.', life: 3000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al procesar las dispersiones.', life: 3000 });
            }
        } catch (error) {
            console.error('Error al procesar las dispersiones:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un error al procesar las dispersiones.', life: 3000 });
        }
    };

    const uploadTemplate = (rowData) => {
        return (
            <div>
                <Button variant="contained" component="label" className={styles.uploadButton} disabled={!quincena}>  {/* Cambié la validación de mes a quincena */}
                    Subir archivo
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, rowData.paramTipoEstado)} accept=".xlsx" />
                </Button>
            </div>
        );
    };

    return (
        <div className={`card ${styles.card}`}>
            <Toast ref={toast} />
            <DataTable value={dispersiones} sortMode="multiple" className={styles.dataTable}>
                <Column field="nombreArchivo" header="NOMBRE DE ARCHIVO" sortable style={{ width: '50%' }}></Column>
                <Column body={uploadTemplate} header="SUBIR ARCHIVO" style={{ width: '25%' }}></Column>
            </DataTable>

            {/* Botón para procesar las Dispersiones */}
            {canProcess && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleProcesarDispersiones}
                    className={styles.procesarButton}
                    style={{ marginTop: '1rem' }}
                >
                    Procesar Dispersiones
                </Button>
            )}
        </div>
    );
}
