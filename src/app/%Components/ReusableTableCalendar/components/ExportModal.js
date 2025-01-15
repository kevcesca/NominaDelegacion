import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx"; // Biblioteca para Excel
import * as Papa from "papaparse"; // Biblioteca para CSV
import React, { useState, useRef } from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  ThemeProvider,
} from "@mui/material";
import { Toast } from "primereact/toast"; // Toast para mensajes de advertencia
import styles from "../ReusableTableCalendar.module.css";
import theme from "../../../$tema/theme";

const ExportModal = ({ open, onClose, selectedRows, columns }) => {
  const [selectedColumns, setSelectedColumns] = useState(columns.map((col) => col.accessor));
  const [exportFormat, setExportFormat] = useState("");
  const toastRef = useRef(null); // Toast para mensajes

  // Manejar el cambio de selección de columnas
  const handleColumnToggle = (accessor) => {
    setSelectedColumns((prev) =>
      prev.includes(accessor) ? prev.filter((col) => col !== accessor) : [...prev, accessor]
    );
  };

  // Función de exportación
  const handleExport = () => {
    if (selectedColumns.length === 0) {
      toastRef.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Selecciona al menos una columna para exportar.",
        life: 3000,
      });
      return;
    }

    if (exportFormat === "pdf") {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Exportación de Eventos", 14, 15);

      const tableColumnHeaders = selectedColumns.map(
        (accessor) => columns.find((col) => col.accessor === accessor)?.label || accessor
      );

      const tableRows = selectedRows.map((row) =>
        selectedColumns.map((accessor) => row[accessor] || "-")
      );

      doc.autoTable({
        head: [tableColumnHeaders],
        body: tableRows,
        startY: 25,
        styles: { halign: "center", fontSize: 10 },
        theme: "striped",
        headStyles: {
          fillColor: [155, 29, 29],
          textColor: [255, 255, 255],
        },
        margin: { left: 10, right: 10 },
      });

      doc.save("eventos.pdf");

    } else if (exportFormat === "excel") {
      const worksheetData = [
        selectedColumns.map(
          (accessor) => columns.find((col) => col.accessor === accessor)?.label || accessor
        ),
        ...selectedRows.map((row) =>
          selectedColumns.map((accessor) => row[accessor] || "-")
        ),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Eventos");
      XLSX.writeFile(workbook, "eventos.xlsx");

    } else if (exportFormat === "csv") {
      const csvData = [
        selectedColumns.map(
          (accessor) => columns.find((col) => col.accessor === accessor)?.label || accessor
        ),
        ...selectedRows.map((row) =>
          selectedColumns.map((accessor) => row[accessor] || "-")
        ),
      ];

      const csvString = Papa.unparse(csvData);
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "eventos.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } else {
      toastRef.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Selecciona un formato válido para exportar.",
        life: 3000,
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Toast ref={toastRef} />
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        sx={{
          "& .MuiDialog-paper": {
            height: "80vh",
            maxWidth: "90%",
            padding: "16px",
          },
        }}
      >
        <DialogTitle>Exportar Datos</DialogTitle>
        <DialogContent
          className={styles.dialogContent}
          sx={{ display: "flex", flexDirection: "row", gap: "1.5rem" }}
        >
          {/* Selección de formato y columnas */}
          <div style={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Formato</InputLabel>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </Select>
            </FormControl>

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

          {/* Vista previa */}
          <TableContainer sx={{ flex: 2, maxHeight: "70vh", overflowY: "auto" }}>
            <h3>Vista Previa</h3>
            <Table>
              <TableHead>
                <TableRow>
                  {selectedColumns.map((accessor) => (
                    <TableCell
                      key={accessor}
                      sx={{
                        backgroundColor: "#9b1d1d",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {columns.find((col) => col.accessor === accessor)?.label || accessor}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            variant="contained"
            color="primary"
            disabled={!exportFormat || selectedColumns.length === 0}
          >
            Exportar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ExportModal;
