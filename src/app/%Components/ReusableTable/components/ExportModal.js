import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Checkbox,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ExportModal = ({ open, onClose, selectedRows, columns }) => {
    const [selectedColumns, setSelectedColumns] = useState(columns.map((col) => col.accessor));

    // Manejar la selección de columnas
    const handleColumnToggle = (accessor) => {
        setSelectedColumns((prev) =>
            prev.includes(accessor)
                ? prev.filter((col) => col !== accessor)
                : [...prev, accessor]
        );
    };

    // Exportar a CSV
    const exportToCSV = () => {
        const filteredData = selectedRows.map((row) =>
            selectedColumns.reduce((acc, accessor) => {
                acc[accessor] = row[accessor];
                return acc;
            }, {})
        );
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        XLSX.writeFile(workbook, "export.csv");
    };

    // Exportar a Excel
    const exportToExcel = () => {
        exportToCSV();
    };

    // Exportar a PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumns = selectedColumns.map((accessor) =>
            columns.find((col) => col.accessor === accessor)?.label || accessor
        );
        const tableData = selectedRows.map((row) =>
            selectedColumns.map((accessor) => row[accessor])
        );

        autoTable(doc, {
            head: [tableColumns],
            body: tableData,
        });
        doc.save("export.pdf");
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Exportar Datos</DialogTitle>
            <DialogContent>
                <div style={{ display: "flex", gap: "20px" }}>
                    <div>
                        <h3>Seleccionar Columnas</h3>
                        {columns.map((col) => (
                            <FormControlLabel
                                key={col.accessor}
                                control={
                                    <Checkbox
                                        checked={selectedColumns.includes(col.accessor)}
                                        onChange={() => handleColumnToggle(col.accessor)}
                                    />
                                }
                                label={col.label}
                            />
                        ))}
                    </div>
                    <TableContainer>
                        <h3>Vista Previa</h3>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {selectedColumns.map((accessor) => (
                                        <TableCell key={accessor}>
                                            {columns.find((col) => col.accessor === accessor)?.label ||
                                                accessor}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedRows.map((row, index) => (
                                    <TableRow key={index}>
                                        {selectedColumns.map((accessor) => (
                                            <TableCell key={accessor}>{row[accessor]}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={exportToPDF} color="primary">
                    Exportar PDF
                </Button>
                <Button onClick={exportToExcel} color="primary">
                    Exportar Excel
                </Button>
                <Button onClick={exportToCSV} color="primary">
                    Exportar CSV
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ExportModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    selectedRows: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
};

export default ExportModal;
