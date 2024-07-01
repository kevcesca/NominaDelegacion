import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { ComparativeService } from './ComparativeService';
import styles from './ComparativeTable.module.css';

export default function ComparativeTable() {
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id: { value: null, matchMode: FilterMatchMode.CONTAINS },
        idEmpleado: { value: null, matchMode: FilterMatchMode.CONTAINS },
        empleado: { value: null, matchMode: FilterMatchMode.CONTAINS },
        percepciones: { value: null, matchMode: FilterMatchMode.CONTAINS },
        deducciones: { value: null, matchMode: FilterMatchMode.CONTAINS },
        liquido: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cuenta: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState([
        { label: 'No coinciden', value: 'noCoinciden' },
        { label: 'Cambio de cuenta', value: 'cambioCuenta' },
        { label: 'Incompleto', value: 'incompleto' },
        { label: 'Ok', value: 'ok' }
    ]);

    useEffect(() => {
        ComparativeService.getData().then((data) => {
            setCustomers(data);
            setLoading(false);
        });
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar por palabra clave" />
                </span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        if (rowData.status === 'noCoinciden') {
            return <Tag value="No coinciden" severity="danger" />;
        } else if (rowData.status === 'cambioCuenta') {
            return <Tag value="Cambio de cuenta" severity="warning" />;
        } else if (rowData.status === 'incompleto') {
            return <Tag value="Incompleto" severity="info" />;
        } else {
            return <Tag value="Ok" severity="success" />;
        }
    };

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} placeholder="Seleccionar uno" className="p-column-filter" showClear />
        );
    };

    const rowClassName = (data) => {
        return {
            [styles.noCoinciden]: data.status === 'noCoinciden',
            [styles.cambioCuenta]: data.status === 'cambioCuenta',
            [styles.incompleto]: data.status === 'incompleto',
            [styles.ok]: data.status === 'ok',
        };
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable value={customers} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                globalFilterFields={['id', 'idEmpleado', 'empleado', 'percepciones', 'deducciones', 'liquido', 'cuenta', 'status']} header={header} emptyMessage="No se encontraron registros."
                rowClassName={rowClassName}>
                <Column field="id" header="No." filter filterPlaceholder="Buscar por ID" style={{ minWidth: '10rem' }} />
                <Column field="idEmpleado" header="ID EMPLEADO" filter filterPlaceholder="Buscar por empleado" style={{ minWidth: '10rem' }} />
                <Column field="empleado" header="NOMBRE" filter filterPlaceholder="Buscar por nombre" style={{ minWidth: '10rem' }} />
                <Column field="percepciones" header="PERCEPCIONES" filter filterPlaceholder="Buscar por percepciones" style={{ minWidth: '10rem' }} />
                <Column field="deducciones" header="DEDUCCIONES" filter filterPlaceholder="Buscar por deducciones" style={{ minWidth: '10rem' }} />
                <Column field="liquido" header="LIQUIDO" filter filterPlaceholder="Buscar por líquido" style={{ minWidth: '10rem' }} />
                <Column field="cuenta" header="CUENTA" filter filterPlaceholder="Buscar por cuenta" style={{ minWidth: '10rem' }} />
                <Column field="status" header="STATUS" filter filterElement={statusRowFilterTemplate} style={{ minWidth: '10rem', maxWidth: '12rem' }} body={statusBodyTemplate} />
            </DataTable>
        </div>
    );
}
