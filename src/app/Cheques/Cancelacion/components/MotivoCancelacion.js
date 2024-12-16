import React from "react";
import { TextField } from "@mui/material";

const MotivoCancelacion = ({ motivoCancelacion, setMotivoCancelacion }) => (
    <TextField
        label="Motivo de Cancelación"
        multiline
        rows={4}
        value={motivoCancelacion}
        onChange={(e) => setMotivoCancelacion(e.target.value)}
        fullWidth
        margin="normal"
    />
);

export default MotivoCancelacion;
