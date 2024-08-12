'use client';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Select, MenuItem, TextField } from '@mui/material';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Cheque.module.css';

const TotalChequesTable = () => {
    const [cheques, setCheques] = useState([]);
    const [anio, setAnio] = useState('2024');
    const [quincena, setQuincena] = useState('01');
    const [tipo, setTipo] = useState('base');
    const [iniCheq, setIniCheq] = useState('');
    const [showTable, setShowTable] = useState(false);  // Controlar la visibilidad de la tabla
    const toast = useRef(null);
    const dt = useRef(null);

    // Primera solicitud: insertar cheques
    const insertarCheques = async () => {
        try {
            const response = await axios.get(`http://192.168.100.77:8080/insertar/cheques`, {
                params: {
                    quincena: quincena,
                    anio: anio,
                    tipo: tipo,
                    ini_cheq: iniCheq
                }
            });

            const responseData = response.data.trim(); // Limpiar espacios en blanco

            if (responseData === 'El script se ejecutó correctamente.') {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: responseData, life: 3000 });
                await cargarCheques();  // Llamar a la función para cargar la tabla si la inserción fue exitosa
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: responseData, life: 3000 });
                setShowTable(false);  // Ocultar la tabla si hay un error
            }
        } catch (error) {
            const errorMessage = 'Hubo un error al comunicarse con el servidor';
            toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
            setShowTable(false);
        }
    };

    // Segunda solicitud: obtener datos de los cheques
    const cargarCheques = async () => {
        try {
            const response = await axios.get(`http://192.168.100.77:8080/consultaEmpleados/TotalesCheques`, {
                params: {
                    anio: anio,
                    quincena: quincena,
                    nombre_nomina: tipo
                }
            });

            const responseData = response.data;

            if (responseData.length > 0) {
                setShowTable(true);  // Mostrar la tabla después de obtener los datos correctamente
                setCheques(responseData);  // Asignar los datos recibidos a la tabla
            } else {
                toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se encontraron datos.', life: 3000 });
                setShowTable(false);  // Ocultar la tabla si no hay datos
            }
        } catch (error) {
            const errorMessage = 'Hubo un error al cargar los datos';
            toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
            setShowTable(false);
            setCheques([]);  // Limpiar la tabla si hay un error
        }
    };

    const quincenas = [
        { label: '1ra ene', value: '01' },
        { label: '2da ene', value: '02' },
        { label: '1ra feb', value: '03' },
        { label: '2da feb', value: '04' },
        { label: '1ra mar', value: '05' },
        { label: '2da mar', value: '06' },
        { label: '1ra abr', value: '07' },
        { label: '2da abr', value: '08' },
        { label: '1ra may', value: '09' },
        { label: '2da may', value: '10' },
        { label: '1ra jun', value: '11' },
        { label: '2da jun', value: '12' },
        { label: '1ra jul', value: '13' },
        { label: '2da jul', value: '14' },
        { label: '1ra ago', value: '15' },
        { label: '2da ago', value: '16' },
        { label: '1ra sep', value: '17' },
        { label: '2da sep', value: '18' },
        { label: '1ra oct', value: '19' },
        { label: '2da oct', value: '20' },
        { label: '1ra nov', value: '21' },
        { label: '2da nov', value: '22' },
        { label: '1ra dic', value: '23' },
        { label: '2da dic', value: '24' },
    ];

    const tiposNomina = [
        { label: 'Base', value: 'base' },
        { label: 'Finiquitos', value: 'finiquitos' },
        { label: 'Extraordinaria', value: 'extraordinaria' }
    ];

    const generarPDF = async () => {
        try {
            const response = await axios.post('/api/generatePdf', { cheques });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cheques.pdf';
            a.click();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al generar el PDF', life: 3000 });
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Totales de Cheques</h4>
            <Button type="button" icon="pi pi-file" label="Exportar" onClick={generarPDF} className={styles.submitButton} />
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <div className={styles.formContainer}>
                    <Select
                        className={styles.selectField}
                        value={quincena}
                        onChange={(e) => setQuincena(e.target.value)}
                        variant="outlined"
                        displayEmpty
                    >
                        {quincenas.map((quin, index) => (
                            <MenuItem key={index} value={quin.value}>
                                {quin.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        className={styles.selectField}
                        value={anio}
                        onChange={(e) => setAnio(e.target.value)}
                        variant="outlined"
                        displayEmpty
                    >
                        {[2024, 2025, 2026].map((year) => (
                            <MenuItem key={year} value={year}>
                                Año {year}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        className={styles.selectField}
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        variant="outlined"
                        displayEmpty
                    >
                        {tiposNomina.map((tipoNomina, index) => (
                            <MenuItem key={index} value={tipoNomina.value}>
                                {tipoNomina.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        className={styles.selectField}
                        label="Número Inicial de Cheque"
                        variant="outlined"
                        type="number"
                        value={iniCheq}
                        onChange={(e) => setIniCheq(e.target.value)}
                    />
                    <Button label="Generar Cheques" onClick={insertarCheques} className={styles.submitButton} />
                </div>

                {showTable && (  // Renderizar la tabla solo si se ha cargado la data
                    <>
                        <Toolbar className="mb-4" right={header}></Toolbar>
                        <DataTable ref={dt} value={cheques} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} dataKey="id_empleado">
                            <Column field="id_empleado" header="ID Empleado" sortable></Column>
                            <Column field="Poliza" header="Póliza" sortable></Column>
                            <Column field="Cheque" header="Cheque" sortable></Column>
                            <Column field="nombre" header="Nombre" sortable></Column>
                            <Column field="apellido_1" header="Apellido 1" sortable></Column>
                            <Column field="apellido_2" header="Apellido 2" sortable></Column>
                            <Column field="id_legal" header="RFC" sortable></Column>
                            <Column field="nombre_nomina" header="Nombre Nómina" sortable></Column>
                            <Column field="PERCEPCIONES" header="Percepciones" sortable></Column>
                            <Column field="DEDUCCIONES" header="Deducciones" sortable></Column>
                            <Column field="LIQUIDO" header="Líquido" sortable></Column>
                        </DataTable>
                    </>
                )}
            </div>
        </div>
    );
};

export default TotalChequesTable;
