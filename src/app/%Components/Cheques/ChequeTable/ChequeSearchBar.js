import React from "react";
import { TextField } from "@mui/material";

export default function ChequeSearchBar({ searchTerm, setSearchTerm }) {
    return (
        <TextField
            label="Buscar Cheques"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginY: 2 }}
        />
    );
}
