// src/app/%Components/TablaEmpleados/TablaEmpleados.js
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'; // Usaremos PrimeReact Dialog como modal
import ChequeConfirmationModal from '../ChequeConfirmationModal/ChequeConfirmationModal'; // Componente para la confirmación
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './TablaPagosEmpleados.module.css';

const TablaEmpleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [cambios, setCambios] = useState([]); // Lista de cambios
    const [showModal, setShowModal] = useState(false); // Control de visibilidad del modal
    const tiposPago = [
        { label: 'Cheque', value: 'Cheque' },
        { label: 'Depósito', value: 'Depósito' }
    ];

    // Carga de datos desde el localStorage o inicialización
    useEffect(() => {
        const storedEmpleados = JSON.parse(localStorage.getItem('empleados'));
        if (storedEmpleados) {
            setEmpleados(storedEmpleados);
        } else {
            const cheques = [
                { id: 'cheque-1', nombreEmpleado: 'Juan Pérez', monto: 5000, tipoNomina: 'Quincenal', tipoPago: 'Cheque', numeroCuenta: '' },
                { id: 'cheque-2', nombreEmpleado: 'María García', monto: 6000, tipoNomina: 'Mensual', tipoPago: 'Cheque', numeroCuenta: '' },
                { id: 'cheque-3', nombreEmpleado: 'Pedro Rodríguez', monto: 5500, tipoNomina: 'Quincenal', tipoPago: 'Cheque', numeroCuenta: '' },
                // ... más cheques
            ];
            const depositos = [
                { id: 'deposito-1', nombreEmpleado: 'Carlos López', monto: 5500, tipoNomina: 'Quincenal', tipoPago: 'Depósito', numeroCuenta: '1234567890' },
                { id: 'deposito-2', nombreEmpleado: 'Ana Martínez', monto: 7000, tipoNomina: 'Mensual', tipoPago: 'Depósito', numeroCuenta: '0987654321' },
                { id: 'deposito-3', nombreEmpleado: 'Sofia Hernández', monto: 6000, tipoNomina: 'Quincenal', tipoPago: 'Depósito', numeroCuenta: '1122334455' },
                // ... más depósitos
            ];
            const initialData = [...cheques, ...depositos];
            setEmpleados(initialData);
            localStorage.setItem('empleados', JSON.stringify(initialData));
        }
    }, []);

    // Función para gestionar cambios en el tipo de pago
    const onTipoPagoChange = (newTipoPago, rowData) => {
        const updatedEmpleados = empleados.map((empleado) => {
            if (empleado.id === rowData.id) {
                return { ...empleado, tipoPago: newTipoPago };
            }
            return empleado;
        });

        setEmpleados(updatedEmpleados);
        localStorage.setItem('empleados', JSON.stringify(updatedEmpleados));

        // Registro de cambios
        setCambios((prevCambios) => [
            ...prevCambios,
            { id: rowData.id, nombreEmpleado: rowData.nombreEmpleado, nuevoTipoPago: newTipoPago }
        ]);

        console.log(`Cambio realizado en el empleado ${rowData.nombreEmpleado}: tipo de pago actualizado a ${newTipoPago}`);
    };

    // Función para gestionar cambios en el número de cuenta
    const onNumeroCuentaChange = (newNumeroCuenta, rowData) => {
        const updatedEmpleados = empleados.map((empleado) => {
            if (empleado.id === rowData.id) {
                return { ...empleado, numeroCuenta: newNumeroCuenta };
            }
            return empleado;
        });

        setEmpleados(updatedEmpleados);
        localStorage.setItem('empleados', JSON.stringify(updatedEmpleados));
    };

    // Filtra empleados con tipo de pago "Cheque"
    const getEmpleadosConCheque = () => {
        return empleados.filter(empleado => empleado.tipoPago === 'Cheque');
    };

    // Abre el modal de confirmación de cheques
    const handleGenerarCheques = () => {
        setShowModal(true);
    };

    // Cierra el modal
    const handleCerrarModal = () => {
        setShowModal(false);
    };

    // Función para manejar el clic en el botón "Terminar"
    const handleTerminar = () => {
        if (cambios.length > 0) {
            console.log('Lista de cambios realizados:', cambios);
        } else {
            console.log('No se han realizado cambios.');
        }
    };

    // Renderiza el dropdown en la columna tipoPago
    const tipoPagoEditor = (rowData) => {
        return (
            <Dropdown
                value={rowData.tipoPago}
                options={tiposPago}
                onChange={(e) => onTipoPagoChange(e.value, rowData)}
                placeholder="Seleccionar"
            />
        );
    };

    // Renderiza el campo editable de número de cuenta
    const numeroCuentaEditor = (rowData) => {
        return (
            <InputText
                value={rowData.numeroCuenta}
                onChange={(e) => onNumeroCuentaChange(e.target.value, rowData)}
                disabled={rowData.tipoPago === 'Cheque'} // Deshabilita si el tipo de pago es "Cheque"
                placeholder="Número de Cuenta"
            />
        );
    };

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Administrar Empleados</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    return (
        <div>
            <DataTable
                value={empleados}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                responsiveLayout="scroll"
                globalFilter={globalFilter}
                header={header}
            >
                <Column field="nombreEmpleado" header="Nombre del Empleado" sortable style={{ minWidth: '200px' }}></Column>
                <Column field="monto" header="Monto" sortable style={{ minWidth: '100px' }}></Column>
                <Column field="tipoNomina" header="Tipo de Nómina" sortable style={{ minWidth: '150px' }}></Column>
                <Column
                    field="tipoPago"
                    header="Tipo de Pago"
                    body={tipoPagoEditor}
                    style={{ minWidth: '150px' }}
                    sortable
                ></Column>
                <Column
                    field="numeroCuenta"
                    header="Número de Cuenta"
                    body={numeroCuentaEditor}
                    style={{ minWidth: '200px' }}
                    sortable
                ></Column>
            </DataTable>

            {/* Botones para acciones */}
            <div className={styles.buttonContainer} style={{ marginTop: '20px' }}>
                <Button label="Terminar" icon="pi pi-check" onClick={handleTerminar} />
                <Button label="Generar cheques" onClick={handleGenerarCheques} />
            </div>

            {/* Modal para confirmar generación de cheques */}
            <Dialog header="Confirmar Cheques" visible={showModal} style={{ width: '50vw' }} onHide={handleCerrarModal}>
                <ChequeConfirmationModal empleados={getEmpleadosConCheque()} onCerrar={handleCerrarModal} />
            </Dialog>
        </div>
    );
};

export default TablaEmpleados;
