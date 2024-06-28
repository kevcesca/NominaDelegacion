'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button, TextField, Container, Typography, Box, ThemeProvider } from '@mui/material';
import styles from './page.module.css';
import theme from '../$tema/theme';

const Registrarse = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleRegister = () => {
        // Aquí puedes añadir lógica de registro, por ejemplo, llamar a una API
        // Después de registrar, puedes redirigir al usuario al inicio de sesión
        router.push('/'); // Redirige a la página de inicio de sesión
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" className={styles.tWhite}>
                <Box
                    sx={{
                        marginTop: 8,
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
                        <AccountCircleIcon sx={{ fontSize: 100, color: 'white' }} />
                        <Typography component="h1" variant="h5" className={styles.tWhite}>
                            Regístrate
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
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                            />
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleRegister}
                            >
                                Registrarse
                            </Button>
                            <Link className={styles.tWhite} href="/login" passHref>
                                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                    ¿Ya tienes cuenta? Inicia sesión
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Registrarse;
