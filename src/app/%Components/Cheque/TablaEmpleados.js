'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ChequeService } from './ChequeService';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import Cheque from './Cheque';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';  // o el tema que estés usando
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const buttonStyles = {
    backgroundColor: '#bc955c',
    borderColor: '#bc955c',
    color: '#fff'
};

const toolbarButtonStyles = {
    backgroundColor: '#358874',
    borderColor: '#358874',
    color: '#fff'
};

export default function TablaEmpleados() {
    const [cheques, setCheques] = useState([]);
    const [selectedCheque, setSelectedCheque] = useState(null);
    const dt = useRef(null);
    const toast = useRef(null);

    useEffect(() => {
        ChequeService.getCheques().then(data => setCheques(data));
    }, []);

    const generarCheque = (noEmpleado) => {
        const cheque = cheques.find(chq => chq.noEmpleado === noEmpleado);
        setSelectedCheque(cheque);
        toast.current.show({ severity: 'success', summary: 'Cheque Generado', detail: `Cheque para ${cheque.nombreBeneficiario} generado`, life: 3000 });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const actualizarEstado = (noEmpleado, nuevoEstado) => {
        ChequeService.actualizarEstado(noEmpleado, nuevoEstado).then(data => {
            setCheques(data);
            toast.current.show({ severity: 'success', summary: 'Estado Actualizado', detail: `Estado del cheque actualizado a ${nuevoEstado}`, life: 3000 });
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button label="Generar Cheque" onClick={() => generarCheque(rowData.noEmpleado)} style={buttonStyles} />
        );
    };

    const estadoBodyTemplate = (rowData) => {
        return (
            <Dropdown
                value={rowData.estado}
                options={[
                    { label: 'Entregado', value: 'Entregado' },
                    { label: 'Retenido', value: 'Retenido' },
                    { label: 'No entregado', value: 'No entregado' }
                ]}
                onChange={(e) => actualizarEstado(rowData.noEmpleado, e.value)}
                placeholder="Seleccionar Estado"
            />
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Exportar tabla</h4>
            <Button type="button" icon="pi pi-file" label="Exportar" onClick={exportCSV} style={toolbarButtonStyles} />
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" right={header}></Toolbar>
                <DataTable ref={dt} value={cheques} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} dataKey="noEmpleado">
                    <Column field="noEmpleado" header="No. de Empleado" sortable></Column>
                    <Column field="nombreBeneficiario" header="Nombre del Beneficiario" sortable></Column>
                    <Column field="importe" header="Importe" sortable></Column>
                    <Column field="estado" header="Estado" body={estadoBodyTemplate} sortable></Column>
                    <Column body={actionBodyTemplate} header="Acciones" exportable={false}></Column>
                </DataTable>
            </div>

            {selectedCheque && (
                <Cheque
                    polizaNo={selectedCheque.polizaNo}
                    noDe={selectedCheque.noDe}
                    noEmpleado={selectedCheque.noEmpleado}
                    nombreBeneficiario={selectedCheque.nombreBeneficiario}
                    importeLetra="" // Vacío como solicitaste
                    conceptoPago={selectedCheque.conceptoPago}
                    rfc={selectedCheque.rfc}
                    tipoNomina={selectedCheque.tipoNomina}
                    percepciones={selectedCheque.percepciones}
                    deducciones={selectedCheque.deducciones}
                    liquido={selectedCheque.liquido}
                    nombre={selectedCheque.nombreBeneficiario}
                    fecha={selectedCheque.fecha}
                />
            )}
        </div>
    );
}
