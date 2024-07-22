"use client"

import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box } from '@mui/material';

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

    useEffect(() => {
        // Cargar valores desde localStorage si están disponibles
        const storedValues = localStorage.getItem('formValues');
        if (storedValues) {
            setValues(JSON.parse(storedValues));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('formValues', JSON.stringify(values));
        alert('Valores guardados en localStorage');
    };

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(values, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formValues.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                {campos.map(campo => (
                    <Box key={campo} sx={{ marginBottom: 2 }}>
                        <TextField
                            label={campo}
                            variant="outlined"
                            fullWidth
                            name={campo}
                            value={values[campo]}
                            onChange={handleChange}
                        />
                    </Box>
                ))}
                <Button type="submit" variant="contained" color="primary">
                    Guardar en localStorage
                </Button>
                <Button variant="contained" color="secondary" onClick={handleDownload} sx={{ ml: 2 }}>
                    Descargar JSON
                </Button>
            </form>
        </Container>
    );
};

export default PropertiesForm;
