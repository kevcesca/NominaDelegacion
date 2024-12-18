'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, Typography, Box, Grid, TextField, Button, MenuItem, InputLabel } from '@mui/material';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import API_BASE_URL from '../../%Config/apiConfig';
import styles from './page.module.css';
import theme from '../../$tema/theme';

export default function VerificacionCLC() {
  const [data, setData] = useState([]);
  const [conceptos, setConceptos] = useState([]);
  const [selectedCLC, setSelectedCLC] = useState('');

  // Campos de datos de la CLC seleccionada
  const [id, setId] = useState('');
  const [codigo, setCodigo] = useState('');
  const [montoBruto, setMontoBruto] = useState('');
  const [fechaOperacion, setFechaOperacion] = useState('');
  const [concepto, setConcepto] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [comentario, setComentario] = useState('');
  const [evidencia, setEvidencia] = useState(null);
  const [evidenciaNombre, setEvidenciaNombre] = useState('No se ha seleccionado ningún archivo');

  const toast = useRef(null);

  // Fetch conceptos disponibles desde el servidor
  const fetchConceptos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/CLC/visualizar?concepto=CLC`);
      if (!response.ok) throw new Error('Error al obtener los conceptos de CLC.');

      const result = await response.json();
      setConceptos(result.map((item) => item.concepto.trim()));
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
    }
  };

  useEffect(() => {
    fetchConceptos();
  }, []);

  // Fetch datos de la CLC seleccionada
  const fetchCLCDetails = async (clcConcepto) => {
    try {
      const response = await fetch(`${API_BASE_URL}/CLC/visualizar?concepto=${clcConcepto}`);
      if (!response.ok) throw new Error('Error al obtener los datos de la CLC.');

      const result = await response.json();
      const clcData = result.find((item) => item.concepto.trim() === clcConcepto);
      if (clcData) {
        setId(clcData.id_edocta);
        setCodigo(clcData.codigo.trim());
        setMontoBruto(clcData.monto_bruto);
        setFechaOperacion(clcData.fecha_operacion);
        setConcepto(clcData.concepto.trim());
        setFechaRegistro(new Date().toISOString().split('T')[0]); // Fecha actual como fecha de registro
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
    }
  };

  const handleAgregarCLC = () => {
    if (!id || !concepto || !codigo || !montoBruto || !fechaOperacion || !evidencia) {
      toast.current.show({ severity: 'warn', summary: 'Validación', detail: 'Completa todos los campos.' });
      return;
    }

    const newRecord = {
      id,
      fecha_operacion: fechaOperacion,
      codigo,
      monto_bruto: montoBruto,
      concepto,
      fecha_registro: fechaRegistro,
      comentario,
      evidencia: URL.createObjectURL(evidencia),
    };

    setData([...data, newRecord]);
    toast.current.show({ severity: 'success', summary: 'CLC Agregada', detail: 'La CLC se agregó a la tabla.' });

    // Resetear campos
    setSelectedCLC('');
    setId('');
    setCodigo('');
    setMontoBruto('');
    setFechaOperacion('');
    setConcepto('');
    setFechaRegistro('');
    setComentario('');
    setEvidencia(null);
    setEvidenciaNombre('No se ha seleccionado ningún archivo');
  };

  // Manejador de carga de archivos
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setEvidencia(e.target.files[0]);
      setEvidenciaNombre(e.target.files[0].name);
    }
  };

  // Funciones de Exportación
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Fecha Operación', 'Código', 'Monto Bruto', 'Concepto', 'Fecha Registro', 'Comentario']],
      body: data.map((row) => [
        row.id,
        row.fecha_operacion,
        row.codigo,
        row.monto_bruto,
        row.concepto,
        row.fecha_registro,
        row.comentario,
      ]),
    });
    doc.save('reporteCLC.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'reporteCLC.xlsx');
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Fecha Operación', 'Código', 'Monto Bruto', 'Concepto', 'Fecha Registro', 'Comentario'],
      ...data.map((row) => [
        row.id,
        row.fecha_operacion,
        row.codigo,
        row.monto_bruto,
        row.concepto,
        row.fecha_registro,
        row.comentario,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    saveAs(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }), 'reporteCLC.csv');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <Toast ref={toast} />
        <Typography variant="h4" gutterBottom>
          Verificación de CLC
        </Typography>

        {/* Lista desplegable de Conceptos */}
        <Box mb={2}>
          <TextField
            select
            label="Concepto de CLC"
            value={selectedCLC}
            onChange={(e) => {
              setSelectedCLC(e.target.value);
              fetchCLCDetails(e.target.value);
            }}
            fullWidth
          >
            {conceptos.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Datos de CLC */}
        <Grid container spacing={2}>
          {/* Campos de datos */}
          <Grid item xs={6}>
            <TextField label="ID" value={id} InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Fecha Operación" value={fechaOperacion} InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Código" value={codigo} InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Monto Bruto" value={montoBruto} InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Comentario" value={comentario} onChange={(e) => setComentario(e.target.value)} fullWidth multiline rows={3} />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Subir Evidencia (PDF)</InputLabel>
            <Box display="flex" alignItems="center" gap={2}>
              <Button variant="contained" component="label" color="secondary">
                Seleccionar Archivo
                <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
              </Button>
              <Typography variant="body2">{evidenciaNombre}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" onClick={handleAgregarCLC} style={{ marginTop: '1rem' }}>
          Agregar CLC
        </Button>

        {/* Tabla */}
        <Typography variant="h5" style={{ marginTop: '2rem' }}>
          Verificación de CLC
        </Typography>
        <DataTable value={data} paginator rows={5}>
          <Column field="id" header="ID" />
          <Column field="fecha_operacion" header="Fecha Operación" />
          <Column field="codigo" header="Código" />
          <Column field="monto_bruto" header="Monto Bruto" />
          <Column field="concepto" header="Concepto" />
          <Column field="fecha_registro" header="Fecha Registro" />
          <Column field="comentario" header="Comentario" />
          <Column
            header="Evidencia"
            body={(rowData) => (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                href={rowData.evidencia}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver PDF
              </Button>
            )}
          />
        </DataTable>

        {/* Botones de Exportación */}
        <Box mt={2} display="flex" gap={2}>
          <Button variant="outlined" color="info" onClick={exportToCSV}>
            Exportar a CSV
          </Button>
          <Button variant="outlined" color="success" onClick={exportToExcel}>
            Exportar a Excel
          </Button>
          <Button variant="outlined" color="primary" onClick={exportToPDF}>
            Exportar a PDF
          </Button>
        </Box>
      </div>
    </ThemeProvider>
  );
}
