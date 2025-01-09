"use client";
import React, { useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    TextField,
    TablePagination,
    Button,
} from "@mui/material";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

export default function ChequeTable({ cheques }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRowSelect = (cheque) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(cheque)
                ? prevSelected.filter((row) => row !== cheque)
                : [...prevSelected, cheque]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
        } else {
            setSelectedRows(cheques);
        }
        setSelectAll(!selectAll);
    };

    const filteredCheques = cheques.filter((cheque) =>
        Object.values(cheque).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <Box>
            <TextField
                fullWidth
                label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={
                                        selectedRows.length > 0 &&
                                        selectedRows.length < filteredCheques.length
                                    }
                                    checked={selectedRows.length === filteredCheques.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            {Object.keys(filteredCheques[0] || {}).map((key) => (
                                <TableCell key={key}>{key.toUpperCase()}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCheques
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((cheque) => (
                                <TableRow key={cheque.folio_cheque}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedRows.includes(cheque)}
                                            onChange={() => handleRowSelect(cheque)}
                                        />
                                    </TableCell>
                                    {Object.keys(cheque).map((key) => (
                                        <TableCell key={key}>{cheque[key]}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={filteredCheques.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) =>
                    setRowsPerPage(parseInt(event.target.value, 10))
                }
            />
        </Box>
    );
}
