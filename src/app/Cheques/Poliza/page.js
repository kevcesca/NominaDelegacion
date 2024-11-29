"use client";
import { useState, useEffect } from 'react';
import styles from '../Poliza/page.module.css';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ProtectedView from '../../%Components/ProtectedView/ProtectedView';

// Aquí deberías obtener los folios generados en la vista anterior, puede ser de un contexto, API o almacenamiento local
// Supondré que los folios se pasan a través de props o contexto (en este caso están simulados)

const empleados = [
    { id: 13515, nombre: "Juan Pérez", tipoNomina: "Estructura", percepciones: "$5200", deducciones: "$200", liquido: "$5000", estadoCheque: "Creado" },
    { id: 13516, nombre: "Ana Gómez", tipoNomina: "Nómina 8", percepciones: "$4700", deducciones: "$200", liquido: "$4500", estadoCheque: "Creado" },
    { id: 13517, nombre: "Luis Ramírez", tipoNomina: "Base", percepciones: "$4200", deducciones: "$200", liquido: "$4000", estadoCheque: "Creado" },
];

export default function GestorPolizas() {
    const [inicioFolioCheque, setInicioFolioCheque] = useState('');
    const [finalFolioCheque, setFinalFolioCheque] = useState('');
    const [polizasGeneradas, setPolizasGeneradas] = useState([]);
    const [mostrarConsolidacion, setMostrarConsolidacion] = useState(false);

    useEffect(() => {
        // Simulamos que recibimos los folios generados de la vista anterior.
        // Esto puede venir de un almacenamiento local, contexto o props.
        const foliosGenerados = [135468, 135469, 135470]; // Por ejemplo, los folios generados.
        
        if (foliosGenerados.length > 0) {
            setInicioFolioCheque(foliosGenerados[0]); // Asignamos el primer folio generado al inicio
            setFinalFolioCheque(foliosGenerados[foliosGenerados.length - 1]); // Asignamos el último folio generado al final
        }
    }, []);

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
                                    <TableRow className={styles.table}>
                                        <TableCell>Folio Cheque</TableCell>
                                        <TableCell>Folio Póliza</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {polizasGeneradas.map((poliza, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{poliza.folioCheque}</TableCell>
                                            <TableCell>{poliza.folioPoliza}</TableCell>
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
