'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../context/AuthContext';
import { Button, TextField, Container, Typography, Box, ThemeProvider } from '@mui/material';
import styles from './Login.module.css';
import theme from '../../$tema/theme';

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = () => {
        login();
        router.push('/'); // Redirige a la página de inicio
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
                        <Box component="form" noValidate sx={{ mt: 1 }}>
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
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleLogin}
                            >
                                Iniciar
                            </Button>
                            <Link className={styles.tWhite} href="/RecuperarContra" passHref> 
                                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                    ¿Perdiste tu contraseña?
                                </Typography>
                            </Link>
                            <Link className={styles.tWhite} href="/Registrarse" passHref>
                                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                                    ¿No tienes cuenta? Regístrate
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Login;
