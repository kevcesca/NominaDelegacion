'use client'
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from './DataRecursos.jsx';

export default function TablaRecursos() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        ProductService.getProductsMini().then(data => setProducts(data));
    }, []);

    return (
        <div className="card">
            <DataTable value={products} sortMode="multiple" tableStyle={{ minWidth: '80rem' }}>
                <Column field="dispositivo" header="Dispositivo" sortable style={{ width: '20%' }}></Column>
                <Column field="ip" header="IP" sortable style={{ width: '20%' }}></Column>
                <Column field="recurso" header="Recurso" sortable style={{ width: '20%' }}></Column>
                <Column field="cantidad" header="Cantidad" sortable style={{ width: '20%' }}></Column>
                <Column field="metrica" header="Metrica" sortable style={{ width: '20%' }}></Column>
            </DataTable>
        </div>
    );
}
        