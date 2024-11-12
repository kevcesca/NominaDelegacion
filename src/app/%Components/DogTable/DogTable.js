"use client"

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';

export default function DogTable() {
    const [dogs, setDogs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // Función para obtener los datos desde el EndPointGet
    useEffect(() => {
        const fetchDogs = async () => {
            try {
                const response = await axios.get('http://localhost:3001/dogs');
                setDogs(response.data);
            } catch (error) {
                console.error('Error fetching dog data:', error);
            }
        };
        fetchDogs();
    }, []);

    // Función que se ejecuta cuando se completa la edición de una fila
    const onRowEditComplete = async (e) => {
        let updatedDogs = [...dogs];
        let { newData, index } = e;

        updatedDogs[index] = newData;
        setDogs(updatedDogs);

        // Realiza el POST al EndPointSet
        try {
            await axios.post('http://localhost:3001/dogs', updatedDogs[index]);
            console.log('Dog information updated successfully.');
        } catch (error) {
            console.error('Error updating dog information:', error);
        }
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const sizeEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const lifespanEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    return (
        <div className="card p-fluid">
            <h2>Dog Breeds Information</h2>
            <DataTable value={dogs} editMode="row" dataKey="breed" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                <Column field="breed" header="Breed" editor={(options) => textEditor(options)} style={{ width: '30%' }}></Column>
                <Column field="averageSize" header="Average Size" editor={(options) => sizeEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="lifespan" header="Lifespan" editor={(options) => lifespanEditor(options)} style={{ width: '20%' }}></Column>
                <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </div>
    );
}
