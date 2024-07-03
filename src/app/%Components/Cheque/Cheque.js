'use client';
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import styles from './Cheque.module.css';
import Image from 'next/image';

const Cheque = ({
    polizaNo,
    noDe,
    noEmpleado,
    nombreBeneficiario,
    importeLetra,
    conceptoPago,
    rfc,
    tipoNomina,
    percepciones,
    deducciones,
    liquido,
    nombre,
    fecha
}) => {
    return (
        <Box className={styles.container}>
            <Grid container spacing={2} className={styles.header}>
                <Grid item xs={12} className={styles.images}>
                    <Image src="/esquina2.png" alt="Logotipo" width={100} height={50} className={styles.esquina} />
                    <Image src="/logo.png" alt="Logotipo" width={100} height={50} className={styles.image} />
                </Grid>
                <Grid item xs={8} className={styles.fila2}>
                    <Box className={styles.columna2}>
                        <p className={styles.font1}><b>DIRECCIÓN DE ADMINISTRACIÓN DE CAPITAL HUMANO</b></p>
                        <p className={styles.font1}><b>SUBDIRECCIÓN DE ADMINISTRACIÓN DE PERSONAL</b></p>
                        <p className={styles.font1}><b>UNIDAD DEPARTAMENTAL DE CONTROL DE PERSONAL Y PAGOS</b></p>
                    </Box>
                    <Typography className={styles.title1} variant="h6" align="center" gutterBottom><b>POLIZA DE CHEQUE</b></Typography>
                    <Box className={styles.columna2}>
                        <Box className={styles.fila3}>
                            <Typography variant="body2">Nombre del beneficiario:</Typography> <p className={styles.textAround2}><b>{nombreBeneficiario}</b></p>
                        </Box>
                        <Box className={styles.fila3}>
                            <Typography variant="body2">Importe con letra:</Typography> <p className={styles.textAround2}><b>{importeLetra}</b></p>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <div className={styles.fila1}>
                        <Typography variant="body2">Póliza No.: </Typography><p className={styles.textAround}><b>{polizaNo}</b></p>
                    </div>

                    <div className={styles.fila1}>
                        <Typography variant="body2">No. de: </Typography> <p className={styles.textAround}><b>{noDe}</b></p>
                    </div>

                    <div className={styles.fila1}>
                        <Typography variant="body2">No. de Empleado: </Typography> <p className={styles.textAround}><b>{noEmpleado}</b></p>
                    </div>

                </Grid>
            </Grid>
            <Grid container spacing={2} className={styles.header}>
                <Grid item xs={4} className={styles.conceptBox}>
                    <Typography variant="body2">CONCEPTO DE PAGO:</Typography>
                    <Typography variant="body2">{conceptoPago}</Typography>
                    <Typography variant="body2">R.F.C.: {rfc}</Typography>
                    <Typography variant="body2">Tipo de nómina: {tipoNomina}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Box>

                        <Typography variant="body2" align="center">PERCEPCIONES</Typography>
                        <Typography variant="body2" align="center">${percepciones}</Typography>

                        <Typography variant="body2" align="center">DEDUCCIONES</Typography>
                        <Typography variant="body2" align="center">${deducciones}</Typography>

                        <Typography variant="body2" align="center">LÍQUIDO</Typography>
                        <Typography variant="body2" align="center">${liquido}</Typography>

                    </Box>
                    <Box className={styles.identificationBox}>
                        <Typography variant="body2">El empleado se identificó con:</Typography>
                        <Typography variant="body2" align="center">INE</Typography>

                        <Typography variant="body2" align="center">PASAPORTE</Typography>

                        <Typography variant="body2" align="center">CÉDULA</Typography>

                        <Typography variant="body2" align="center">CREDENCIAL DE TRABAJO</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} className={styles.receiptBox}>
                    <Typography variant="body2">Recibí Cheque:</Typography>
                    <Typography variant="body2">Nombre: {nombre}</Typography>
                    <Typography variant="body2">Firma:</Typography>
                    <Typography variant="body2">Fecha: {fecha}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Cheque;
