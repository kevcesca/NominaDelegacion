"use client"
import { useState } from 'react';
import styles from '../Poliza/page.module.css';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ProtectedView from '../../%Components/ProtectedView/ProtectedView';


const empleados = [
    { id: 13515, nombre: "Juan Pérez", tipoNomina: "Estructura", percepciones: "$5200", deducciones: "$200", liquido: "$5000", clc: "CLC1234", estadoCheque: "Creado" },
    { id: 13516, nombre: "Ana Gómez", tipoNomina: "Nómina 8", percepciones: "$4700", deducciones: "$200", liquido: "$4500", clc: "CLC5678", estadoCheque: "Creado" },
    { id: 13517, nombre: "Luis Ramírez", tipoNomina: "Base", percepciones: "$4200", deducciones: "$200", liquido: "$4000", clc: "CLC9012", estadoCheque: "Creado" },
];

export default function GestorPolizas() {
    const [inicioFolioCheque, setInicioFolioCheque] = useState('');
    const [finalFolioCheque, setFinalFolioCheque] = useState('');
    const [polizasGeneradas, setPolizasGeneradas] = useState([]);
    const [mostrarConsolidacion, setMostrarConsolidacion] = useState(false);

    const generarPolizas = () => {
        if (!inicioFolioCheque || !finalFolioCheque || inicioFolioCheque >= finalFolioCheque) {
            alert("Ingrese un rango de folios válido.");
            return;
        }

        let folioPoliza = 2000;
        const cantidadCheques = Math.min(finalFolioCheque - inicioFolioCheque + 1, empleados.length);
        const nuevasPolizas = [];

        for (let i = 0; i < cantidadCheques; i++) {
            const empleado = empleados[i];
            const conceptoPago = `Quincena 2da - ${empleado.tipoNomina}`;
            nuevasPolizas.push({
                ...empleado,
                folioCheque: parseInt(inicioFolioCheque) + i,
                folioPoliza: folioPoliza++,
                conceptoPago,
            });
        }
        setPolizasGeneradas(nuevasPolizas);
    };

    const consolidarInformacion = () => {
        setMostrarConsolidacion(true);
    };

    return (
        <ProtectedView requiredPermissions={["Generacion_Polizas", "Acceso_total"]}>

            <Box className={styles.container}>
                <Typography variant="h4" gutterBottom>Gestor de Pólizas</Typography>

                <Box className={styles.inputGroup}>
                    <TextField
                        label="Folio de Cheque Inicial"
                        type="number"
                        value={inicioFolioCheque}
                        onChange={(e) => setInicioFolioCheque(e.target.value)}
                        placeholder="Ejemplo: 135468"
                        className={styles.labels}
                    />
                    <TextField
                        label="Folio de Cheque Final"
                        type="number"
                        value={finalFolioCheque}
                        onChange={(e) => setFinalFolioCheque(e.target.value)}
                        placeholder="Ejemplo: 135471"
                        className={styles.labels}
                    />
                    <Button variant="contained" color="primary" onClick={generarPolizas} className={styles.buttons}>Generar</Button>
                </Box>

                <Box className={styles.tableSection}>
                    <Typography variant="h5" gutterBottom>Pólizas Generadas</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow className={styles.table}>
                                    <TableCell>ID Empleado</TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Folio Cheque</TableCell>
                                    <TableCell>Folio Póliza</TableCell>
                                    <TableCell>Concepto de Pago</TableCell>
                                    <TableCell>Percepciones</TableCell>
                                    <TableCell>Deducciones</TableCell>
                                    <TableCell>Líquido</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {polizasGeneradas.length > 0 ? (
                                    polizasGeneradas.map((poliza, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{poliza.id}</TableCell>
                                            <TableCell>{poliza.nombre}</TableCell>
                                            <TableCell>{poliza.folioCheque}</TableCell>
                                            <TableCell>{poliza.folioPoliza}</TableCell>
                                            <TableCell>{poliza.conceptoPago}</TableCell>
                                            <TableCell>{poliza.percepciones}</TableCell>
                                            <TableCell>{poliza.deducciones}</TableCell>
                                            <TableCell>{poliza.liquido}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Typography variant="body1" color="textSecondary">
                                                Actualmente no existen pólizas
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Button variant="contained" color="secondary" onClick={consolidarInformacion} className={styles.buttons} style={{ marginTop: '20px' }}>
                    Consolidar Información
                </Button>

                {mostrarConsolidacion && (
                    <Box className={styles.tableSection} style={{ marginTop: '30px' }}>
                        <Typography variant="h5" gutterBottom>Consolidación de Información Cheque-Poliza</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID Empleado</TableCell>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Concepto de Pago</TableCell>
                                        <TableCell>Folio Cheque</TableCell>
                                        <TableCell>Folio Póliza</TableCell>
                                        <TableCell>Percepciones</TableCell>
                                        <TableCell>Deducciones</TableCell>
                                        <TableCell>Líquido</TableCell>
                                        <TableCell>CLC</TableCell>
                                        <TableCell>Estado Cheque</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {empleados.map((empleado, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{empleado.id}</TableCell>
                                            <TableCell>{empleado.nombre}</TableCell>
                                            <TableCell>Quincena 2da - {empleado.tipoNomina}</TableCell>
                                            <TableCell>{parseInt(inicioFolioCheque) + index}</TableCell>
                                            <TableCell>{2000 + index}</TableCell>
                                            <TableCell>{empleado.percepciones}</TableCell>
                                            <TableCell>{empleado.deducciones}</TableCell>
                                            <TableCell>{empleado.liquido}</TableCell>
                                            <TableCell>{empleado.clc}</TableCell>
                                            <TableCell>{empleado.estadoCheque}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Box>
        </ProtectedView>
    );
}
