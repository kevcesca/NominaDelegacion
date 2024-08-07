// src/app/ListaCheques/GenerarCheques/page.js
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Box } from '@mui/material';
import { Button } from 'primereact/button';
import styles from './page.module.css';
import Cheque from '../../%Components/Cheque/Cheque'

const GenerarChequesPage = () => {
    const [cheques, setCheques] = useState([]);
    const router = useRouter();

    useEffect(() => {
        loadCheques();
    }, []);

    const loadCheques = async () => {
        try {
            const response = await axios.get(`http://192.168.100.77:8080/consultaEmpleados/TotalesCheques?anio=2024&quincena=01`);
            setCheques(response.data);
        } catch (error) {
            console.error('Error loading cheques:', error);
        }
    };

    const exportPDF = async () => {
        try {
            const response = await axios.post('/api/generarPdf', { cheques }, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cheques.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
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
