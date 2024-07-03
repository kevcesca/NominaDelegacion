import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import styles from './ReportTable.module.css'

const DynamicTable = ({ data, columns }) => {
    const [filters, setFilters] = React.useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [loading, setLoading] = React.useState(false);
    const [globalFilterValue, setGlobalFilterValue] = React.useState('');
    const [statuses] = React.useState([
        { label: 'No coinciden', value: 'noCoinciden' },
        { label: 'Cambio de cuenta', value: 'cambioCuenta' },
        { label: 'Incompleto', value: 'incompleto' },
        { label: 'Ok', value: 'ok' }
    ]);

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
            'noCoinciden': data.status === 'noCoinciden',
            'cambioCuenta': data.status === 'cambioCuenta',
            'incompleto': data.status === 'incompleto',
            'ok': data.status === 'ok',
        };
    };

    const header = renderHeader();

    return (
        <div className={styles.tableContainer}>
            <DataTable value={data} paginator rows={10} dataKey="REGISTRO" filters={filters} filterDisplay="row" loading={loading}
                globalFilterFields={columns} header={header} emptyMessage="No se encontraron registros."
                rowClassName={rowClassName}>
                {columns.map((col) => (
                    <Column key={col} field={col} header={col} filter filterPlaceholder={`Buscar por ${col}`} style={{ minWidth: '10rem' }} />
                ))}
            </DataTable>
        </div>
    );
};

export default DynamicTable;
