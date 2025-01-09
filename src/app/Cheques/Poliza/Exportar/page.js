'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Cheque from '../../../%Components/ChequeRespaldo/Cheque';
import { Button, TextField, Box } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import convertirNumeroALetras from '../../../%Utils/convertToWords';
import API_BASE_URL from '../../../%Config/apiConfig';

export default function GeneradorCheques() {
    const [numCheques, setNumCheques] = useState(1); // Número de cheques a mostrar
    const [cheques, setCheques] = useState([]); // Cheques cargados desde el servicio
    const searchParams = useSearchParams(); // Hook para leer parámetros de la URL

    // Función para formatear números con comas
    const formatNumberWithCommas = (number) => {
        return parseFloat(number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Función para cargar los cheques desde el servicio
    const loadCheques = async () => {
        try {
            // Obtener los valores de la URL
            const anio = searchParams.get('anio');
            const quincena = searchParams.get('quincena');

            if (!anio || !quincena) {
                console.error("Faltan parámetros 'anio' o 'quincena' en la URL");
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/consolidacionInformacion`, {
                params: { anio, quincena },
            });

            const dataAdaptada = response.data.map((cheque) => {
                const liquido = cheque["Liquido"]
                    ?.replace(/,/g, "") // Elimina comas
                    ?.replace(/\s+/g, "") // Elimina todos los espacios
                    ?.trim(); // Elimina espacios al inicio y al final

                const liquidoNumero = parseFloat(liquido); // Convierte a número flotante

                return {
                    polizaNo: cheque["Poliza No."].toString().trim(),
                    noDe: cheque["No. de Cheque"].toString().trim(),
                    noEmpleado: cheque["No. de Empleado"].toString().trim(),
                    nombreBeneficiario: cheque["Nombre del Beneficiario"].trim(),
                    importeLetra: convertirNumeroALetras(liquidoNumero), // Convertimos el importe
                    conceptoPago: cheque["Concepto de Pago"].trim(),
                    rfc: cheque["R.F.C."].trim(),
                    tipoNomina: cheque["Tipo de Nómina"].toString().trim(),
                    percepciones: formatNumberWithCommas(cheque["Percepciones"]), // Formateamos percepciones
                    deducciones: formatNumberWithCommas(cheque["Deducciones"]), // Formateamos deducciones
                    liquido: formatNumberWithCommas(liquido), // Formateamos líquido
                    nombre: cheque["Nombre del Beneficiario"].trim(),
                    fecha: cheque["Fecha"].trim(),
                };
            });

            setCheques(dataAdaptada);
            setNumCheques(dataAdaptada.length); // Mostrar automáticamente todos los cheques
        } catch (error) {
            console.error("Error al cargar los cheques:", error);
        }
    };

    // Llamar al servicio al cargar el componente
    useEffect(() => {
        loadCheques();
    }, [searchParams]); // Vuelve a ejecutar si los parámetros cambian

    // Función para exportar los cheques a PDF
    const exportToPDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'letter');
        const chequesContainer = document.getElementById('cheques-container');
        if (chequesContainer) {
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15; // Márgenes para espaciar mejor
            const chequeWidth = pageWidth - 2 * margin;
            const chequeHeight = (pageHeight - 3 * margin) / 2; // Dos cheques por página
            for (let i = 0; i < cheques.length; i++) {
                const chequeElement = chequesContainer.children[i];
                const canvas = await html2canvas(chequeElement);
                const imgData = canvas.toDataURL('image/png');
                if (i % 2 === 0 && i !== 0) {
                    pdf.addPage();
                }
                const y = margin + (i % 2) * (chequeHeight + margin);
                pdf.addImage(imgData, 'PNG', margin, y, chequeWidth, chequeHeight);
            }
            pdf.save('cheques.pdf');
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <h1>Generador de Cheques</h1>
            <TextField
                type="number"
                label="Número de cheques"
                value={numCheques}
                onChange={(event) => setNumCheques(parseInt(event.target.value) || 1)} // Controlamos el número de cheques visibles
                inputProps={{ min: 1 }}
                sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" onClick={exportToPDF} sx={{ marginLeft: 2, marginBottom: 2 }}>
                Exportar a PDF
            </Button>
            <Box id="cheques-container">
                {cheques.slice(0, numCheques).map((cheque, index) => (
                    <Cheque key={index} {...cheque} />
                ))}
            </Box>
        </Box>
    );
}
