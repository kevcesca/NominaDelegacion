import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { DataService } from './DataService';
import styles from './DataTableExample.module.css';

export default function DataTableExample() {
    const [transactions, setTransactions] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id: { value: null, matchMode: FilterMatchMode.CONTAINS },
        fecha_op: { value: null, matchMode: FilterMatchMode.CONTAINS },
        fecha_val: { value: null, matchMode: FilterMatchMode.CONTAINS },
        monto: { value: null, matchMode: FilterMatchMode.CONTAINS },
        codigo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        descrp: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cheque: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cargo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        abono: { value: null, matchMode: FilterMatchMode.CONTAINS },
        saldo: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        DataService.getData().then((data) => {
            setTransactions(data);
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

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable value={transactions} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                globalFilterFields={['id', 'fecha_op', 'fecha_val', 'monto', 'codigo', 'descrp', 'cheque', 'cargo', 'abono', 'saldo']} 
                header={header} emptyMessage="No se encontraron registros."
                className={styles.dataTable}>

                <Column field="id" header="ID" filter filterPlaceholder="Buscar por ID" style={{ minWidth: '8rem' }} />
                <Column field="fecha_op" header="Fecha Operación" filter filterPlaceholder="Buscar por Fecha Op." style={{ minWidth: '10rem' }} />
                <Column field="fecha_val" header="Fecha Validación" filter filterPlaceholder="Buscar por Fecha Val." style={{ minWidth: '10rem' }} />
                <Column field="monto" header="Monto" filter filterPlaceholder="Buscar por Monto" style={{ minWidth: '8rem' }} />
                <Column field="codigo" header="Código" filter filterPlaceholder="Buscar por Código" style={{ minWidth: '8rem' }} />
                <Column field="descrp" header="Descripción" filter filterPlaceholder="Buscar por Descripción" style={{ minWidth: '14rem' }} />
                <Column field="cheque" header="Cheque" filter filterPlaceholder="Buscar por Cheque" style={{ minWidth: '8rem' }} />
                <Column field="cargo" header="Cargo" filter filterPlaceholder="Buscar por Cargo" style={{ minWidth: '8rem' }} />
                <Column field="abono" header="Abono" filter filterPlaceholder="Buscar por Abono" style={{ minWidth: '8rem' }} />
                <Column field="saldo" header="Saldo" filter filterPlaceholder="Buscar por Saldo" style={{ minWidth: '10rem' }} />
            </DataTable>
        </div>
    );
}
