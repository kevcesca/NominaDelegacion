'use client'
import React, { useState } from 'react';
import { Box, TextField, Button, Card, CardContent, Typography, Alert } from '@mui/material';
import Link from 'next/link';
import styles from './page.module.css'; // Asegúrate de que la ruta sea correcta
import { API_USERS_URL } from '../%Config/apiConfig'; // Importa la URL base de la API
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import PasswordCheckGuard from './PasswordCheckGuard'; // Importa el guardián

export default function CambioContra() {
    const { user, logout } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const idEmpleado = user?.id_empleado;

    const validarSeguridadContraseña = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };

    const changePassword = async () => {
        if (!validarSeguridadContraseña(newPassword)) {
            setError(
                'La contraseña debe tener al menos 8 caracteres, incluir una combinación de letras mayúsculas, minúsculas, números y símbolos.'
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
            return;
        }

        if (!idEmpleado) {
            setError('No se ha encontrado el ID del empleado en la sesión.');
            return;
        }

        try {
            const response = await fetch(`${API_USERS_URL}/users/${idEmpleado}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword,
                    confirmPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Error al cambiar la contraseña.');
                return;
            }

            alert(`La contraseña ha sido cambiada con éxito para el empleado con ID: ${idEmpleado}`);
            logout();
        } catch (err) {
            setError('Ocurrió un error al intentar cambiar la contraseña.');
        }
    };

    return (
        <PasswordCheckGuard>
            <main className={styles.main}>
                <Card className={styles.card}>
                    <CardContent>
                        <Typography variant="h5" component="div" className={styles.title}>
                            Cambio de Contraseña
                        </Typography>
                        <Box className={styles.form}>
                            {error && <Alert severity="error">{error}</Alert>}
                            <TextField
                                fullWidth
                                label="Contraseña Nueva"
                                type="password"
                                variant="outlined"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Confirmar Contraseña Nueva"
                                type="password"
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                margin="normal"
                                required
                            />
                            <Box className={styles.buttons}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={changePassword}
                                    fullWidth
                                    style={{ marginTop: '16px' }}
                                >
                                    Actualizar
                                </Button>
                                <Link href="/Perfil" passHref>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Cancelar
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </main>
        </PasswordCheckGuard>
    );
}