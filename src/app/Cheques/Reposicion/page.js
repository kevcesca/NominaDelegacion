"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { TextField, Button, MenuItem, Grid, Typography } from "@mui/material";
import DateFilter from "../../%Components/DateFilter/DateFilter";


const ReposicionCheques = () => {
  const [formData, setFormData] = useState({
    fecha: "",
    quincena: "",
    anio: "",
    id: "",
    nombre_completo: "",
    folio_anterior: "",
    tipo_nomina: "",
    monto: "",
    folio_nuevo: "",
    poliza: "",
  });

  const handleDateChange = (dateInfo) => {
    setFormData({
      ...formData,
      fecha: dateInfo.fechaISO,
      quincena: dateInfo.quincena,
      anio: dateInfo.anio.toString(),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchEmployeeData = async () => {
    if (!formData.id) return;
    try {
      const response = await fetch(`/api/empleados/${formData.id}`); // Ajusta la ruta según tu API
      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...formData,
          nombre_completo: data.nombre,
          folio_anterior: data.folio_anterior,
          tipo_nomina: data.tipo_nomina,
          monto: data.monto,
        });

        // Obtener Folio Nuevo y Póliza automáticamente
        const folioResponse = await fetch("/api/folios/latest");
        const folioData = await folioResponse.json();
        setFormData((prev) => ({
          ...prev,
          folio_nuevo: folioData.folio_nuevo,
          poliza: folioData.poliza,
        }));
      } else {
        alert("Empleado no encontrado.");
      }
    } catch (error) {
      console.error("Error al buscar empleado:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/cheques", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Datos enviados exitosamente.");
      } else {
        alert("Error al enviar datos.");
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Typography variant="h5" align="center" className={styles.header}>
        Reposición de Cheques
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* DateFilter */}
          <Grid item xs={12}>
            <DateFilter onDateChange={handleDateChange} />
          </Grid>

          {/* Campos: ID y botón de búsqueda */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="ID"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchEmployeeData}
            >
              Buscar Empleado
            </Button>
          </Grid>

          {/* Campos obtenidos automáticamente */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre Completo"
              name="nombre_completo"
              value={formData.nombre_completo}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Folio Anterior"
              name="folio_anterior"
              value={formData.folio_anterior}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tipo de Nómina"
              name="tipo_nomina"
              value={formData.tipo_nomina}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Monto"
              name="monto"
              value={formData.monto}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Campos generados automáticamente */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Folio Nuevo"
              name="folio_nuevo"
              value={formData.folio_nuevo}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Póliza"
              name="poliza"
              value={formData.poliza}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        {/* Botón de generar */}
        <div className={styles.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={styles.submitButton}
          >
            GENERAR
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReposicionCheques;
