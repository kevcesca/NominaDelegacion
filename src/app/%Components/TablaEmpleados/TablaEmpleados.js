"use client"

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import 'primereact/resources/themes/saga-blue/theme.css';  
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import API_BASE_URL from '../../%Config/apiConfig'

export default function TablaEmpleados() {
    const [empleados, setEmpleados] = useState([]);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dt = useRef(null);

    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                setIsLoading(true); // Mostrar la barra de carga
                const response = await fetch(`${API_BASE_URL}/empleados`);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const data = await response.json();
                setEmpleados(data);
            } catch (error) {
                console.error('Error fetching the empleados:', error);
            } finally {
                setIsLoading(false); // Ocultar la barra de carga
            }
        };

        fetchEmpleados();
    }, []);

    const handleRowDoubleClick = (rowData) => {
        setSelectedEmpleado(rowData);
        setIsDialogVisible(true);
    };

    const formatDate = (value) => {
        if (!value) return '';
        const date = new Date(value);
        const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
        const localDate = new Date(date.getTime() + offset); // convert to local time
        return localDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h4 className="m-0">Empleados</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const empleadoDialogFooter = (
        <div className="flex justify-content-end">
            <button onClick={() => setIsDialogVisible(false)} className="p-button p-component p-button-text">
                Cerrar
            </button>
        </div>
    );

    return (
        <div className="card">
            {isLoading ? (
                <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
            ) : (
                <DataTable ref={dt} value={empleados} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    dataKey="idEmpleado" onRowDoubleClick={(e) => handleRowDoubleClick(e.data)} globalFilter={globalFilter} header={header}>
                    <Column field="idEmpleado" header="ID" sortable style={{ minWidth: '100px' }}></Column>
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="apellido1" header="Apellido Paterno" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="apellido2" header="Apellido Materno" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="curp" header="CURP" sortable style={{ minWidth: '200px' }}></Column>
                    <Column field="idLegal" header="ID Legal" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="fecNac" header="Fecha de Nacimiento" body={(rowData) => formatDate(rowData.fecNac)} sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="fecAltaEmpleado" header="Fecha de Alta" body={(rowData) => formatDate(rowData.fecAltaEmpleado)} sortable style={{ minWidth: '150px' }}></Column>
                </DataTable>
            )}

            <Dialog header="Detalles del Empleado" visible={isDialogVisible} style={{ width: '50vw' }} modal footer={empleadoDialogFooter} onHide={() => setIsDialogVisible(false)}>
                {selectedEmpleado && (
                    <div>
                        <p><strong>ID:</strong> {selectedEmpleado.idEmpleado}</p>
                        <p><strong>Nombre:</strong> {selectedEmpleado.nombre}</p>
                        <p><strong>Apellido Paterno:</strong> {selectedEmpleado.apellido1}</p>
                        <p><strong>Apellido Materno:</strong> {selectedEmpleado.apellido2}</p>
                        <p><strong>CURP:</strong> {selectedEmpleado.curp}</p>
                        <p><strong>ID Legal:</strong> {selectedEmpleado.idLegal}</p>
                        <p><strong>Sexo:</strong> {selectedEmpleado.idSexo}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {formatDate(selectedEmpleado.fecNac)}</p>
                        <p><strong>Fecha de Alta:</strong> {formatDate(selectedEmpleado.fecAltaEmpleado)}</p>
                        <p><strong>Fecha de Antigüedad:</strong> {formatDate(selectedEmpleado.fecAntiguedad)}</p>
                        <p><strong>Número de Seguro Social:</strong> {selectedEmpleado.numeroSs}</p>
                        <p><strong>Días Laborados:</strong> {selectedEmpleado.diasLab}</p>
                        <p><strong>ID_REG_ISSSTE: </strong> {selectedEmpleado.idRegIssste}</p>
                        <p><strong>AHORR_SOLI_PORC: </strong> {selectedEmpleado.ahorrSoliPorc}</p>
                        <p><strong>Estado:</strong> {selectedEmpleado.estado}</p>
                        <p><strong>Delegación/Municipio:</strong> {selectedEmpleado.delegMunic}</p>
                        <p><strong>Población:</strong> {selectedEmpleado.poblacion}</p>
                        <p><strong>Colonia:</strong> {selectedEmpleado.colonia}</p>
                        <p><strong>Dirección:</strong> {selectedEmpleado.direccion}</p>
                        <p><strong>Código Postal:</strong> {selectedEmpleado.codigoPostal}</p>
                        <p><strong>Número Interior:</strong> {selectedEmpleado.numInterior}</p>
                        <p><strong>Número Exterior:</strong> {selectedEmpleado.numExterior}</p>
                        <p><strong>Calle:</strong> {selectedEmpleado.calle}</p>
                        <p><strong>Nombre Delegación/Municipio:</strong> {selectedEmpleado.nDelegacionMunicipio}</p>
                        <p><strong>Entidad Federativa:</strong> {selectedEmpleado.entFederativa}</p>
                        <p><strong>Sector Presupuestal:</strong> {selectedEmpleado.sectPres}</p>
                        <p><strong>Nombre del Puesto:</strong> {selectedEmpleado.nPuesto}</p>
                        <p><strong>FECHA_INSERCION:</strong> {formatDate(selectedEmpleado.fechaInsercion)}</p>
                        <p><strong>FECHA_CAMBIO:</strong> {formatDate(selectedEmpleado.fechaCambio)}</p>
                        <p><strong>Activo:</strong> {selectedEmpleado.activo ? "Sí" : "No"}</p>
                    </div>
                )}
            </Dialog>
        </div>
    );
}
