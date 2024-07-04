'use client';
import React, { useState } from 'react';
import { Box, Button, CircularProgress, MenuItem, TextField, Typography } from '@mui/material';

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

const empleados = [
    { id: 1, nombre: 'Empleado 1' },
    { id: 2, nombre: 'Empleado 2' },
    { id: 3, nombre: 'Empleado 3' },
    // Agrega más empleados según sea necesario
];

const UploadForm = () => {
    const [quincena, setQuincena] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [progress, setProgress] = useState(0);
    const [empleado, setEmpleado] = useState('');
    const [comentario, setComentario] = useState('');

    const handleQuincenaChange = (event) => {
        setQuincena(event.target.value);
    };

    const handleFileChange = (event) => {
        setArchivo(event.target.files[0]);
        // Simulando progreso de carga
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress <= 100) {
                setProgress(progress);
            } else {
                clearInterval(interval);
            }
        }, 300);
    };

    const handleEmpleadoChange = (event) => {
        setEmpleado(event.target.value);
    };

    const handleComentarioChange = (event) => {
        setComentario(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Lógica para manejar el envío del formulario
        console.log({
            quincena,
            archivo,
            empleado,
            comentario
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
                Cargar Documento
            </Typography>
            <TextField
                select
                label="Selecciona la Quincena"
                value={quincena}
                onChange={handleQuincenaChange}
                fullWidth
                margin="normal"
            >
                {quincenas.map((quin, index) => (
                    <MenuItem key={index} value={quin}>
                        {quin}
                    </MenuItem>
                ))}
            </TextField>
            <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 2 }}
            >
                Subir Archivo
                <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                />
            </Button>
            {archivo && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <CircularProgress variant="determinate" value={progress} />
                    <Typography sx={{ ml: 2 }}>{progress}%</Typography>
                </Box>
            )}
            <TextField
                select
                label="Selecciona el Empleado"
                value={empleado}
                onChange={handleEmpleadoChange}
                fullWidth
                margin="normal"
            >
                {empleados.map((emp) => (
                    <MenuItem key={emp.id} value={emp.nombre}>
                        {emp.nombre}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Comentario"
                multiline
                rows={4}
                value={comentario}
                onChange={handleComentarioChange}
                fullWidth
                margin="normal"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
            >
                Enviar
            </Button>
        </Box>
    );
};

export default UploadForm;
