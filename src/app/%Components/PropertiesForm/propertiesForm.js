"use client";

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';

const campos = [
    "SECT_PRES", "ID_UNIDAD_ADM", "ID_EMPLEADO", "APELLIDO_1", "APELLIDO_2",
    "NOMBRE", "ID_LEGAL", "CURP", "FEC_NAC", "ID_SEXO", "ID_SUBUNIDAD",
    "ID_DIRECCION_ADM", "ID_SUBDIRECCION", "ID_JUD", "ID_OFICINA", "ID_TIPO_NOMINA",
    "ID_UNIVERSO", "ID_NIVEL_SALARIAL", "ID_PUESTO", "N_PUESTO", "ID_SINDICATO",
    "SIT_PLAZA_EMP", "ID_PLAZA", "FEC_ALTA_EMPLEADO", "FEC_ANTIGUEDAD", "ID_TURNO",
    "ID_ZONA_PAGADORA", "PERCEPCIONES", "DEDUCCIONES", "LIQUIDO", "NUM_CUENTA",
    "NUMERO_SS", "ID_BANCO", "DIAS_LAB", "ID_REG_ISSSTE", "AHORR_SOLI_PORC",
    "ESTADO", "DELEG_MUNICIP", "POBLACION", "COLONIA", "DIRECCION", "CODIGO_POSTAL",
    "NUM_INTERIOR", "NUM_EXTERIOR", "CALLE", "N_DELEGACION_MUNICIPIO", "ENT_FEDERATIVA"
];

const PropertiesForm = () => {
    const [values, setValues] = useState(
        campos.reduce((acc, campo) => {
            acc[campo] = "";
            return acc;
        }, {})
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const properties = campos.map(campo => `${campo}=${values[campo]}`).join('\n');
        const blob = new Blob([properties], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'config.properties');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ m: 2 }}>
            <Typography variant="h6" gutterBottom>
                Configurar Properties
            </Typography>
            <Grid container spacing={2}>
                {campos.map(campo => (
                    <Grid item xs={12} sm={6} key={campo}>
                        <TextField
                            name={campo}
                            label={campo}
                            value={values[campo]}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        Guardar Archivo Properties
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PropertiesForm;
