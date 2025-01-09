import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TableRow, TableCell, Checkbox, TextField, IconButton } from "@mui/material";
import { Save, Close } from "@mui/icons-material";

const TableRowComponent = ({
    row,
    columns,
    editable,
    onSave,
    onCancel,
    isNewRow,
    handleSelectRow,
    selectedRows,
}) => {
    // Estado local para la edición de la fila
    const [isEditing, setIsEditing] = useState(false);
    const [editedRow, setEditedRow] = useState(row);

    // Efecto para actualizar editedRow cuando cambian row o isNewRow
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

    const handleSaveNewRow = () => {
        if (onInsert) {
            // Añade un ID único a la nueva fila antes de insertarla
            const newRowWithId = { ...newRowData, id: Date.now() }; // o usa una librería como uuid
            onInsert(newRowWithId);
        }
        setCreatingRow(false);
        setNewRowData({});
        setEditingRow(null);
    };

    const handleCancelClick = () => {
        onCancel();
        setIsEditing(false);
        // Restaurar los valores originales
        setEditedRow(row);
    };

    const handleInputChange = (colAccessor, value) => {
        setEditedRow((prevRow) => ({
            ...prevRow,
            [colAccessor]: value,
        }));
    };

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
            {/* Renderizar acciones solo si la fila está en edición o creación */}
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
        </TableRow>
    );
};

TableRowComponent.propTypes = {
    row: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    editable: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isNewRow: PropTypes.bool,
    handleSelectRow: PropTypes.func,
    selectedRows: PropTypes.array,
};

export default TableRowComponent;