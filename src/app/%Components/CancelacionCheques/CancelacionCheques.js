'use client';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem, ThemeProvider } from '@mui/material';
import { FileUpload } from 'primereact/fileupload';
import theme from '../../$tema/theme'; // Ajusta la ruta según la estructura de tu proyecto

const quincenas = [
    "1a Quincena de Enero", "2a Quincena de Enero",
    "1a Quincena de Febrero", "2a Quincena de Febrero",
    "1a Quincena de Marzo", "2a Quincena de Marzo",
    "1a Quincena de Abril", "2a Quincena de Abril",
    "1a Quincena de Mayo", "2a Quincena de Mayo",
    "1a Quincena de Junio", "2a Quincena de Junio",
    "1a Quincena de Julio", "2a Quincena de Julio",
    "1a Quincena de Agosto", "2a Quincena de Agosto",
    "1a Quincena de Septiembre", "2a Quincena de Septiembre",
    "1a Quincena de Octubre", "2a Quincena de Octubre",
    "1a Quincena de Noviembre", "2a Quincena de Noviembre",
    "1a Quincena de Diciembre", "2a Quincena de Diciembre"
];

const CancelacionCheques = () => {
    const [formData, setFormData] = useState({
        empleadoID: '',
        numeroCheque: '',
        quincena: '',
        tipoNomina: '',
        motivoCancelacion: '',
        evidencia: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileUpload = (e) => {
        setFormData({ ...formData, evidencia: e.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos del formulario:", formData);
        // Aquí puedes agregar la lógica para enviar los datos
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}
            >
                <Typography variant="h5" align="center" gutterBottom color="primary">
                    Cancelación de Cheques
                </Typography>

                <TextField
                    label="ID de Empleados"
                    name="empleadoID"
                    value={formData.empleadoID}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Ingrese ID de empleados"
                />

                <TextField
                    label="Número de Cheque"
                    name="numeroCheque"
                    value={formData.numeroCheque}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Número de cheque a cancelar"
                />

                <TextField
                    select
                    label="Número de Quincena"
                    name="quincena"
                    value={formData.quincena}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Selecciona la quincena"
                >
                    {quincenas.map((quin, index) => (
                        <MenuItem key={index} value={quin}>
                            {quin}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Tipo de Nómina"
                    name="tipoNomina"
                    value={formData.tipoNomina}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Tipo de nómina"
                />

                <TextField
                    label="Motivo de Cancelación"
                    name="motivoCancelacion"
                    value={formData.motivoCancelacion}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    placeholder="Describa el motivo de la cancelación"
                />

                <Typography variant="body1" gutterBottom mt={2}>
                    Subir Evidencia (Opcional):
                </Typography>
                <FileUpload
                    mode="basic"
                    name="evidencia"
                    chooseLabel="Seleccionar archivo"
                    accept="image/*,application/pdf"
                    onUpload={handleFileUpload}
                    customUpload
                    auto
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Cancelar
                </Button>
            </Box>
        </ThemeProvider>
    );
};

export default CancelacionCheques;
