'use client';
import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../$tema/theme';
import styles from "../page.module.css";
import { Box, TextField, Typography, Select, MenuItem, InputLabel, FormControl, Button, Grid } from '@mui/material';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function GenerateChecks() {
    const [year, setYear] = useState('');
    const [payPeriod, setPayPeriod] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [payrollType, setPayrollType] = useState('Compuesta');
    const [checkFolio, setCheckFolio] = useState('135468-135968');
    const [policyFolio, setPolicyFolio] = useState('13546-14046');
    const [checkCount, setCheckCount] = useState('500');
    const [totalAmount, setTotalAmount] = useState('1,050,985');
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState([
        { id: 13515, name: 'Juan', checkNumber: 135468, policyNumber: 13546, type: 'Compuesta', amount: 5000, clc: '', status: 'Creado' },
        { id: 13516, name: 'Miguel', checkNumber: 135469, policyNumber: 13547, type: 'Compuesta', amount: 5000, clc: '', status: 'Cancelado' },
        { id: 13517, name: 'Javier', checkNumber: 135470, policyNumber: 13548, type: 'Compuesta', amount: 5000, clc: '', status: 'Creado' },
    ]);

    const toast = useRef(null);

    const payrollTypes = [
        { label: 'Compuesta', value: 'Compuesta' },
        { label: 'Simple', value: 'Simple' },
    ];

    useEffect(() => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        const daysPassed = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
        const currentFortnight = Math.min(Math.ceil(daysPassed / 15), 24);

        setYear(currentYear.toString());
        setPayPeriod(`${currentFortnight}a quincena`);
        setCurrentDate(now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    }, []);

    const generateChecks = () => {
        // Impl
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Checks generated successfully', life: 3000 });
    };

    const cancelChecks = () => {
        // Implementacion para cheques cancelados
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Checks canceled', life: 3000 });
    };

    const testFunction = () => {
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'si funciona', life: 3000 });
    };

    const statusTemplate = (rowData) => (
        <div className="flex align-items-center">
            <span>{rowData.status}</span>
            <i className={`pi ${rowData.status === 'Creado' ? 'pi-check' : 'pi-times'} ml-2`}></i>
        </div>
    );

    return (
        <ThemeProvider theme={theme}>
            <Toast ref={toast} />
            <Box sx={{ p: 4, minHeight: "100vh" }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextField
                            label="Año"
                            defaultValue="2024"
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                            size="small"
                        />
                        <Typography variant="body2" sx={{ color: 'error.main', border: '1px dashed', p: 1 }}>
                            Por favor seleccione el tipo de nomina del que desea generar los cheques
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextField
                            label="Quincena"
                            defaultValue="2da febrero"
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                            size="small"
                        />
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id="payroll-type-label">Tipo de nómina</InputLabel>
                            <Select
                                labelId="payroll-type-label"
                                id="payroll-type"
                                value="Compuesta"
                                label="Tipo de nómina"
                            >
                                <MenuItem value="Compuesta">Compuesta</MenuItem>
                                <MenuItem value="Simple">Simple</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextField
                            label="Fecha actual"
                            defaultValue="21/09/2024"
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                            size="small"
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Folio Cheque"
                                defaultValue="135468-135968"
                                variant="outlined"
                                size="small"
                            />
                            <TextField
                                label="Folio Poliza"
                                defaultValue="13546-14046"
                                variant="outlined"
                                size="small"
                            />
                            <TextField
                                label="No. Cheques"
                                defaultValue="500"
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    </Box>
                </Box>

                <TextField
                    label="Monto total"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <DataTable value={employees} paginator rows={10} className="p-datatable-sm">
                    <Column field="id" header="id empleado" />
                    <Column field="name" header="Nombre" />
                    <Column field="checkNumber" header="F. cheque" />
                    <Column field="policyNumber" header="F. Poliza" />
                    <Column field="type" header="Tipo" />
                    <Column field="amount" header="Monto" />
                    <Column field="clc" header="CLC" />
                    <Column field="status" header="Estado cheque" body={statusTemplate} />
                </DataTable>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={generateChecks}>
                        Generar
                    </Button>
                    <Button variant="contained" color="secondary" onClick={cancelChecks}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="success" onClick={testFunction}>
                        Probar
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    );
}