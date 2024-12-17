import React from "react";
import { Box, Button } from "@mui/material";

export default function ExportButtons({ onExportExcel, onExportCSV, onExportPDF, disabled }) {
    return (
        <Box sx={{ marginTop: "2rem", display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={onExportExcel} disabled={disabled}>
                Exportar a Excel
            </Button>
            <Button variant="contained" color="secondary" onClick={onExportCSV} disabled={disabled}>
                Exportar a CSV
            </Button>
            <Button variant="contained" color="success" onClick={onExportPDF} disabled={disabled}>
                Exportar a PDF
            </Button>
        </Box>
    );
}
