'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, MenuItem, Typography, Box, Container, ThemeProvider } from '@mui/material';
import styles from './CrearUsuario.module.css';
import theme from '../../$tema/theme'; // Asegúrate de que la ruta sea correcta

export default function CrearUsuario() {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [fechaAlta, setFechaAlta] = useState('');
    const [activo, setActivo] = useState('SI');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí debes agregar la lógica para agregar el nuevo usuario a la tabla
        // Por ejemplo, puedes llamar a una API o actualizar el estado global
        console.log({ nombre, apellidos, email, fechaAlta, activo });
        router.push('/CrearNomina');
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm">
                <Box className={styles.main} sx={{ mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Crear Nuevo Usuario
                    </Typography>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <TextField
                            label="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Apellidos"
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Fecha Alta"
                            type="date"
                            value={fechaAlta}
                            onChange={(e) => setFechaAlta(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            select
                            label="Activo"
                            value={activo}
                            onChange={(e) => setActivo(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        >
                            <MenuItem value="SI">SI</MenuItem>
                            <MenuItem value="NO">NO</MenuItem>
                        </TextField>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button variant="contained" color="primary" type="submit">
                                Crear Usuario
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
