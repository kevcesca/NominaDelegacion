import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import API_BASE_URL from "../../../%Config/apiConfig";

// Función para transformar el texto a formato "Primera Mayúscula"
const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export default function GenerateChequesForm({ quincena, fecha, tipoNomina }) {
    const [folioInicial, setFolioInicial] = useState("");
    const [totalCheques, setTotalCheques] = useState("");
    const [ultimoFolio, setUltimoFolio] = useState(null); // Estado para almacenar el último folio
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Obtener el último folio generado al montar el componente
    useEffect(() => {
        const fetchUltimoFolio = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/ultimoFolioCheque`);
                const { num_folio } = response.data;

                setUltimoFolio(num_folio); // Guardar el último folio
                setFolioInicial(num_folio + 1); // Prellenar el campo de folio inicial sumando 1
            } catch (error) {
                console.error("Error al obtener el último folio de cheque:", error);
                alert("No se pudo obtener el último folio de cheque. Inténtalo más tarde.");
            }
        };

        fetchUltimoFolio();
    }, []);


    const insertChequeData = async (anio, quincena) => {
            if (!anio || !quincena) {
                alert("Por favor selecciona un año y una quincena.");
                return;
            }
        
            try {
                // Servicio que inserta nuevos datos
                const response = await fetch(
                    `${API_BASE_URL}/NominaCtrl/InsertEstadoCheques?anio=${anio}&quincena=${quincena}`,
                    { method: "GET" }
                );
        
                if (response.ok) {
                    const message = await response.text();
                    alert(message); // Mostrar mensaje de éxito del backend
        
                    // Después de insertar, llamar al servicio que recupera los datos
                    //fetchChequeData(anio, quincena); // Refrescar la tabla automáticamente
                } else {
                    alert("Error al insertar los datos.");
                }
            } catch (error) {
                console.error("Error al insertar los datos:", error);
                alert("No se pudo conectar con el servicio.");
            }
        };

        const handleDateChange = ({ anio, quincena }) => {
            insertChequeData(anio, quincena);
        };
    

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();



        // Aplicamos la transformación al tipo de nómina
        const tipoNominaFormateado = capitalizeFirstLetter(tipoNomina);

        console.log("Debug ->", {
            folioInicial,
            totalCheques,
            quincena,
            fecha,
            tipoNomina: tipoNominaFormateado,
        }); // Depuración

         // Extraer el año de la fecha
    let anio;
    try {
        anio = new Date(fecha).getFullYear(); // Esto asume que `fecha` es válida
    } catch (error) {
        console.error("Fecha inválida:", error);
        alert("Fecha proporcionada es inválida.");
        return;
    }

        if (!folioInicial || !totalCheques || !quincena || !fecha || !tipoNomina) {
            alert(
                `Por favor, completa todos los campos.\nFolio Inicial: ${folioInicial || "Vacío"}\nTotal Cheques: ${
                    totalCheques || "Vacío"
                }\nQuincena: ${quincena || "Vacío"}\nFecha: ${fecha || "Vacío"}\nTipo de Nómina: ${
                    tipoNomina || "Vacío"
                }`
            );
            return;
        }

        try {
            setLoading(true);
            setSuccessMessage("");

            const url = `${API_BASE_URL}/generarCheques?folioInicial=${folioInicial}&totalCheques=${totalCheques}&quincena=${quincena}&fecha=${fecha}&tipoNominaSeleccionado=${tipoNominaFormateado}`;
            const response = await axios.get(url);

            setSuccessMessage("¡Cheques generados exitosamente!");
            console.log("Respuesta del servidor:", response.data);
            await insertChequeData(anio, quincena)
        } catch (error) {
            console.error("Error al generar los cheques:", error);
            alert("Ocurrió un error al generar los cheques. Inténtalo nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                marginTop: 4,
                padding: 3,
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
            }}
        >
            <Typography variant="h6" sx={{ marginBottom: 2, color: "#800000" }}>
                Generar Cheques
            </Typography>
            {ultimoFolio !== null && (
                <Typography
                    variant="body1"
                    sx={{ marginBottom: 2, color: "#235b4e", textAlign: "center" }}
                >
                    El último cheque generado fue: <strong>{ultimoFolio}</strong>
                </Typography>
            )}
            <TextField
                label="Folio Inicial"
                type="number"
                value={folioInicial}
                onChange={(e) => setFolioInicial(e.target.value)}
                fullWidth
                InputProps={{ readOnly: true }}
                required
                sx={{ marginBottom: 2 }}
            />
            <TextField
                label="Total de Cheques"
                type="number"
                value={totalCheques}
                onChange={(e) => setTotalCheques(e.target.value)}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                
            >
                {loading ? "Generando..." : "Generar Cheques"}
            </Button>
            {successMessage && (
                <Typography
                    variant="body1"
                    sx={{ marginTop: 2, color: "green", textAlign: "center" }}
                >
                    {successMessage}
                </Typography>
            )}
        </Box>
    );
}
