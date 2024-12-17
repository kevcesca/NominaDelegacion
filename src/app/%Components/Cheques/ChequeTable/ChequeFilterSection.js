import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import DateFilter from "../../DateFilter/DateFilter";
import GenerateChequesForm from "./GenerateChequesForm";

export default function ChequeFilterSection({
    tipoNomina,
    handleTipoNominaChange,
    handleDateChange,
    quincena,
    fechaCompleta,
    anio,
}) {
    return (
        <Box>
            {/* Componente de filtro de fecha */}
            <DateFilter onDateChange={handleDateChange} />

            {/* Selector de tipo de nómina */}
            <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel id="tipoNominaLabel">Tipo de Nómina</InputLabel>
                <Select
                    labelId="tipoNominaLabel"
                    value={tipoNomina}
                    onChange={handleTipoNominaChange}
                    label="Tipo de Nómina"
                >
                    <MenuItem value="EXTRAORDINARIOS">EXTRAORDINARIOS</MenuItem>
                    <MenuItem value="COMPUESTA">COMPUESTA</MenuItem>
                    <MenuItem value="FINIQUITOS">FINIQUITOS</MenuItem>
                    <MenuItem value="HONORARIOS">HONORARIOS</MenuItem>
                </Select>
            </FormControl>

            {/* Formulario para generar cheques */}
            <GenerateChequesForm
                quincena={quincena}
                fecha={fechaCompleta || `${anio}-12-01`}
                tipoNomina={tipoNomina}
            />
        </Box>
    );
}
