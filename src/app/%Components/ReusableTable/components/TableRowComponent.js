import React from "react";
import PropTypes from "prop-types";
import { TableRow, TableCell, Checkbox, TextField, IconButton } from "@mui/material";
import { Save, Close, Delete } from "@mui/icons-material";

const TableRowComponent = ({
    row,
    columns,
    editable,
    deletable,
    editingRow,
    setEditedData,
    onSave,
    onCancel,
    isNewRow,
    handleSelectRow,
    selectedRows,
    onDelete,
}) => (
    <TableRow
        onDoubleClick={() => editable && !isNewRow && setEditedData(row)}
        style={{ cursor: editable ? "pointer" : "default" }}
    >
        <TableCell padding="checkbox">
            {!isNewRow && (
                <Checkbox
                    checked={Array.isArray(selectedRows) && selectedRows.includes(row)}
                    onChange={() => handleSelectRow(row)}
                />
            )}
        </TableCell>
        {columns.map((col, colIndex) => (
            <TableCell key={colIndex}>
                {editingRow === row || isNewRow ? (
                    <TextField
                        value={row[col.accessor] || ""}
                        onChange={(e) =>
                            setEditedData((prev) => ({
                                ...prev,
                                [col.accessor]: e.target.value,
                            }))
                        }
                        size="small"
                    />
                ) : (
                    row[col.accessor] || ""
                )}
            </TableCell>
        ))}
        {(editingRow === row || isNewRow) && (
            <TableCell>
                <IconButton color="success" onClick={onSave}>
                    <Save />
                </IconButton>
                <IconButton color="error" onClick={onCancel}>
                    <Close />
                </IconButton>
            </TableCell>
        )}
        {!editingRow && !isNewRow && deletable && (
            <TableCell>
                <IconButton color="error" onClick={() => onDelete(row)}>
                    <Delete />
                </IconButton>
            </TableCell>
        )}
    </TableRow>
);

TableRowComponent.propTypes = {
    row: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    editable: PropTypes.bool,
    deletable: PropTypes.bool,
    editingRow: PropTypes.object,
    setEditedData: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isNewRow: PropTypes.bool,
    handleSelectRow: PropTypes.func,
    selectedRows: PropTypes.array,
    onDelete: PropTypes.func,
};

export default TableRowComponent;
