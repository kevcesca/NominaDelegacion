"use client";
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import useChequeTable from "./useChequeTable";
import ChequeFilterSection from "./ChequeFilterSection";
import ChequeSearchBar from "./ChequeSearchBar";
import ChequeTableSection from "./ChequeTableSection";
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton } from '@mui/material';

export default function ChequeTable() {
    const {
        tipoNomina,
        cheques,
        loading,
        selectedRows,
        selectAll,
        handleTipoNominaChange,
        handleDateChange,
        handleRowSelect,
        handleSelectAll,
        exportToExcel,
        exportToCSV,
        exportToPDF,
        anio,
        quincena,
        fechaCompleta,
        refreshCheques, // Función para recargar los datos
    } = useChequeTable();

    // Estados para la búsqueda y paginación
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Filtrar los cheques según el término de búsqueda
    const filteredCheques = cheques.filter((cheque) =>
        Object.values(cheque).some((value) =>
            (value ?? "").toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );


    // Manejar la paginación
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ padding: 2 }}>
            {/* Sección de filtros */}
            <ChequeFilterSection
                tipoNomina={tipoNomina}
                handleTipoNominaChange={handleTipoNominaChange}
                handleDateChange={handleDateChange}
                quincena={quincena}
                fechaCompleta={fechaCompleta}
                anio={anio}
            />

            {/* Barra de búsqueda */}
            <ChequeSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {/* Botón para actualizar la tabla */}

            {/* Botón para actualizar después de generar nuevos cheques */}

            <IconButton
                onClick={() => refreshCheques()}
                aria-label="refresh"
                size="large" // Opciones: "small", "medium", "large"
            >
                <RefreshIcon fontSize="medium" /> {/* Opciones: "small", "medium", "large" */}
            </IconButton>


            {/* Tabla de cheques */}
            <ChequeTableSection
                cheques={cheques}
                filteredCheques={filteredCheques}
                loading={loading}
                selectedRows={selectedRows}
                selectAll={selectAll}
                onRowSelect={handleRowSelect}
                onSelectAll={handleSelectAll}
                onExportExcel={exportToExcel}
                onExportCSV={exportToCSV}
                onExportPDF={exportToPDF}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />

            <Button
                color="primary"
                variant="contained"
                onClick={() => (window.location.href = "/Cheques/Poliza")}
                sx={{ marginTop: "2rem" }}
            >
                Visualizar Pólizas
            </Button>
        </Box>
    );
}
