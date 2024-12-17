import React from "react";
import { Box, Typography, CircularProgress, TablePagination } from "@mui/material";
import ExportButtons from "./ExportButtons";
import ChequeTableBody from "./ChequeTableBody";

export default function ChequeTableSection({
    cheques,
    filteredCheques,
    loading,
    selectedRows,
    selectAll,
    onRowSelect,
    onSelectAll,
    onExportExcel,
    onExportCSV,
    onExportPDF,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
}) {
    return (
        <Box
            sx={{
                marginTop: "1rem",
                backgroundColor: "white",
                padding: "1rem",
                borderRadius: "10px",
                border: "1px solid #ccc",
            }}
        >
            <Typography variant="h6" sx={{ color: "#800000" }}>
                Cheques Generados
            </Typography>

            {/* Botones de exportación */}
            <ExportButtons
                onExportExcel={onExportExcel}
                onExportCSV={onExportCSV}
                onExportPDF={onExportPDF}
                disabled={selectedRows.length === 0}
            />

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Tabla de cheques */}
                    <ChequeTableBody
                        cheques={filteredCheques.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                        )}
                        selectedRows={selectedRows}
                        selectAll={selectAll}
                        onRowSelect={onRowSelect}
                        onSelectAll={onSelectAll}
                    />

                    {/* Paginación */}
                    <TablePagination
                        component="div"
                        count={filteredCheques.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelRowsPerPage="Filas por página"
                    />
                </>
            )}
        </Box>
    );
}
