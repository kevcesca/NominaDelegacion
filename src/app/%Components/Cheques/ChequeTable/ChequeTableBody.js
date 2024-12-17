import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
} from "@mui/material";

export default function ChequeTableBody({
    cheques,
    selectedRows,
    selectAll,
    onRowSelect,
    onSelectAll,
}) {
    return (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
            <Table>
                {/* Encabezado de la tabla */}
                <TableHead>
                    <TableRow>
                        <TableCell
                            padding="checkbox"
                            sx={{
                                backgroundColor: "#9f2241",
                                color: "white",
                                textAlign: "center",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            <Checkbox
                                checked={selectAll}
                                onChange={onSelectAll}
                                indeterminate={selectedRows.length > 0 && selectedRows.length < cheques.length}
                                sx={{ color: "white" }}
                            />
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: "#9f2241",
                                color: "white",
                                textAlign: "center",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            ID Empleado
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: "#9f2241",
                                color: "white",
                                textAlign: "center",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            Nombre
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: "#9f2241",
                                color: "white",
                                textAlign: "center",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            Folio Cheque
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: "#9f2241",
                                color: "white",
                                textAlign: "center",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            Estado Cheque
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: "#9f2241",
                                color: "white",
                                textAlign: "center",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            Monto
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: "#9f2241",
                                color: "white",
                                textAlign: "center",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            Fecha
                        </TableCell>
                    </TableRow>
                </TableHead>

                {/* Cuerpo de la tabla */}
                <TableBody>
                    {cheques.length > 0 ? (
                        cheques.map((cheque) => (
                            <TableRow key={cheque.num_folio}>
                                {/* Checkbox */}
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedRows.includes(cheque)}
                                        onChange={() => onRowSelect(cheque)}
                                    />
                                </TableCell>
                                {/* ID Empleado */}
                                <TableCell sx={{ textAlign: "center" }}>
                                    {cheque.id_empleado}
                                </TableCell>
                                {/* Nombre */}
                                <TableCell sx={{ textAlign: "center" }}>
                                    {cheque.nombre || "N/A"}
                                </TableCell>
                                {/* Folio Cheque */}
                                <TableCell sx={{ textAlign: "center" }}>
                                    {cheque.num_folio}
                                </TableCell>
                                {/* Estado Cheque */}
                                <TableCell sx={{ textAlign: "center" }}>
                                    {cheque.estado_cheque}
                                </TableCell>
                                {/* Monto */}
                                <TableCell sx={{ textAlign: "center" }}>
                                    {`$${cheque.monto.toFixed(2)}`}
                                </TableCell>
                                {/* Fecha */}
                                <TableCell sx={{ textAlign: "center" }}>
                                    {cheque.fecha_cheque}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={7} // Actualizado a 7 columnas
                                sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    color: "#9f2241",
                                    padding: 3,
                                }}
                            >
                                No hay registros disponibles
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
