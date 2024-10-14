// src/app/%Components/ChequeConfirmationModal/ChequeConfirmationModal.js
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const ChequeConfirmationModal = ({ empleados, onCerrar }) => {
    return (
        <div>
            <h3>Empleados que recibirán Cheques</h3>
            <DataTable value={empleados} paginator rows={5} responsiveLayout="scroll">
                <Column field="nombreEmpleado" header="Nombre del Empleado" sortable style={{ minWidth: '200px' }}></Column>
                <Column field="monto" header="Monto" sortable style={{ minWidth: '100px' }}></Column>
                <Column field="tipoNomina" header="Tipo de Nómina" sortable style={{ minWidth: '150px' }}></Column>
            </DataTable>

            <div style={{ marginTop: '20px' }}>
                <Button label="Confirmar" icon="pi pi-check" onClick={onCerrar} />
                <Button label="Cancelar" className="p-button-secondary" onClick={onCerrar} />
            </div>
        </div>
    );
};

export default ChequeConfirmationModal;
