"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button, TextField, Container, Typography, Box, ThemeProvider } from '@mui/material';
import styles from './Login.module.css';
import theme from '../../$tema/theme';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { login } = useAuth();  // Usamos el contexto de autenticación para guardar el usuario

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Simula un inicio de sesión exitoso sin autenticación real
        const fakeUser = {
            id_empleado: 1,  // Usamos un ID ficticio
            nombre_usuario: email,  // Usamos el email como nombre
            correo_usuario: email,  // Usamos el email como correo
        };
    
        // Guarda al usuario en el contexto (simulando que se ha autenticado)
        login(fakeUser);  
    
        // Redirige al usuario a la página principal o a donde desees
        router.push('/');  // Redirige a la página principal
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
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Iniciar sesión
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Login;
