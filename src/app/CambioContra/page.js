'use client'
import React, { useState } from 'react';
import { Box, TextField, Button, Card, CardContent, Typography, Alert } from '@mui/material';
import styles from './page.module.css';

export default function CambioContra() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleUpdatePassword = () => {
        if (newPassword !== confirmPassword) {
            setError('La contraseña nueva no coincide con la confirmación');
            return;
        }

        // Aquí iría la lógica para actualizar la contraseña, por ejemplo, una llamada a la API

        setError('');
        alert('Contraseña actualizada correctamente');
    };

    return (
        <main className={styles.main}>
            <Card className={styles.card}>
                <CardContent>
                    <Typography variant="h5" component="div" className={styles.title}>
                        Cambio de Contraseña
                    </Typography>
                    <Box className={styles.form}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Contraseña Anterior"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <TextField
                            label="Contraseña Nueva"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <TextField
                            label="Confirmar Contraseña Nueva"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Box className={styles.buttons}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdatePassword}
                                href="/Perfil"
                            >
                                Actualizar
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                href="/Perfil"
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </main>
    );
}
