'use client'

import React, { useState } from 'react';
import Cheque from '../%Components/Cheque/Cheque';
import { Button, TextField, Box } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function GeneradorCheques() {
    const [numCheques, setNumCheques] = useState(1);
    const [cheques, setCheques] = useState([
        {
            polizaNo: "5360",
            noDe: "108345",
            noEmpleado: "1168954",
            nombreBeneficiario: "Juan Pérez",
            importeLetra: "DOS MIL NOVECIENTOS CINCUENTA Y OCHO PESOS 35/100 M.N.",
            conceptoPago: "2da. Qna. Abril 2024",
            rfc: "VALP",
            tipoNomina: "1",
            percepciones: "3463.93",
            deducciones: "505.58",
            liquido: "2958.35",
            nombre: "Juan Pérez",
            fecha: "15/04/2024"
        }
    ]);

    const handleNumChequesChange = (event) => {
        const num = parseInt(event.target.value);
        setNumCheques(num);

        if (num > cheques.length) {
            const newCheques = [...cheques];
            for (let i = cheques.length; i < num; i++) {
                newCheques.push({ ...cheques[0], nombre: `Empleado ${i + 1}` });
            }
            setCheques(newCheques);
        } else {
            setCheques(cheques.slice(0, num));
        }
    };

    const exportToPDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'letter');
        const chequesContainer = document.getElementById('cheques-container');

        if (chequesContainer) {
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15; // Increased margin for better spacing
            const chequeWidth = pageWidth - 2 * margin;
            const chequeHeight = (pageHeight - 3 * margin) / 2;

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
                onChange={handleNumChequesChange}
                inputProps={{ min: 1 }}
                sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" onClick={exportToPDF} sx={{ marginLeft: 2, marginBottom: 2 }}>
                Exportar a PDF
            </Button>
            <Box id="cheques-container">
                {cheques.map((cheque, index) => (
                    <Cheque key={index} {...cheque} />
                ))}
            </Box>
        </Box>
    );
}