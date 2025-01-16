import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TableRow, TableCell, Checkbox, TextField, IconButton } from "@mui/material";
import { Save, Close, Delete as DeleteIcon } from "@mui/icons-material";

const TableRowComponent = ({
    row,
    columns,
    editable,
    deletable, // Nueva prop para controlar la eliminación
    onSave,
    onCancel,
    onDelete, // Función para eliminar la fila
    isNewRow,
    handleSelectRow,
    selectedRows,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedRow, setEditedRow] = useState(row);

    useEffect(() => {
        setEditedRow(row);
    }, [row, isNewRow]);

    const handleDoubleClick = () => {
        if (editable && !isNewRow) {
            setIsEditing(true);
        }
    };

    const handleSaveClick = () => {
        onSave(editedRow);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        onCancel();
        setIsEditing(false);
        setEditedRow(row);
    };

    const handleInputChange = (colAccessor, value) => {
        setEditedRow((prevRow) => ({
            ...prevRow,
            [colAccessor]: value,
        }));
    };

    const handleDeleteClick = () => {
        if (onDelete) {
            onDelete(row); // Llama a la función de eliminación con la fila actual
        }
    };

    console.log("TableRowComponent deletable prop:", deletable);
    console.log("Soy un consolelog de tablerowcomponent");


    return (
        <TableRow onDoubleClick={handleDoubleClick} style={{ cursor: editable ? "pointer" : "default" }}>
            {/* Celda de selección */}
            <TableCell padding="checkbox">
                {!isNewRow && (
                    <Checkbox
                        checked={Array.isArray(selectedRows) && selectedRows.includes(row)}
                        onChange={() => handleSelectRow(row)}
                    />
                )}
            </TableCell>
            {/* Renderizar columnas */}
            {columns.map((col) => (
                <TableCell key={col.accessor}>
                    {isEditing || isNewRow ? (
                        <TextField
                            value={editedRow[col.accessor] || ""}
                            onChange={(e) => handleInputChange(col.accessor, e.target.value)}
                            size="small"
                            variant="standard"
                            InputProps={{
                                disableUnderline: !isEditing && !isNewRow,
                            }}
                        />
                    ) : (
                        row[col.accessor] || ""
                    )}
                </TableCell>
            ))}
            {/* Renderizar acciones de guardar/cancelar si está en edición o creación */}
            {(isEditing || isNewRow) && (
                <TableCell>
                    <IconButton color="success" onClick={handleSaveClick}>
                        <Save />
                    </IconButton>
                    <IconButton color="error" onClick={handleCancelClick}>
                        <Close />
                    </IconButton>
                </TableCell>
            )}
            {/* Renderizar botón de eliminar solo si `deletable` es true y no es nueva fila */}
            {deletable && !isNewRow && (
                <TableCell>
                    <IconButton color="error" onClick={handleDeleteClick}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            )}
        </TableRow>
    );
};

TableRowComponent.propTypes = {
    row: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    editable: PropTypes.bool,
    deletable: PropTypes.bool, // Se agrega a las propTypes
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func, // Se agrega a las propTypes
    isNewRow: PropTypes.bool,
    handleSelectRow: PropTypes.func,
    selectedRows: PropTypes.array,
};

export default TableRowComponent;
