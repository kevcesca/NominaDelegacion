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
            {/* Parte de abajo del cheque */}
            <Grid container spacing={2} className={styles.header}>
                <Grid item xs={4}>
                    <Box className={styles.conceptBox}>
                        <b variant="body2">CONCEPTO DE PAGO:</b>
                        <p variant="body2"><b>{conceptoPago}</b></p>
                        <p variant="body2">R.F.C.: {rfc}</p>
                        <p variant="body2">Tipo de nómina: {tipoNomina}</p>
                    </Box>
                    <Box className={styles.conceptBox2}>
                        <b>Pago Caja: </b> <b className={styles.margin1}> y/o responsable: </b>
                    </Box>
                </Grid>

                <Grid item xs={4} sx={{translate: '-8px'}}>
                    <Box>
                        <Box className={styles.textAround3}>
                            <b align="center"> PERCEPCIONES </b>
                            <b align="center"> DEDUCCIONES </b>
                            <b align="center"> LÍQUIDO </b>
                        </Box>
                        <br/>
                        <Box className={styles.fila3}>
                            <Typography className={styles.textAround} variant="body2" align="center">${percepciones}</Typography>
                            <Typography className={styles.textAround} variant="body2" align="center">${deducciones}</Typography>
                            <Typography className={styles.textAround} variant="body2" align="center">${liquido}</Typography>
                        </Box>
                    </Box>

                    <Box className={styles.identificationBox}>
                        <p className={styles.subrayado}>El empleado se identificó con:</p>
                        <Box className={styles.fila1}>
                            <Box className={styles.columna3}>
                                <Typography variant="body2" align="center">INE</Typography>
                                <p className={styles.textAround4}> </p>
                            </Box>
                            <Box className={styles.columna3}>
                                <Typography variant="body2" align="center">PASAPORTE</Typography>
                                <p className={styles.textAround4}> </p>
                            </Box>
                            <Box className={styles.columna3}>
                                <Typography variant="body2" align="center">CÉDULA</Typography>
                                <p className={styles.textAround4}> </p>
                            </Box>
                            <Box className={styles.columna3}>
                                <Typography variant="body2" align="center">CREDENCIAL</Typography>
                                <p className={styles.textAround4}> </p>
                            </Box>
                        </Box>

                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="body2">Recibí Cheque:</Typography>
                    <Box className={styles.receiptBox}>
                        <Typography variant="body2"><b>Nombre:</b></Typography>
                        <Typography variant="body2"><b>Firma:</b></Typography>
                        <Typography variant="body2"><b>Fecha:</b></Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Cheque;
