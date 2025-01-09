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
    const [isLoading, setIsLoading] = useState(false); // Para deshabilitar el botón mientras se procesa
    const router = useRouter();
    const { setUser, checkPasswordForEmployee } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validación del lado del cliente
        if (!email || !password) {
            setError('Por favor, complete todos los campos');
            return;
        }

        setIsLoading(true); // Activa el estado de carga
        setError(''); // Reinicia los errores

        try {
            const response = await fetch(`${API_USERS_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correo_usuario: email,
                    contrasena_usuario: password,
                }),
                credentials: 'include',
            });

            // Si la respuesta no es exitosa (código 4xx o 5xx)
            if (!response.ok) {
                const errorMessage = await response.text(); // Leer como texto plano
                setError(errorMessage || 'Error de autenticación'); // Usar el mensaje del servidor si existe
                return;
            }

            const data = await response.json();

            // Guardar los datos del usuario en el contexto de sesión
            setUser(data.user);

            // Verificar si se requiere un cambio de contraseña
            const idEmpleado = data.user.id_empleado; // Ajusta según la estructura de `data.user`
            const isPasswordCorrect = await checkPasswordForEmployee(idEmpleado);

            if (isPasswordCorrect) {
                router.push('/NuevaContrasena'); // Redirige a la página de cambio de contraseña
            } else {
                setError('Contraseña incorrecta');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Ocurrió un error inesperado. Por favor, intente nuevamente.');
        } finally {
            setIsLoading(false); // Desactiva el estado de carga
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
                    <Image src="/logo.png" alt="Logotipo Alcaldía Azcapotzalco" width={1000} height={500} className={styles.image} />
                    <Box
                        className={styles.card}
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
                                label="Correo electrónico"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Correo electrónico"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
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
                                disabled={isLoading} // Deshabilita el botón mientras se procesa
                            >
                                {isLoading ? 'Iniciando...' : 'Iniciar'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Login;
