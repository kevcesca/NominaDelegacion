'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Pagination,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import DateFilter from '../../%Components/DateFilter/DateFilter';
import PolizasTable from './components/PolizasTable';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from './page.module.css';
import API_BASE_URL from '../../%Config/apiConfig';

export default function PolizasGeneradas() {
    const [polizas, setPolizas] = useState([]);
    const [filteredPolizas, setFilteredPolizas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedData, setSelectedData] = useState({ anio: '', quincena: '', fechaISO: '' });

    const fetchPolizas = async ({ anio, quincena }) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/poliza?quincena=${quincena}&anio=${anio}`);
            if (!response.ok) throw new Error('Error al obtener las pólizas');
            const data = await response.json();
            setPolizas(data);
            setFilteredPolizas(data);
        } catch (error) {
            console.error(error);
            setPolizas([]);
            setFilteredPolizas([]);
        } finally {
            setLoading(false);
        }
    };
    const exportToPDF = (selectedRows) => {
        if (selectedRows.length === 0) {
            alert('No hay registros seleccionados para exportar.');
            return;
        }
    
        const doc = new jsPDF();
        const title = 'Reporte de Pólizas Generadas';
        const headers = [
            ['ID Empleado', 'Folio Cheque', 'Folio Póliza', 'Concepto de Pago', 'Percepciones', 'Deducciones', 'Líquido'],
        ];
    
        const data = selectedRows.map((row) => [
            row.id_empleado,
            row.folio_cheque,
            row.folio_poliza,
            row.concepto_pago,
            `$${row.percepciones.toFixed(2)}`,
            `$${row.deducciones.toFixed(2)}`,
            `$${row.liquido.toFixed(2)}`,
        ]);
    
        // Configurar estilos del PDF
        doc.setFontSize(16);
        doc.text(title, 14, 15);
    
        doc.autoTable({
            startY: 20,
            head: headers,
            body: data,
            theme: 'grid',
            headStyles: {
                fillColor: [128, 0, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center',
            },
            bodyStyles: { halign: 'center' },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });
    
        doc.save('polizas_generadas.pdf');
    };

    const exportToExcel = (selectedRows) => {
        if (selectedRows.length === 0) {
            alert('No hay registros seleccionados para exportar.');
            return;
        }
    
        const worksheet = XLSX.utils.json_to_sheet(
            selectedRows.map((row) => ({
                'ID Empleado': row.id_empleado,
                'Folio Cheque': row.folio_cheque,
                'Folio Póliza': row.folio_poliza,
                'Concepto de Pago': row.concepto_pago,
                Percepciones: row.percepciones.toFixed(2),
                Deducciones: row.deducciones.toFixed(2),
                Líquido: row.liquido.toFixed(2),
            }))
        );
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pólizas Generadas');
        XLSX.writeFile(workbook, 'polizas_generadas.xlsx');
    };

    const exportToCSV = (selectedRows) => {
        if (selectedRows.length === 0) {
            alert('No hay registros seleccionados para exportar.');
            return;
        }
    
        const headers = [
            'ID Empleado,Folio Cheque,Folio Póliza,Concepto de Pago,Percepciones,Deducciones,Líquido',
        ];
        const rows = selectedRows.map((row) => [
            row.id_empleado,
            row.folio_cheque,
            row.folio_poliza,
            row.concepto_pago,
            row.percepciones.toFixed(2),
            row.deducciones.toFixed(2),
            row.liquido.toFixed(2),
        ]);
    
        const csvContent = [headers, ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'polizas_generadas.csv');
        link.click();
    };

    const generatePolizas = async () => {
        const { quincena, fechaISO } = selectedData;
        if (!quincena || !fechaISO) {
            alert('Por favor seleccione una fecha válida.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/generarPolizas?quincena=${quincena}&fecha=${fechaISO}`,
                { method: 'GET' }
            );

            if (!response.ok) throw new Error('Error al generar las pólizas');
            alert('Pólizas generadas con éxito');
        } catch (error) {
            console.error(error);
            alert('Error al generar las pólizas');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = ({ anio, quincena, fechaISO }) => {
        setSelectedData({ anio, quincena, fechaISO });
        fetchPolizas({ anio, quincena });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = polizas.filter((poliza) =>
            Object.values(poliza).some((value) => value.toString().toLowerCase().includes(query))
        );

        setFilteredPolizas(filtered);
        setCurrentPage(1);
    };

    const handleExport = (format) => {
        if (selectedRows.length === 0) {
            alert('No hay registros seleccionados para exportar.');
            return;
        }

        // Simula la exportación de datos
        alert(`Exportando ${selectedRows.length} registros a ${format}`);
    };

    return (
        <Box className={styles.container}>
            <Typography variant="h5" className={styles.title}>
                Pólizas Generadas
            </Typography>

            {/* Filtro de fecha */}
            <DateFilter onDateChange={handleDateChange} />

            <Box className={styles.generar}> {/* Botón Generar Pólizas */}
            <Button 
                variant="contained"
                color="primary"
                onClick={generatePolizas}
                sx={{ margin: '1rem 0' }}
            >
                Generar Pólizas
            </Button>
            </Box>

            {/* Botones de Exportación */}
            <Box className={styles.exportacion}>
                <Button
                    variant="contained"
                    color="secondary"
                    disabled={selectedRows.length === 0}
                    onClick={() => exportToPDF(selectedRows)}
                >
                    Exportar a PDF
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={selectedRows.length === 0}
                  onClick={() => exportToExcel(selectedRows)}
                >
                    Exportar a Excel
                </Button>
                <Button
                    variant="contained"
                    color="info"
                    disabled={selectedRows.length === 0}
                    onClick={() => exportToCSV(selectedRows)}
                >
                    Exportar a CSV
                </Button>
            </Box>

            {/* Búsqueda */}
            <TextField
                variant="outlined"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={handleSearch}
                fullWidth
                margin="normal"
            />

            {/* Tabla */}
            <PolizasTable
                polizas={filteredPolizas}
                loading={loading}
                onRowSelectionChange={setSelectedRows}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </Box>
    );
}
