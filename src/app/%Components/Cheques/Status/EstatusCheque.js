"use client";
import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import ReusableTable2 from "../../../%Components/ReusableTable2/ReusableTable2";
import DateFilter from "../../../%Components/DateFilter/DateFilter";
import styles from "./EstatusCheque.module.css";
import API_BASE_URL from "../../../%Config/apiConfig";

const StatusCheques = () => {
  const [chequeData, setChequeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentParams, setCurrentParams] = useState({ anio: "", quincena: "" });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch de datos
  const fetchChequeData = async () => {
    const { anio, quincena } = currentParams;
    if (!anio || !quincena) return []; // Validación

    try {
      const response = await fetch(
        `${API_BASE_URL}/estadoCheques?quincena=${quincena}&anio=${anio}`
      );
      if (response.ok) {
        const data = await response.json();
        setChequeData(data);
        setFilteredData(data);
        return data;
      } else {
        alert("Error al cargar los datos de cheques.");
        return [];
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      alert("No se pudo conectar con el servicio.");
      return [];
    }
  };

  // Actualizar estado de un cheque
  const updateChequeState = async (row, newState) => {
    try {
      const { anio, quincena } = currentParams;
      if (!anio || !quincena) {
        alert("Faltan datos para actualizar el estado del cheque.");
        return;
      }

      const currentDate = new Date().toISOString().split("T")[0];
      const folioCheque = row.folio_cheque;

      const response = await fetch(
        `${API_BASE_URL}/NominaCtrl/ActualizarEstadoCheques?estadoCheque=${newState}&fecha=${currentDate}&quincena=${quincena}&folioInicial=${folioCheque}&folioFinal=${folioCheque}`,
        { method: "GET" }
      );

      if (response.ok) {
        alert(`El estado del cheque ${folioCheque} se actualizó a "${newState}".`);
        await fetchChequeData(); // Refrescar los datos
      } else {
        alert(`Error al actualizar el cheque ${folioCheque}.`);
      }
    } catch (error) {
      console.error(`Error al actualizar el cheque ${row.folio_cheque}:`, error);
      alert("No se pudo conectar con el servicio.");
    }
  };

  // Manejar cambio de fecha y quincena
  const handleDateChange = ({ anio, quincena }) => {
    setCurrentParams({ anio, quincena });
    fetchChequeData();
  };

  // Manejo de búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchQuery(term);
    if (term.trim() === "") {
      setFilteredData(chequeData); // Restaurar datos originales
    } else {
      const filtered = chequeData.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(term)
        )
      );
      setFilteredData(filtered);
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom>
        Gestión de Status de Cheques
      </Typography>

      <Box className={styles.controls}>
        <DateFilter onDateChange={handleDateChange} />
        <TextField
          sx={{ width: "50vw", marginTop: "1rem" }}
          variant="outlined"
          placeholder="Buscar en todas las propiedades"
          value={searchQuery}
          onChange={handleSearch}
        />
      </Box>

      <ReusableTable2
        columns={[
          { label: "ID Empleado", accessor: "id_empleado" },
          { label: "Nombre Completo", accessor: "nombre_completo" },
          { label: "Folio Cheque", accessor: "folio_cheque" },
          { label: "Monto", accessor: "monto" },
          {
            label: "Estado",
            accessor: "estado_cheque",
            editable: true,
            editor: (row, onChange) => (
              <Select
                value={row.estado_cheque}
                onChange={(e) => {
                  const newState = e.target.value;
                  updateChequeState(row, newState); // Actualizar estado del cheque
                  onChange(newState);
                }}
              >
                <MenuItem value="Creado">Creado</MenuItem>
                <MenuItem value="Pagado">Pagado</MenuItem>
                <MenuItem value="No Cobrado">No Cobrado</MenuItem>
                <MenuItem value="En Transito">En Transito</MenuItem>
                <MenuItem value="Cancelado">Cancelado</MenuItem>
              </Select>
            ),
          },
          { label: "Fecha", accessor: "fecha" },
          { label: "Quincena", accessor: "quincena" },
          { label: "Tipo Nómina", accessor: "tipo_nomina" },
        ]}
        fetchData={fetchChequeData}
        editable
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </Box>
  );
};

export default StatusCheques;
