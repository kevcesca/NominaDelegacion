"use client";
import { useState } from 'react';
import styles from '../Reposicion/page.module.css';
import Link from 'next/link';
import { Box, Typography, TextField, Button, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FileUpload } from 'primereact/fileupload';
import ProtectedView from "../../%Components/ProtectedView/ProtectedView"; // Ajusta la ruta según tu estructura
import theme from '../../$tema/theme';




function RepositionCheque() {
  // Datos estáticos para empleados y cheques
  const [employeeData] = useState({
      "123": { firstName: "Juan", lastName: "Pérez", amount: "$5000", payrollType: "Base" },
      "456": { firstName: "Ana", lastName: "Gómez", amount: "$4500", payrollType: "Nómina 8" }
  });

  const [checkData] = useState({
      "50": { policyFolio: "001", fortnight: "1ra quincena de noviembre", year: "2024" },
      "51": { policyFolio: "002", fortnight: "1ra quincena de noviembre", year: "2024" }
  });

  // Estado para almacenar la información del formulario y los datos a mostrar
  const [formState, setFormState] = useState({
      employeeId: '',
      checkFolio: '',
      reason: '',
      evidence: null
  });

  const [displayData, setDisplayData] = useState({
      firstName: '-',
      lastName: '-',
      amount: '-',
      payrollType: '-',
      policyFolio: '-',
      fortnight: '-',
      year: '-'
  });

  const [cheques, setCheques] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);

  // Función para obtener los datos del empleado según el ID
  const fetchEmployeeData = () => {
      const data = employeeData[formState.employeeId];
      if (data) {
          setDisplayData((prevState) => ({
              ...prevState,
              firstName: data.firstName,
              lastName: data.lastName,
              amount: data.amount,
              payrollType: data.payrollType
          }));
      }
  };

  // Función para obtener los datos del cheque según el folio
  const fetchCheckData = () => {
      const data = checkData[formState.checkFolio];
      if (data) {
          setDisplayData((prevState) => ({
              ...prevState,
              policyFolio: data.policyFolio,
              fortnight: data.fortnight,
              year: data.year
          }));
      }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
      event.preventDefault();

      // Crear el nuevo cheque con la información del formulario
      const newCheque = {
          employeeId: formState.employeeId,
          firstName: displayData.firstName,
          lastName: displayData.lastName,
          payrollType: displayData.payrollType,
          checkFolio: formState.checkFolio,
          policyFolio: displayData.policyFolio,
          fortnight: displayData.fortnight,
          year: displayData.year,
          reason: formState.reason,
          evidence: formState.evidence ? formState.evidence.name : '', // Mostrar solo el nombre del archivo
          status: 'Reposición', // Estado de la reposición
          paymentType: 'Cheque' // Tipo de pago
      };

      // Añadir el nuevo cheque a la tabla
      setCheques([...cheques, newCheque]);

      // Limpiar el formulario después de agregar el cheque
      setFormState({ employeeId: '', checkFolio: '', reason: '', evidence: null });
      setDisplayData({
          firstName: '-',
          lastName: '-',
          amount: '-',
          payrollType: '-',
          policyFolio: '-',
          fortnight: '-',
          year: '-'
      });
      setSuccessMessage(true);

      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
      <Paper elevation={3} className={styles.container}>
          <Typography variant="h4" gutterBottom>Reposición de Cheques</Typography>
          <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                      <TextField 
                          fullWidth 
                          label="ID Empleado" 
                          variant="outlined" 
                          value={formState.employeeId} 
                          onChange={(e) => setFormState({ ...formState, employeeId: e.target.value })} 
                          onInput={fetchEmployeeData} 
                          required 
                      />
                      <TextField 
                          fullWidth 
                          label="Folio de Cheque" 
                          variant="outlined" 
                          value={formState.checkFolio} 
                          onChange={(e) => setFormState({ ...formState, checkFolio: e.target.value })} 
                          onInput={fetchCheckData} 
                          required 
                      />
                      <TextField 
                          fullWidth 
                          label="Motivo" 
                          variant="outlined" 
                          value={formState.reason} 
                          onChange={(e) => setFormState({ ...formState, reason: e.target.value })} 
                          required 
                      />
                      <FileUpload 
                          name="file" 
                          customUpload 
                          uploadHandler={(e) => setFormState({ ...formState, evidence: e.files[0] })} 
                          chooseLabel="Subir archivo" 
                      />
                  </Grid>
              </Grid>
              <Button variant="contained" color="primary" type="submit">Añadir Cheque</Button>
          </form>

          {/* Tabla de cheques */}
          <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
              <Table>
                  <TableHead>
                      <TableRow>
                          <TableCell><strong>ID Empleado</strong></TableCell>
                          <TableCell><strong>Nombre</strong></TableCell>
                          <TableCell><strong>Tipo Nómina</strong></TableCell>
                          <TableCell><strong>F. Cheque</strong></TableCell>
                          <TableCell><strong>Monto</strong></TableCell>
                          <TableCell><strong>Folio de Póliza</strong></TableCell>
                          <TableCell><strong>Quincena</strong></TableCell>
                          <TableCell><strong>Motivo</strong></TableCell>
                          <TableCell><strong>Estado</strong></TableCell>
                          <TableCell><strong>Evidencia</strong></TableCell>
                          <TableCell><strong>Tipo de Pago</strong></TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {cheques.map((cheque, index) => (
                          <TableRow key={index}>
                              <TableCell>{cheque.employeeId}</TableCell>
                              <TableCell>{cheque.firstName} {cheque.lastName}</TableCell>
                              <TableCell>{cheque.payrollType}</TableCell>
                              <TableCell>{cheque.checkFolio}</TableCell>
                              <TableCell>{cheque.amount}</TableCell>
                              <TableCell>{cheque.policyFolio}</TableCell>
                              <TableCell>{cheque.fortnight}</TableCell>
                              <TableCell>{cheque.reason}</TableCell>
                              <TableCell>{cheque.status}</TableCell>
                              <TableCell>{cheque.evidence}</TableCell>
                              <TableCell>{cheque.paymentType}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>

          {/* Botón para generar cheques nuevos */}
          <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
              <Link href="/ruta-generar-cheques">
                  <Button variant="contained" color="primary">Generar Cheques Nuevos</Button>
              </Link>
          </Box>
      </Paper>
  );
}

export default RepositionCheque;