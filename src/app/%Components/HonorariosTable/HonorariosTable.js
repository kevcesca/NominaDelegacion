'use client';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './honorarios.module.css'; // Reutilizando el estilo existente

const CustomTable = () => {
    const [data, setData] = useState([]); // Estado para almacenar los datos
    const toast = useRef(null);
    const dt = useRef(null);

    const loadData = async () => {
        try {
            const response = await axios.get('URL_DEL_SERVICIO'); // Reemplaza con la URL real de tu servicio

            const responseData = response.data;

            if (responseData.length > 0) {
                setData(responseData); // Almacena los datos en el estado
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Datos cargados correctamente', life: 3000 });
            } else {
                toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se encontraron datos.', life: 3000 });
                setData([]); // Limpia la tabla si no hay datos
            }
        } catch (error) {
            const errorMessage = 'Hubo un error al cargar los datos';
            toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
            setData([]); // Limpia la tabla si hay un error
        }
    };

    const generarPDF = async () => {
        try {
            const response = await axios.post('/api/generatePdf', { data });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'datos.pdf';
            a.click();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al generar el PDF', life: 3000 });
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Tabla Personalizada</h4>
            <Button type="button" icon="pi pi-file" label="Exportar" onClick={generarPDF} className={styles.submitButton} />
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" right={header}></Toolbar>
                <Button label="Cargar Datos" onClick={loadData} className={styles.submitButton} />
                <DataTable ref={dt} value={data} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} dataKey="identificador">
                    <Column field="unidad_administrativa" header="Unidad Administrativa" sortable></Column>
                    <Column field="subprograma" header="Subprograma" sortable></Column>
                    <Column field="nombre_empleado" header="Nombre Empleado" sortable></Column>
                    <Column field="nombre_puesto" header="Nombre Puesto" sortable></Column>
                    <Column field="folio" header="Folio" sortable></Column>
                    <Column field="fecha_pago" header="Fecha de Pago" sortable></Column>
                    <Column field="numero_cuenta" header="Número de Cuenta" sortable></Column>
                    <Column field="banco" header="Banco" sortable></Column>
                    <Column field="agencia" header="Agencia" sortable></Column>
                    <Column field="cuenta_dispersora" header="Cuenta Dispersora" sortable></Column>
                    <Column field="cuenta_emisora" header="Cuenta Emisora" sortable></Column>
                    <Column field="percepciones" header="Percepciones" sortable></Column>
                    <Column field="deducciones" header="Deducciones" sortable></Column>
                    <Column field="liquido" header="Líquido" sortable></Column>
                    <Column field="concepto_1_id" header="Concepto 1 ID" sortable></Column>
                    <Column field="valor_concepto_1" header="Valor Concepto 1" sortable></Column>
                    <Column field="concepto_2_id" header="Concepto 2 ID" sortable></Column>
                    <Column field="valor_concepto_2" header="Valor Concepto 2" sortable></Column>
                    <Column field="nombre_beneficiario" header="Nombre Beneficiario" sortable></Column>
                    <Column field="valor_beneficiario" header="Valor Beneficiario" sortable></Column>
                    <Column field="identificador" header="Identificador" sortable></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default CustomTable;
