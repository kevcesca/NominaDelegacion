"use client";
import ReusableTable from "../%Components/ReusableTable/ReusableTable";

const columns = [
    { label: "Nombre", accessor: "col1" },
    { label: "Apellido", accessor: "col2" },
    { label: "Email", accessor: "col3" },
];

const data = [
    { col1: "Chino", col2: "Dato de Aaron", col3: "Aqui no se que poner jeje" },
    { col1: "Gary", col2: "Dato 2", col3: "Dato 3" },
    { col1: "Dato 1", col2: "Dato 2", col3: "Dato 3" },
    { col1: "Dato 1", col2: "Dato 2", col3: "Dato 3" },
    { col1: "Dato 1", col2: "Dato 2", col3: "Dato 3" },
];

export default function ExamplePage() {
    const handleEdit = (row) => {
        console.log("Editando:", row);
        // Aquí puedes implementar la lógica para guardar los cambios
    };

    const handleDelete = (row) => {
        console.log("Eliminando:", row);
        // Aquí puedes implementar la lógica para eliminar el elemento
    };

    const handleInsert = (newRow) => {
        console.log("Creando nuevo elemento:", newRow);
        // Aquí puedes implementar la lógica para agregar el nuevo elemento
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
            onInsert={handleInsert} // Recibe los datos de la nueva fila creada
        />
    );
}
