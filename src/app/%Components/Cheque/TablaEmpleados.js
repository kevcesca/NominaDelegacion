// src/app/%Components/TotalConceptosTable/TotalChequesTable.js
'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Select, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './Cheque.module.css';

const toolbarButtonStyles = {
    backgroundColor: '#358874',
    borderColor: '#358874',
    color: '#fff'
};

const TotalChequesTable = () => {
    const [cheques, setCheques] = useState([]);
    const [anio, setAnio] = useState('2024');
    const [quincena, setQuincena] = useState('01');
    const dt = useRef(null);
    const toast = useRef(null);
    const router = useRouter();

    useEffect(() => {
        loadCheques();
    }, [anio, quincena]);

    const loadCheques = async () => {
        try {
            const response = await axios.get(`http://192.168.100.77:8080/consultaEmpleados/TotalesCheques?anio=${anio}&quincena=${quincena}`);
            setCheques(response.data);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los datos', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const generateCheques = () => {
        router.push('/ListaCheques/GenerarCheques');
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

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Totales de Cheques</h4>
            <div>
                <Button type="button" icon="pi pi-file" label="Exportar" onClick={exportCSV} style={toolbarButtonStyles} />
                <Button type="button" icon="pi pi-check" label="Generar Cheques" onClick={generateCheques} style={{...toolbarButtonStyles, marginLeft: '10px'}} />
            </div>
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <div className={styles.selectorContainer}>
                    <Select value={quincena} onChange={(e) => setQuincena(e.target.value)} variant="outlined">
                        {quincenas.map((quin, index) => (
                            <MenuItem key={index} value={quin.value}>
                                {quin.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select value={anio} onChange={(e) => setAnio(e.target.value)} variant="outlined">
                        {[...Array(21).keys()].map(n => (
                            <MenuItem key={2024 + n} value={2024 + n}>
                                Año {2024 + n}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                <Toolbar className="mb-4" right={header}></Toolbar>
                <DataTable ref={dt} value={cheques} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} dataKey="id_empleado">
                    <Column field="id_empleado" header="ID Empleado" sortable></Column>
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="apellido_1" header="Apellido 1" sortable></Column>
                    <Column field="apellido_2" header="Apellido 2" sortable></Column>
                    <Column field="id_legal" header="RFC" sortable></Column>
                    <Column field="nombre_nomina" header="Nombre Nómina" sortable></Column>
                    <Column field="poliza" header="Póliza" sortable></Column>
                    <Column field="cheque" header="Cheque" sortable></Column>
                    <Column field="percepciones" header="Percepciones" sortable></Column>
                    <Column field="deducciones" header="Deducciones" sortable></Column>
                    <Column field="liquido" header="Líquido" sortable></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default TotalChequesTable;
