"use client";
import { useState } from 'react';
import styles from '../Reposicion/page.module.css';
import Link from 'next/link';
import { Box, Typography, TextField, Button, Paper, Grid, ThemeProvider } from '@mui/material';
import { FileUpload } from 'primereact/fileupload';
import theme from '../../$tema/theme';

export default function RepositionCheque() {
  const [employeeData] = useState({
    "123": { firstName: "Juan", lastName: "Pérez", amount: "1500", payrollType: "NOMINA 8" },
    "456": { firstName: "Ana", lastName: "Gómez", amount: "2000", payrollType: "ESTRUCTURA" }
  });

  const [checkData] = useState({
    "101": { policyFolio: "1001", fortnight: "1", year: "2024" },
    "102": { policyFolio: "1002", fortnight: "2", year: "2024" }
  });

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

  const [successMessage, setSuccessMessage] = useState(false);

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
    } else {
      setDisplayData((prevState) => ({
        ...prevState,
        firstName: '-',
        lastName: '-',
        amount: '-',
        payrollType: '-'
      }));
    }
  };

  const fetchCheckData = () => {
    const data = checkData[formState.checkFolio];
    if (data) {
      setDisplayData((prevState) => ({
        ...prevState,
        policyFolio: data.policyFolio,
        fortnight: data.fortnight,
        year: data.year
      }));
    } else {
      setDisplayData((prevState) => ({
        ...prevState,
        policyFolio: '-',
        fortnight: '-',
        year: '-'
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage(true);
    setFormState({ employeeId: '', checkFolio: '', reason: '', evidence: null });
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <ThemeProvider theme={theme}>

      <Paper elevation={3} className={styles.container}>
        <Typography variant="h4" gutterBottom>Reposición de Cheques</Typography>
        <form id="repositionForm" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Columna de Información del Empleado */}
            <Grid className={styles.inputContainer} item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID Empleado"
                variant="outlined"
                className={styles.textField}
                size="small"
                placeholder="Ingrese el ID del empleado"
                value={formState.employeeId}
                onChange={(e) => setFormState({ ...formState, employeeId: e.target.value })}
                onInput={fetchEmployeeData}
                required
              />
              <TextField
                fullWidth
                label="Nombre"
                variant="outlined"
                className={styles.textField}
                size="small"
                value={displayData.firstName}
                InputProps={{ readOnly: true }}
                sx={{ marginTop: '1rem' }}
              />
              <TextField
                fullWidth
                label="Apellido"
                variant="outlined"
                className={styles.textField}
                size="small"
                value={displayData.lastName}
                InputProps={{ readOnly: true }}
                sx={{ marginTop: '1rem' }}
              />
              <TextField
                fullWidth
                label="Monto"
                variant="outlined"
                className={styles.textField}
                size="small"
                value={displayData.amount}
                InputProps={{ readOnly: true }}
                sx={{ marginTop: '1rem' }}
              />
              <TextField
                fullWidth
                label="Tipo de Nómina"
                variant="outlined"
                className={styles.textField}
                size="small"
                value={displayData.payrollType}
                InputProps={{ readOnly: true }}
                sx={{ marginTop: '1rem' }}
              />
            </Grid>

            {/* Columna de Información del Cheque */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Folio de Cheque"
                variant="outlined"
                className={styles.textField}
                size="small"
                type="number"
                placeholder="Ingrese el folio del cheque"
                value={formState.checkFolio}
                onChange={(e) => setFormState({ ...formState, checkFolio: e.target.value })}
                onInput={fetchCheckData}
                required
              />
              <TextField
                fullWidth
                label="Folio de Póliza"
                variant="outlined"
                className={styles.textField}
                size="small"
                value={displayData.policyFolio}
                InputProps={{ readOnly: true }}
                sx={{ marginTop: '1rem' }}
              />
              <TextField
                fullWidth
                label="Quincena"
                variant="outlined"
                className={styles.textField}
                size="small"
                value={displayData.fortnight}
                InputProps={{ readOnly: true }}
                sx={{ marginTop: '1rem' }}
              />
              <TextField
                fullWidth
                label="Año"
                variant="outlined"
                className={styles.textField}
                size="small"
                value={displayData.year}
                InputProps={{ readOnly: true }}
                sx={{ marginTop: '1rem' }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Motivo de Reposición"
            variant="outlined"
            className={styles.textField}
            size="small"
            placeholder="Describa el motivo de la reposición"
            value={formState.reason}
            onChange={(e) => setFormState({ ...formState, reason: e.target.value })}
            required
            multiline
            rows={4}
            sx={{ marginTop: '1.5rem' }}
          />

          <Box className={styles.buttonContainer2}>
            <Typography variant="body1" sx={{ marginTop: '1rem' }}>Subir Evidencia (Obligatorio):</Typography>
            <FileUpload
              mode="basic"
              name="evidence"
              accept="image/*,application/pdf"
              customUpload
              auto
              uploadHandler={(e) => setFormState({ ...formState, evidence: e.files[0] })}
              chooseLabel="Seleccionar Archivo"
              className={styles.uploadButton}
            />
          </Box>

          <Box className={styles.buttonContainer}>
            <Link href="/Antonio">
              <Button type="submit" variant="contained" color="primary">Reponer Cheque</Button>
            </Link>
            <Button
              type="reset"
              color="secondary"
              onClick={() => setFormState({ employeeId: '', checkFolio: '', reason: '', evidence: null })}
            >
              Cancelar
            </Button>
          </Box>
        </form>
      </Paper>

      {successMessage && (
        <Box className={styles.successMessage}>
          <Typography variant="body1" color="success">¡Cheque repuesto exitosamente!</Typography>
        </Box>
      )}
    </ThemeProvider>
  );
}
