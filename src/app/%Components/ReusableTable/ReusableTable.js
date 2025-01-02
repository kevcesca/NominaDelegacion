import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Table,
    TableBody,
    TableContainer,
    Paper,
    TablePagination,
} from "@mui/material";
import styles from "./ReusableTable.module.css";
import Header from "./components/Header";
import TableHeaderRow from "./components/TableHeaderRow";
import TableRowComponent from "./components/TableRowComponent";

const ReusableTable = ({
    columns,
    data,
    editable = false,
    deletable = false,
    insertable = false,
    onEdit,
    onDelete,
    onInsert,
}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editingRow, setEditingRow] = useState(null); // Fila actualmente en edición
    const [editedData, setEditedData] = useState({}); // Datos editados de la fila
    const [creatingRow, setCreatingRow] = useState(false); // Indica si se está creando una nueva fila
    const [newRowData, setNewRowData] = useState({}); // Datos de la nueva fila

    // Iniciar creación de una nueva fila
    const handleCreate = () => {
        // Validar que columns tenga estructura válida
        if (!Array.isArray(columns) || columns.some((col) => !col || !col.accessor)) {
            console.error("Las columnas no tienen el formato esperado.");
            return;
        }

        const emptyRow = columns.reduce((acc, col) => ({ ...acc, [col.accessor]: "" }), {});
        setCreatingRow(true);
        setNewRowData(emptyRow);
        setEditingRow(emptyRow);
    };


    // Guardar la nueva fila
    const handleSaveNewRow = () => {
        if (onInsert) {
            onInsert(newRowData); // Ejecutar la función `onInsert`
        }
        setCreatingRow(false);
        setNewRowData({});
        setEditingRow(null); // Salir del modo de edición
    };

    // Cancelar la creación de la nueva fila
    const handleCancelNewRow = () => {
        setCreatingRow(false);
        setNewRowData({});
        setEditingRow(null); // Salir del modo de edición
    };

    // Doble clic para editar una fila existente
    const handleDoubleClick = (row) => {
        setEditingRow(row);
        setEditedData({ ...row });
    };

    // Guardar cambios de edición
    const handleSave = () => {
        if (onEdit) {
            onEdit(editedData);
        }
        setEditingRow(null);
        setEditedData({});
    };

    // Cancelar edición
    const handleCancel = () => {
        setEditingRow(null);
        setEditedData({});
    };

    // Filtrar datos según la búsqueda
    const [searchQuery, setSearchQuery] = useState("");
    const filteredData = data.filter((row) =>
        columns.some((col) =>
            (row[col.accessor] || row[col] || "")
                .toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
    );

    return (
        <Paper className={styles.tableContainer}>
            <Header
                insertable={insertable}
                onInsert={handleCreate} // Inicia la creación de una nueva fila
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <TableContainer>
                <Table>
                    <TableHeaderRow
                        columns={columns}
                        deletable={deletable}
                        data={data}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                    />
                    <TableBody>
                        {/* Nueva fila vacía para crear, en modo edición */}
                        {creatingRow && (
                            <TableRowComponent
                                row={newRowData}
                                columns={columns}
                                editable
                                isNewRow // Prop para identificar que es una fila nueva
                                editingRow={newRowData} // Indicar que esta fila está en edición
                                setEditedData={setNewRowData} // Actualizar datos de la nueva fila
                                onSave={handleSaveNewRow} // Guardar la nueva fila
                                onCancel={handleCancelNewRow} // Cancelar la creación
                            />
                        )}

                        {/* Filas existentes */}
                        {filteredData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRowComponent
                                    key={index}
                                    row={row}
                                    columns={columns}
                                    editable={editable}
                                    deletable={deletable}
                                    editingRow={editingRow}
                                    setEditingRow={setEditingRow}
                                    editedData={editedData}
                                    setEditedData={setEditedData}
                                    onDelete={onDelete}
                                    handleSave={handleSave}
                                    handleCancel={handleCancel}
                                    handleSelectRow={(row) => {
                                        const isSelected = selectedRows.includes(row);
                                        setSelectedRows((prev) =>
                                            isSelected
                                                ? prev.filter((r) => r !== row)
                                                : [...prev, row]
                                        );
                                    }}
                                    selectedRows={selectedRows}
                                    handleDoubleClick={handleDoubleClick}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
        </Paper>
    );
};

ReusableTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            accessor: PropTypes.string.isRequired,
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    editable: PropTypes.bool,
    deletable: PropTypes.bool,
    insertable: PropTypes.bool,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onInsert: PropTypes.func,
};


export default ReusableTable;
