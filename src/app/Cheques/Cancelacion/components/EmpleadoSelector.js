import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const EmpleadoSelector = ({ empleados, selectedEmpleado, setSelectedEmpleado, setChequeInfo }) => {
  return (
    <Autocomplete
      options={empleados}
      getOptionLabel={(option) => `${option.id_empleado} - ${option.nombre_completo}`}
      renderInput={(params) => (
        <TextField
          {...params}
          label="ID de Empleados"
          placeholder="Seleccione un empleado"
          fullWidth
          margin="normal"
        />
      )}
      onChange={(event, value) => {
        setSelectedEmpleado(value || null);
        setChequeInfo(null); // Limpiar la información del cheque al cambiar de empleado
      }}
      value={selectedEmpleado}
      isOptionEqualToValue={(option, value) => option.id_empleado === value?.id_empleado}
    />
  );
};

export default EmpleadoSelector;
