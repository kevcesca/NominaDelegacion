import React, { useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";

export default function ExportDropdown({ onExportExcel, onExportCSV, onExportPDF, disabled }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ marginTop: "2rem" }}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
                disabled={disabled}
            >
                Exportar
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => { handleClose(); onExportExcel(); }}>
                    Exportar a Excel
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); onExportCSV(); }}>
                    Exportar a CSV
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); onExportPDF(); }}>
                    Exportar a PDF
                </MenuItem>
            </Menu>
        </Box>
    );
}
