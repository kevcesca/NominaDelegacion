// src/app/GenerarCheques/GenerarCheques.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Button, Grid } from '@mui/material';
import Cheque from '../../../%Components/ChequeRespaldo/Cheque'; // Asegúrate de que la ruta es correcta
import API_BASE_URL from '../../../%Config/apiConfig';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


function GenerarCheques({ quincena, anio }) {
    const [cheques, setCheques] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const printRef = useRef();

    useEffect(() => {
        if (!quincena || !anio) return;

        const fetchCheques = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${API_BASE_URL}/consolidacionInformacion`,
                    { params: { quincena, anio } }
                );
                setCheques(response.data);
            } catch (err) {
                setError('Error al cargar los cheques');
            } finally {
                setLoading(false);
            }
        };

        fetchCheques();
    }, [quincena, anio]);

    const exportToPDF = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save('cheques.pdf');
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Box>
            <Button variant="contained" color="primary" onClick={exportToPDF}>
                Exportar a PDF
            </Button>
            <Box ref={printRef} mt={2}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    {cheques.map((cheque) => (
                        <Grid item xs={12} key={cheque["No. de Cheque"]}>
                            <Cheque {...cheque} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default GenerarCheques;
