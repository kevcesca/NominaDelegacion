'use client';
import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Typography, ThemeProvider } from '@mui/material';
import DynamicTable from '../ReporteTable/ReportTable'; 
import { ReporteService } from '../ReporteTable/ReporteService';
import theme from '../../$tema/theme'; // Asegúrate de ajustar la ruta si es necesario

const formFields = {
    "HISTÓRICO DE MOVIMIENTOS DE PERCEPCIÓN DE PERSONAL": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO", "NO. DE REGISTRO", "FECHA DE PAGO"],
    "HISTÓRICO DE MOVIMIENTOS DE PERCEPCIÓN DE PERSONAL POR TIPO DE NÓMINA": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO", "NO. DE REGISTRO", "FECHA DE PAGO"],
    "REPORTE DE NÓMINA HISTÓRICO POR MONTO, TIPO DE NÓMINA": ["REGISTRO", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO DE CLC", "PAGO DE INICIO DE PAGO"],
    "REPORTE DE NÓMINA HISTÓRICO POR MONTO, TIPO DE NÓMINA Y EJERCIDO": ["REGISTRO", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO DE CLC", "PAGO DE INICIO DE PAGO", "MONTO PAGADO", "PENDIENTE POR PAGAR"],
    "REPORTE POR CUENTA POR LIQUIDAR": ["REGISTRO", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "NO. DE CLC", "MONTO DE CLC"],
    "REPORTE DE REINTEGROS POR CUENTA POR LIQUIDAR": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO POR REEMBOLSAR", "CONCEPTO DE REINTEGRO", "FECHA DE PAGO DE REEMBOLSO"],
    "REPORTE DE NOMINA, CUENTA POR LIQUIDAR, DISPERSIÓN": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO", "NO. DE REGISTRO", "FECHA DE PAGO", "NO. DE REGISTRO", "FECHA DE PAGO"],
    "REPORTE DE NOMINA, CUENTA POR LIQUIDAR, PAGO POR CHEQUE": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO", "NO. DE REGISTRO", "FECHA DE PAGO"],
    "REPORTE POR CUENTA POR LIQUIDAR CHEQUES EN TRÁNSITO": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO", "NO. DE REGISTRO", "FECHA DEVOLUCION (SI EXISTIERA EL CASO)", "CHEQUE POR REPOSICIÓN"],
    "REPORTE DE NÓMINAS EXTRAORDINARIAS": ["REGISTRO", "NOMINA EXTRAORDINARIA", "CLC DE LA NOMINA GENERADA", "MONTO DE CLC"],
    "REPORTE DE ACTAS POR RETENCIÓN DE PAGOS": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "MOTIVO DE RETENCIÓN", "SOPORTE DOCUMENTAL"],
    "REPORTE DE CONCEPTOS NO COBRADOS Y MOTIVO DE REEMBOLSOS": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO", "MOTIVO DE REEMBOLSO", "FECHA DE REEMBOLSO"],
    "EMISIÓN DE CHEQUES": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "NO. DE CHEQUE"],
    "REPORTE DE LIBERACIONES": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO RETENIDO", "SOPORTE DOCUMENTAL DE RETENCIÓN", "FECHA DE PAGO LIBERACIÓN", "SOPORTE DOCUMENTAL DE LIBERACIÓN"],
    "REPORTE DE DEFUNCIONES": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "SOPORTE DOCUMENTAL DE RETENCIÓN"],
    "REPORTE DE BAJAS": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "ÚLTIMA QUINCENA COBRADA", "QUINCENA QUE NO APARECE EN REGISTROS", "SOPORTE DOCUMENTAL (SI FUERA EL CASO)"],
    "REPORTE DE ALTAS": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "PRIMER QNA EN LA QUE APARECE EL EMPLEADO", "SOPORTE DOCUMENTAL (SI FUERA EL CASO)"],
    "SALDOS DIARIOS EN BANCOS": ["REGISTRO", "DÍA", "SALDO INICIAL"],
};

const DynamicForm = () => {
    const [reportType, setReportType] = useState('');
    const [formValues, setFormValues] = useState({});
    const [tableData, setTableData] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);

    const handleReportTypeChange = (event) => {
        setReportType(event.target.value);
        setFormValues({});
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form Values:', formValues);
        // Obtener datos simulados del servicio
        const data = await ReporteService.getData(reportType);
        setTableData(data);
        setTableColumns(formFields[reportType]);
    };

    const handleExport = () => {
        // Lógica para exportar la tabla
        console.log('Exportar tabla:', tableData);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{paddingBottom: '2rem'}}>
                <Typography variant="h6" gutterBottom>
                    Seleccione el tipo de reporte
                </Typography>
                <TextField
                    select
                    label="Tipo de Reporte"
                    value={reportType}
                    onChange={handleReportTypeChange}
                    fullWidth
                    margin="normal"
                >
                    {Object.keys(formFields).map((key) => (
                        <MenuItem key={key} value={key}>
                            {key}
                        </MenuItem>
                    ))}
                </TextField>

                {reportType && (
                    <form onSubmit={handleSubmit}>
                        {formFields[reportType].map((field) => (
                            <TextField
                                key={field}
                                name={field}
                                label={field}
                                value={formValues[field] || ''}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        ))}
                        <Button type="submit" variant="contained" color="primary">
                            Enviar
                        </Button>
                    </form>
                )}

                {/* Renderizar la tabla solo si hay datos */}
                {tableData.length > 0 && (
                    <Box mt={4}>
                        <DynamicTable data={tableData} columns={tableColumns} />
                        <Button onClick={handleExport} variant="contained" color="secondary" style={{ marginTop: '16px' }}>
                            Exportar
                        </Button>
                    </Box>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default DynamicForm;
