'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Toast } from 'primereact/toast';
import { ThemeProvider } from '@mui/material/styles'; // Asegúrate de importar el ThemeProvider
import theme from '../../$tema/theme'; // Asegúrate de importar tu tema personalizado
import styles from "../page.module.css"

export default function ChequesGenerar() {
    const [chequeInicio, setChequeInicio] = useState('');
    const [chequeFin, setChequeFin] = useState('');
    const [montoTotal, setMontoTotal] = useState('');
    const [montoPorCheque, setMontoPorCheque] = useState(0);
    const [cheques, setCheques] = useState([]);
    const [totalPagado, setTotalPagado] = useState(0);

    const toast = React.useRef(null);

    useEffect(() => {
        if (cheques.length > 0) {
            calcularTotal();
        }
    }, [cheques]);

    const generarCheques = () => {
        if (!chequeInicio || !chequeFin || !montoTotal || Number(chequeInicio) > Number(chequeFin)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Verifica los campos ingresados', life: 3000 });
            return;
        }

        const cantidadCheques = Number(chequeFin) - Number(chequeInicio) + 1;
        const montoPorChequeCalculado = (Number(montoTotal) / cantidadCheques).toFixed(2);

        const chequesGenerados = Array.from({ length: cantidadCheques }, (_, i) => ({
            id: Number(chequeInicio) + i,
            idEmpleado: '',
            nombreEmpleado: '',
            monto: montoPorChequeCalculado,
        }));

        setMontoPorCheque(montoPorChequeCalculado);
        setCheques(chequesGenerados);
    };

    const actualizarCheque = (index, field, value) => {
        const nuevosCheques = [...cheques];
        nuevosCheques[index][field] = value;
        setCheques(nuevosCheques);
    };

    const calcularTotal = () => {
        const total = cheques.reduce((acc, cheque) => acc + Number(cheque.monto), 0);
        setTotalPagado(total.toFixed(2));
    };

    const montoTemplate = (rowData, { rowIndex }) => (
        <TextField
            type="number"
            value={rowData.monto}
            onChange={(e) => actualizarCheque(rowIndex, 'monto', e.target.value)}
            fullWidth
        />
    );

    const idEmpleadoTemplate = (rowData, { rowIndex }) => (
        <TextField
            type="text"
            value={rowData.idEmpleado}
            onChange={(e) => actualizarCheque(rowIndex, 'idEmpleado', e.target.value)}
            fullWidth
        />
    );

    const nombreEmpleadoTemplate = (rowData, { rowIndex }) => (
        <TextField
            type="text"
            value={rowData.nombreEmpleado}
            onChange={(e) => actualizarCheque(rowIndex, 'nombreEmpleado', e.target.value)}
            fullWidth
        />
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ p: 4, minHeight:"100vh" }}>
                <Toast ref={toast} />

                <Typography className={styles.h1} variant="h4" gutterBottom >
                    Lista de cheques
                </Typography>

                {/* Inputs para cheques y monto */}
                <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Cheques: Desde"
                            value={chequeInicio}
                            onChange={(e) => setChequeInicio(e.target.value)}
                            type="number"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Hasta"
                            value={chequeFin}
                            onChange={(e) => setChequeFin(e.target.value)}
                            type="number"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Monto Total a Pagar"
                            value={montoTotal}
                            onChange={(e) => setMontoTotal(e.target.value)}
                            type="number"
                            fullWidth
                        />
                    </Grid>
                </Grid>

                {/* Botón para generar los cheques */}
                <Button variant="contained" onClick={generarCheques} sx={{ mb: 3 }}>
                    Generar
                </Button>

                {/* Tabla de cheques generados */}
                <DataTable value={cheques} emptyMessage="No hay cheques generados">
                    <Column field="id" header="ID" />
                    <Column field="idEmpleado" header="ID Empleado" body={idEmpleadoTemplate} />
                    <Column field="nombreEmpleado" header="Nombre Empleado" body={nombreEmpleadoTemplate} />
                    <Column field="monto" header="Monto" body={montoTemplate} />
                </DataTable>

                {/* Mostrar el total */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">
                        Total Pagado: {totalPagado} $
                    </Typography>
                    {totalPagado !== Number(montoTotal) && (
                        <Typography color="error" variant="body1">
                            El total debe coincidir con el monto a pagar
                        </Typography>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
}
