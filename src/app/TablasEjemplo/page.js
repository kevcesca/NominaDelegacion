"use client";
import { useState } from "react";
import ReusableTable from "../%Components/ReusableTable/ReusableTable";

const columns = [
    { label: "Nombre", accessor: "col1" },
    { label: "Apellido", accessor: "col2" },
    { label: "Email", accessor: "col3" },
];

// Datos iniciales con ID único
const initialData = [
    { id: 1, col1: "Chino", col2: "Dato de Aaron", col3: "Aqui no se que poner jeje" },
    { id: 2, col1: "Gary", col2: "Dato 2", col3: "Dato 3" },
    { id: 3, col1: "Dato 1", col2: "Dato 2", col3: "Dato 3" },
    { id: 4, col1: "Dato 1", col2: "Dato 2", col3: "Dato 3" },
    { id: 5, col1: "Dato 1", col2: "Dato 2", col3: "Dato 3" },
];

export default function ExamplePage() {
    const [data, setData] = useState(initialData);

    const handleEdit = (editedRow) => {
        console.log("Editando:", editedRow);
        setData((prevData) =>
            prevData.map((row) => {
                // Encuentra la fila por ID
                if (row.id === editedRow.id) {
                    return editedRow;
                }
                return row;
            })
        );
    };

    const handleDelete = (row) => {
        console.log("Eliminando:", row);
        // Aquí puedes implementar la lógica para eliminar el elemento
    };

    const handleInsert = (newRow) => {
        console.log("Creando nuevo elemento:", newRow);
        // Asigna un ID único a la nueva fila
        const newRowWithId = { ...newRow, id: Date.now() };
        setData([...data, newRowWithId]);
    };

    return (
        <ReusableTable
            columns={columns}
            data={data}
            editable
            deletable
            insertable
            onEdit={handleEdit}
            onDelete={handleDelete}
            onInsert={handleInsert}
        />
    );
}