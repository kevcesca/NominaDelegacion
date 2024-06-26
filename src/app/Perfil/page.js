'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import styles from './page.module.css';

export default function Perfil() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const usuario = {
            nombre: "Fidel Pérez González",
            email: "fidel.perez@programadoresjava.mx",
            telefono: "5532745538",
            emailSecundario: "fidel.perez@programadoresjava.mx",
            licenciaKey: "xxxx xxxx xxxx xxxx"
        };
    
        localStorage.setItem('usuario', JSON.stringify(usuario));
    }, []);
    


    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            setUsuario(JSON.parse(storedUser));
        }
    }, []);

    if (!usuario) return <p>Cargando...</p>;

    return (
        <main className={styles.main}>
            <Card className={styles.card}>
                <CardContent>
                    <Typography variant="h5" component="div" className={styles.title}>
                        Perfil de Usuario
                    </Typography>
                    <Box className={styles.info}>
                        <Typography variant="body1"><strong>Nombre de Usuario:</strong> {usuario.nombre}</Typography>
                        <Typography variant="body1"><strong>Email:</strong> {usuario.email}</Typography>
                        <Typography variant="body1"><strong>Teléfono:</strong> {usuario.telefono}</Typography>
                        <Typography variant="body1"><strong>Email Secundario:</strong> {usuario.emailSecundario}</Typography>
                        <Box className={styles.licencia}>
                            <Typography variant="body1"><strong>Licencia Key:</strong> {usuario.licenciaKey}</Typography>
                            <Button variant="contained" color="primary">Activar</Button>
                        </Box>
                        <Box className={styles.cambiar}>
                            <Link href="/CambioContra" passHref>
                                <Button variant="contained" color="secondary">
                                    Cambiar la contraseña
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </main>
    );
}
