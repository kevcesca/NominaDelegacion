import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Button,
    Box,
    Menu,
    MenuItem,
} from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "../page.module.css";

const getDownloadURL = (quincena, anio, nombreEvidencia) => {
    const nombreSinExtension = removeFileExtension(nombreEvidencia);
    return `http://192.168.100.25:7080/Nomina/download/evidencias?quincena=${quincena}&anio=${anio}&tipo=Evidencias&nombre=${encodeURIComponent(
        nombreSinExtension
    )}`;
};

const removeFileExtension = (fileName) => {
    return fileName.split(".").slice(0, -1).join(".") || fileName;
};

export default function CancelacionesTable({ cancelaciones, loading, fechaSeleccionada }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    // Manejar la selección de filas
    const handleSelectRow = (id) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    // Abrir y cerrar menú
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Exportar datos seleccionados
    const exportToCSV = () => {
        const selectedData = cancelaciones.filter((item) => selectedRows.includes(item.id));
        const worksheet = XLSX.utils.json_to_sheet(selectedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Cancelaciones");
        XLSX.writeFile(workbook, "Cancelaciones.csv");
        handleMenuClose();
    };

    const exportToExcel = () => {
        const selectedData = cancelaciones.filter((item) => selectedRows.includes(item.id));
        const worksheet = XLSX.utils.json_to_sheet(selectedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Cancelaciones");
        XLSX.writeFile(workbook, "Cancelaciones.xlsx");
        handleMenuClose();
    };

    const exportToPDF = () => {
        const selectedData = cancelaciones.filter((item) => selectedRows.includes(item.id));
        const doc = new jsPDF();
        autoTable(doc, {
            head: [
                [
                    "ID Empleado",
                    "Folio Cheque",
                    "Número Quincena",
                    "Tipo Nómina",
                    "Motivo Cancelación",
                    "Fecha Cancelación",
                    "Monto",
                    "Evidencia",
                ],
            ],
            body: selectedData.map((item) => [
                item.id_empleado,
                item.folio_cheque,
                item.numero_quincena,
                item.tipo_nomina,
                item.motivo_cancelacion,
                item.fecha_cancelacion,
                `$${item.monto.toFixed(2)}`,
                item.evidencia ? removeFileExtension(item.evidencia) : "No disponible",
            ]),
        });
        doc.save("Cancelaciones.pdf");
        handleMenuClose();
    };

    return (
        <Box>
            <Box className={styles.exportButtons}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleMenuClick}
                    disabled={!selectedRows.length}
                >
                    Exportar
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={exportToCSV}>Exportar a CSV</MenuItem>
                    <MenuItem onClick={exportToExcel}>Exportar a Excel</MenuItem>
                    <MenuItem onClick={exportToPDF}>Exportar a PDF</MenuItem>
                </Menu>
            </Box>
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedRows.length > 0 && selectedRows.length < cancelaciones.length}
                                    checked={selectedRows.length === cancelaciones.length}
                                    onChange={(e) =>
                                        setSelectedRows(
                                            e.target.checked
                                                ? cancelaciones.map((item) => item.id)
                                                : []
                                        )
                                    }
                                />
                            </TableCell>
                            <TableCell sx={headerStyle}>ID Empleado</TableCell>
                            <TableCell sx={headerStyle}>Folio Cheque</TableCell>
                            <TableCell sx={headerStyle}>Número Quincena</TableCell>
                            <TableCell sx={headerStyle}>Tipo Nómina</TableCell>
                            <TableCell sx={headerStyle}>Motivo Cancelación</TableCell>
                            <TableCell sx={headerStyle}>Fecha Cancelación</TableCell>
                            <TableCell sx={headerStyle}>Monto</TableCell>
                            <TableCell sx={headerStyle}>Evidencia</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} sx={{ textAlign: "center" }}>
                                    Cargando...
                                </TableCell>
                            </TableRow>
                        ) : cancelaciones.length > 0 ? (
                            cancelaciones.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedRows.includes(item.id)}
                                            onChange={() => handleSelectRow(item.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{item.id_empleado}</TableCell>
                                    <TableCell>{item.folio_cheque}</TableCell>
                                    <TableCell>{item.numero_quincena}</TableCell>
                                    <TableCell>{item.tipo_nomina}</TableCell>
                                    <TableCell>{item.motivo_cancelacion}</TableCell>
                                    <TableCell>{item.fecha_cancelacion}</TableCell>
                                    <TableCell>{`$${item.monto.toFixed(2)}`}</TableCell>
                                    <TableCell>
                                        {item.evidencia ? (
                                            <a
                                                href={getDownloadURL(
                                                    fechaSeleccionada.quincena,
                                                    fechaSeleccionada.anio,
                                                    item.evidencia
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: "#1976D2", textDecoration: "underline" }}
                                            >
                                                {removeFileExtension(item.evidencia)}
                                            </a>
                                        ) : (
                                            "No disponible"
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} sx={{ textAlign: "center", color: "#800000" }}>
                                    No hay registros disponibles.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

const headerStyle = {
    backgroundColor: "#800000",
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
};
