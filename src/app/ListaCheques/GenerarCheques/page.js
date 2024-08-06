// src/app/ListaCheques/GenerarCheques/page.js
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cheque from '../../%Components/Cheque/Cheque';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Box } from '@mui/material';
import { Button } from 'primereact/button';
import axios from 'axios';
import styles from './page.module.css';

const GenerarChequesPage = () => {
    const [cheques, setCheques] = useState([]);
    const router = useRouter();

    useEffect(() => {
        loadCheques();
    }, []);

    const loadCheques = async () => {
        try {
            const response = await axios.get(`http://192.168.100.77:8080/consultaEmpleados/TotalesCheques?anio=2024&quincena=01`); // Update with your parameters
            setCheques(response.data);
        } catch (error) {
            console.error('Error loading cheques:', error);
        }
    };

    const exportPDF = async () => {
        const doc = new jsPDF();
        const chequeElements = document.querySelectorAll('.cheque');

        for (let i = 0; i < chequeElements.length; i++) {
            const canvas = await html2canvas(chequeElements[i]);
            const imgData = canvas.toDataURL('image/png');
            const imgProperties = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

            if (i > 0) {
                doc.addPage();
            }
            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }

        doc.save('cheques.pdf');
    };

    return (
        <div className={styles.container}>
            <h1>Cheques Generados</h1>
            <Button type="button" label="Exportar PDF" icon="pi pi-file-pdf" onClick={exportPDF} className={styles.exportButton} />
            {cheques.length > 0 && (
                <Box>
                    {cheques.map((cheque, index) => (
                        <div key={index} className="cheque">
                            <Cheque
                                polizaNo={cheque.poliza}
                                noDe={cheque.cheque}
                                noEmpleado={cheque.id_empleado}
                                nombreBeneficiario={`${cheque.nombre} ${cheque.apellido_1} ${cheque.apellido_2}`}
                                importeLetra=""
                                conceptoPago={cheque.nombre_nomina}
                                rfc={cheque.id_legal}
                                tipoNomina="1"
                                percepciones={cheque.percepciones}
                                deducciones={cheque.deducciones}
                                liquido={cheque.liquido}
                                nombre={`${cheque.nombre} ${cheque.apellido_1} ${cheque.apellido_2}`}
                                fecha="15/04/2024"
                            />
                        </div>
                    ))}
                </Box>
            )}
            <Button type="button" label="Volver" icon="pi pi-arrow-left" onClick={() => router.push('/TotalConceptos')} className={styles.backButton} />
        </div>
    );
};

export default GenerarChequesPage;
