"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

export default function ChequeManagementForm({ onSearch }) {
    const [fecha, setFecha] = useState("");
    const [quincena, setQuincena] = useState("");
    const [anio, setAnio] = useState("");
    const [tipoNomina, setTipoNomina] = useState("");

    const handleDateChange = (event) => {
        const selectedDate = new Date(event.target.value);
        setFecha(event.target.value);

        // Calcular la quincena basada en la fecha seleccionada
        const calculatedQuincena = calcularQuincena(selectedDate);
        setQuincena(calculatedQuincena);

        // Actualizar el año basado en la fecha seleccionada
        setAnio(selectedDate.getFullYear());
    };

    const calcularQuincena = (fecha) => {
        const day = fecha.getDate();
        const month = fecha.getMonth();
        return day <= 15
            ? `1ra quincena de ${obtenerNombreMes(month)}`
            : `2da quincena de ${obtenerNombreMes(month)}`;
    };

    const obtenerNombreMes = (mes) => {
        const meses = [
            "enero",
            "febrero",
            "marzo",
            "abril",
            "mayo",
            "junio",
            "julio",
            "agosto",
            "septiembre",
            "octubre",
            "noviembre",
            "diciembre",
        ];
        return meses[mes];
    };

    const handleSearch = () => {
        onSearch({ fecha, quincena, anio, tipoNomina });
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h5" sx={{ marginBottom: 2, color: "#800000" }}>
                Reposicion de Cheques
            </Typography>

            <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
                {/* Campo de Fecha */}
                <TextField
                    label="Fecha"
                    type="date"
                    value={fecha}
                    onChange={handleDateChange}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                {/* Campo de Quincena */}
                <TextField
                    label="Quincena"
                    value={quincena}
                    InputProps={{ readOnly: true }}
                    fullWidth
                />

                {/* Campo de Año */}
                <TextField
                    label="Año"
                    value={anio}
                    InputProps={{ readOnly: true }}
                    fullWidth
                />
            </Box>

            {/* Campo de Tipo de Nómina */}
            <FormControl fullWidth sx={{ marginBottom: 3 }}>
                <InputLabel>Tipo de Nómina</InputLabel>
                <Select value={tipoNomina} onChange={(e) => setTipoNomina(e.target.value)}>
                    <MenuItem value="BASE">BASE</MenuItem>
                    <MenuItem value="HONORARIOS">HONORARIOS</MenuItem>
                    <MenuItem value="COMPUESTA">COMPUESTA</MenuItem>
                </Select>
            </FormControl>

            {/* Botón de Búsqueda */}
            <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
                Buscar Cheques
            </Button>
        </Box>
    );
}
