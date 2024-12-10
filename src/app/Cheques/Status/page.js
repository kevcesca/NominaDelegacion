"use client";
import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, Typography, Box, ThemeProvider } from '@mui/material';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from '../Status/page.module.css';
import theme from '../../$tema/theme';
import { jsPDF } from "jspdf"; // Para PDF
import * as XLSX from "xlsx"; // Para Excel
import { saveAs } from "file-saver"; // Para CSV

const Home = () => {
  const chequeData = [
    { id_empleado: '001', name: 'Juan', lastName1: 'Pérez', lastName2: 'Gómez', chequeNumber: '001', chequeDate: '2024-01-03', chequeAmount: '1500', chequeStatus: 'No cobrado', tipoNomina: 'Nomina 8', quincena: '1' },
    { id_empleado: '002', name: 'María', lastName1: 'López', lastName2: 'Martínez', chequeNumber: '002', chequeDate: '2024-01-10', chequeAmount: '2000', chequeStatus: 'Entregado', tipoNomina: 'Estructura', quincena: '1' },
    { id_empleado: '003', name: 'Carlos', lastName1: 'Sánchez', lastName2: 'Torres', chequeNumber: '003', chequeDate: '2024-01-15', chequeAmount: '2500', chequeStatus: 'Cancelado', tipoNomina: 'Base', quincena: '2' },
    { id_empleado: '004', name: 'Laura', lastName1: 'González', lastName2: 'Vázquez', chequeNumber: '004', chequeDate: '2024-01-20', chequeAmount: '1800', chequeStatus: 'En tránsito', tipoNomina: 'Nomina 8', quincena: '1' },
    { id_empleado: '005', name: 'Antonio', lastName1: 'Ramírez', lastName2: 'Moreno', chequeNumber: '005', chequeDate: '2024-01-25', chequeAmount: '2100', chequeStatus: 'No cobrado', tipoNomina: 'Base', quincena: '2' },
    { id_empleado: '006', name: 'Roberto', lastName1: 'Ruiz', lastName2: 'Paredes', chequeNumber: '006', chequeDate: '2024-01-30', chequeAmount: '1600', chequeStatus: 'Entregado', tipoNomina: 'Estructura', quincena: '1' },
    { id_empleado: '007', name: 'Sandra', lastName1: 'Sánchez', lastName2: 'Flores', chequeNumber: '007', chequeDate: '2024-02-05', chequeAmount: '1700', chequeStatus: 'En tránsito', tipoNomina: 'Nomina 8', quincena: '2' },
    { id_empleado: '008', name: 'Agustin', lastName1: 'Vallejo', lastName2: 'Vergara', chequeNumber: '008', chequeDate: '2024-11-05', chequeAmount: '1900', chequeStatus: 'En tránsito', tipoNomina: 'Nomina 8', quincena: '2' }
  ];

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); // Nuevo estado para el filtro de estado
  const [filteredData, setFilteredData] = useState([...chequeData]);
  const [selectedCheques, setSelectedCheques] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Filtrar por fecha y estado
  const filterData = (date, status) => {
    let filtered = chequeData;
    if (date) {
      filtered = filtered.filter((cheque) => cheque.chequeDate === date);
    }
    if (status) {
      filtered = filtered.filter((cheque) => cheque.chequeStatus === status);
    }
    setFilteredData(filtered);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterData(date, selectedStatus); // Filtra usando el estado actual y la fecha seleccionada
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    filterData(selectedDate, status); // Filtra usando el estado seleccionado y la fecha actual
  };

  const handleResetTable = () => {
    setSelectedDate('');
    setSelectedStatus('');
    setFilteredData([...chequeData]);
    setSelectedCheques([]);
  };

  const handleSelectAll = (e) => {
    setSelectedCheques(e.checked ? filteredData : []);
  };

  // Funciones de exportación
  const exportToPDF = () => {
    const doc = new jsPDF();
    const selectedData = filteredData.filter((cheque) => selectedCheques.includes(cheque.id_empleado));

    doc.autoTable({
      head: [['ID Empleado', 'Nombre', 'Tipo Nómina', 'Folio Cheque', 'Monto', 'Estado Cheque', 'Fecha', 'Quincena', 'Tipo de Pago']],
      body: selectedData.map((cheque) => [
        cheque.id_empleado, cheque.name, cheque.tipoNomina, cheque.chequeNumber, cheque.chequeAmount, cheque.chequeStatus,
        cheque.chequeDate, cheque.quincena, cheque.tipoNomina
      ])
    });
    doc.save('empleados_reporte.pdf');
  };

  const exportToExcel = () => {
    const selectedData = filteredData.filter((cheque) => selectedCheques.includes(cheque.id_empleado));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      selectedData.map((cheque) => ({
        'ID Empleado': cheque.id_empleado,
        'Nombre': cheque.name,
        'Tipo Nómina': cheque.tipoNomina,
        'Folio Cheque': cheque.chequeNumber,
        'Monto': cheque.chequeAmount,
        'Estado Cheque': cheque.chequeStatus,
        'Fecha': cheque.chequeDate,
        'Quincena': cheque.quincena,
        'Tipo de Pago': cheque.tipoNomina
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, 'Empleados');
    XLSX.writeFile(wb, 'empleados_reporte.xlsx');
  };

  const exportToCSV = () => {
    const selectedData = filteredData.filter((cheque) => selectedCheques.includes(cheque.id_empleado));
    const csvData = selectedData.map((cheque) => ({
      'ID Empleado': cheque.id_empleado,
      'Nombre': cheque.name,
      'Tipo Nómina': cheque.tipoNomina,
      'Folio Cheque': cheque.chequeNumber,
      'Monto': cheque.chequeAmount,
      'Estado Cheque': cheque.chequeStatus,
      'Fecha': cheque.chequeDate,
      'Quincena': cheque.quincena,
      'Tipo de Pago': cheque.tipoNomina
    }));

    const csv = [
      ['ID Empleado', 'Nombre', 'Tipo Nómina', 'Folio Cheque', 'Monto', 'Estado Cheque', 'Fecha', 'Quincena', 'Tipo de Pago'],
      ...csvData.map(item => Object.values(item))
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'empleados_reporte.csv');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>Gestión de Status de Cheques</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="1rem">
          <TextField
            label="Filtrar por Fecha"
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            displayEmpty
            sx={{ width: '200px', marginLeft: '1rem' }}
          >
            <MenuItem value="">Todos los Estados</MenuItem>
            <MenuItem value="No cobrado">No cobrado</MenuItem>
            <MenuItem value="Entregado">Entregado</MenuItem>
            <MenuItem value="Cancelado">Cancelado</MenuItem>
            <MenuItem value="En tránsito">En tránsito</MenuItem>
          </Select>
          <Box>
            <Button variant="outlined" onClick={handleResetTable}>Reiniciar Filtros</Button>
          </Box>
          <Select
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(e.target.value)}
            displayEmpty
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </Box>

        <DataTable
          value={filteredData}
          paginator
          rows={recordsPerPage}
          dataKey="id_empleado"
          responsiveLayout="scroll"
          selection={selectedCheques}
          onSelectionChange={(e) => setSelectedCheques(e.value)}
          header={
            <Checkbox
              onChange={handleSelectAll}
              checked={selectedCheques.length === filteredData.length && filteredData.length > 0}
            >
              Seleccionar Todos
            </Checkbox>
          }
        >
          <Column selectionMode="multiple" headerStyle={{ background: '#8B2635', color:"white" }}> selec. todos</Column>
          <Column field="id_empleado" header="ID Empleado" sortable headerStyle={{ background: '#8B2635', color:"white" }}></Column>
          <Column field="name" header="Nombre" sortable headerStyle={{ background: '#8B2635', color:"white" }}></Column>
          <Column field="lastName1" header="A. Paterno" sortable headerStyle={{ background: '#8B2635', color:"white" }}></Column>
          <Column field="lastName2" header="A. Materno" sortable headerStyle={{ background: '#8B2635', color:"white" }}></Column>
          <Column field="chequeNumber" header="Folio Cheque" sortable headerStyle={{ background: '#8B2635', color:"white" }}></Column>
          <Column field="chequeDate" header="Fecha" sortable headerStyle={{ background: '#8B2635', color:"white" }}></Column>
          <Column field="chequeAmount" header="Monto" sortable headerStyle={{ background: '#8B2635', color:"white" }}></Column>
          <Column field="tipoNomina" header="Tipo de Nómina" sortable headerStyle={{ background: '#8B2635', color:"white" }}></Column>
          <Column field="quincena" header="Quincena" sortable headerStyle={{ background: '#8B2635', color:"white" }}></Column>
          <Column field="chequeStatus" header="Estado" sortable headerStyle={{ background: '#8B2635', color:"white" }}></Column>
        </DataTable>

        <Typography variant="body1" sx={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Registros seleccionados: {selectedCheques.length}
        </Typography>
        {filteredData.length === 0 && (
          <Typography color="error" align="center" sx={{ marginTop: '1rem' }}>
            No existen registros con esa fecha o estado.
          </Typography>
        )}

        {/* Botones de exportación */}
        <Box >
        <Button
  variant="contained"
  className={styles.button}
  onClick={exportToPDF}
>
  Exportar a PDF
</Button>
<Button
  variant="contained"
  className={styles.button}
  onClick={exportToExcel}
>
  Exportar a Excel
</Button>
<Button
  variant="contained"
  className={styles.button}
  onClick={exportToCSV}
>
  Exportar a CSV
</Button>

        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;

