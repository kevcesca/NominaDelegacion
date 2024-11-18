"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button, TextField, Container, Typography, Box, ThemeProvider } from '@mui/material';
import styles from './Login.module.css';
import theme from '../../$tema/theme';
import { API_USERS_URL } from '../../%Config/apiConfig';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { setUser } = useAuth();  // Usa el contexto de autenticación para guardar el usuario

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_USERS_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correo_usuario: email,
                    contrasena_usuario: password
                }),
                credentials: 'include'  // Incluir las cookies en la solicitud
            });

            const data = await response.json();
            if (response.ok) {
                // Guardar los datos del usuario en el contexto de sesión
                setUser(data.user);  // Asumiendo que `data.user` contiene la información del usuario
                // Redirigir al usuario a la página principal
                router.push('/');
            } else {
                setError(data.message || 'Error de autenticación');
            }
        } catch (error) {
            console.error("Login error:", error);
            setError('Error de autenticación');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" className={styles.tWhite}>
                <Box
                    sx={{
                        marginTop: 4,
                        marginBottom: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Image src="/logo.png" alt="Logotipo Alcaldia Azcapotzalco" width={1000} height={500} className={styles.image} />
                    <Box className={styles.card}
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <AccountCircleIcon sx={{ fontSize: 100, color: '#711c31' }} />
                        <Typography component="h1" variant="h5" className={styles.tWhite}>
                            Bienvenido
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleLogin}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                            {error && (
                                <Typography color="error" align="center" sx={{ mt: 2 }}>
                                    {error}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Iniciar
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Login;
