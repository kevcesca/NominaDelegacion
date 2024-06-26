'use client'
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from './DataHome.jsx';
import {
    IconButton,
    Collapse,
    Card,
    CardHeader,
    CardContent
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function TablaHome() {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        ProductService.getProducts().then(data => setProducts(data));
    }, []);

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <Card>
            <CardHeader
                title="Recursos"
                action={
                    <IconButton onClick={handleToggle}>
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                }
            />
            <Collapse in={open} timeout="auto" unmountOnExit>
                <CardContent>
                    <div className="card">
                        <DataTable value={products} sortMode="multiple" tableStyle={{ minWidth: '50rem' }}>
                            <Column field="dispositivo" header="Dispositivo" sortable style={{ width: '16%' }}></Column>
                            <Column field="ip" header="IP" sortable style={{ width: '16%' }}></Column>
                            <Column field="descripcion" header="Descripción" sortable style={{ width: '16%' }}></Column>
                            <Column field="recursos" header="Recursos" sortable style={{ width: '16%' }}></Column>
                            <Column field="aplicaciones" header="Aplicaciones" sortable style={{ width: '18%' }}></Column>
                            <Column field="red" header="Red" sortable style={{ width: '20%' }}></Column>
                        </DataTable>
                    </div>
                </CardContent>
            </Collapse>
        </Card>
    );
}

