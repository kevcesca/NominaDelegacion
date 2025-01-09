import React from "react";
import { TextField } from "@mui/material";

const ChequeInfo = ({ chequeInfo }) => (
    <>
        <TextField
            label="Folio del Cheque"
            value={chequeInfo ? chequeInfo.folio_cheque : ""}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
        />
        <TextField
            label="Número de Quincena"
            value={chequeInfo ? chequeInfo.numero_quincena : ""}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
        />
        <TextField
            label="Tipo de Nómina"
            value={chequeInfo ? chequeInfo.tipo_nomina : ""}
            InputProps={{ readOnly: true }}                   
            fullWidth
            margin="normal"
        />
        <TextField
            label="Monto del Cheque"
            value={chequeInfo ? `$${chequeInfo.monto.toFixed(2)}` : ""}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
        />
    </>
);

export default ChequeInfo;
