"use client"
import { useState } from 'react';
import styles from '../Poliza/page.module.css'; // Asegúrate de crear este archivo de estilos

const empleados = [
    { id: 13515, nombre: "Juan Pérez", tipoNomina: "Estructura", percepciones: "$5200", deducciones: "$200", liquido: "$5000", clc: "CLC1234", estadoCheque: "Creado" },
    { id: 13516, nombre: "Ana Gómez", tipoNomina: "Nómina 8", percepciones: "$4700", deducciones: "$200", liquido: "$4500", clc: "CLC5678", estadoCheque: "Creado" },
    { id: 13517, nombre: "Luis Ramírez", tipoNomina: "Base", percepciones: "$4200", deducciones: "$200", liquido: "$4000", clc: "CLC9012", estadoCheque: "Creado" },
];

export default function GestorPolizas() {
    const [inicioFolioCheque, setInicioFolioCheque] = useState('');
    const [finalFolioCheque, setFinalFolioCheque] = useState('');
    const [polizasGeneradas, setPolizasGeneradas] = useState([]);
    const [mostrarConsolidacion, setMostrarConsolidacion] = useState(false);

    const generarPolizas = () => {
        if (!inicioFolioCheque || !finalFolioCheque || inicioFolioCheque >= finalFolioCheque) {
            alert("Ingrese un rango de folios válido.");
            return;
        }

        let folioPoliza = 2000;
        const cantidadCheques = Math.min(finalFolioCheque - inicioFolioCheque + 1, empleados.length);
        const nuevasPolizas = [];

        for (let i = 0; i < cantidadCheques; i++) {
            const empleado = empleados[i];
            const conceptoPago = `Quincena 2da - ${empleado.tipoNomina}`;
            nuevasPolizas.push({
                ...empleado,
                folioCheque: parseInt(inicioFolioCheque) + i,
                folioPoliza: folioPoliza++,
                conceptoPago,
            });
        }
        setPolizasGeneradas(nuevasPolizas);
    };

    const consolidarInformacion = () => {
        setMostrarConsolidacion(true);
    };

    const exportToPDF = (tableId) => {
        alert(`Exportar tabla ${tableId} a PDF (simulación)`);
    };

    const exportToExcel = (tableId) => {
        alert(`Exportar tabla ${tableId} a Excel (simulación)`);
    };

    const exportToCSV = (tableId) => {
        alert(`Exportar tabla ${tableId} a CSV (simulación)`);
    };

    return (
        <div className={styles.container}>
            <h1>Gestor de Pólizas</h1>

            <div className={styles.inputGroup}>
                <label htmlFor="inicioFolioCheque">Folio de Cheque Inicial:</label>
                <input
                    type="number"
                    id="inicioFolioCheque"
                    value={inicioFolioCheque}
                    onChange={(e) => setInicioFolioCheque(e.target.value)}
                    placeholder="Ejemplo: 135468"
                />
                <label htmlFor="finalFolioCheque">Folio de Cheque Final:</label>
                <input
                    type="number"
                    id="finalFolioCheque"
                    value={finalFolioCheque}
                    onChange={(e) => setFinalFolioCheque(e.target.value)}
                    placeholder="Ejemplo: 135471"
                />
                <button onClick={generarPolizas}>Generar</button>
            </div>

            <div className={styles.tableSection}>
                <h2>Pólizas Generadas</h2>
              
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID Empleado</th>
                            <th>Nombre</th>
                            <th>Folio Cheque</th>
                            <th>Folio Póliza</th>
                            <th>Concepto de Pago</th>
                            <th>Percepciones</th>
                            <th>Deducciones</th>
                            <th>Líquido</th>
                        </tr>
                    </thead>
                    <tbody id="tablaPolizas">
                        {polizasGeneradas.map((poliza, index) => (
                            <tr key={index}>
                                <td>{poliza.id}</td>
                                <td>{poliza.nombre}</td>
                                <td>{poliza.folioCheque}</td>
                                <td>{poliza.folioPoliza}</td>
                                <td>{poliza.conceptoPago}</td>
                                <td>{poliza.percepciones}</td>
                                <td>{poliza.deducciones}</td>
                                <td>{poliza.liquido}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button onClick={consolidarInformacion}>Consolidar Información</button>

            {mostrarConsolidacion && (
                <div className={styles.tableSection}>
                    <h2>Consolidación de Información Cheque-Poliza</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID Empleado</th>
                                <th>Nombre</th>
                                <th>Concepto de Pago</th>
                                <th>Folio Cheque</th>
                                <th>Folio Póliza</th>
                                <th>Percepciones</th>
                                <th>Deducciones</th>
                                <th>Líquido</th>
                                <th>CLC</th>
                                <th>Estado Cheque</th>
                            </tr>
                        </thead>
                        <tbody id="tablaConsolidadaBody">
                            {empleados.map((empleado, index) => (
                                <tr key={index}>
                                    <td>{empleado.id}</td>
                                    <td>{empleado.nombre}</td>
                                    <td>Quincena 2da - {empleado.tipoNomina}</td>
                                    <td>{parseInt(inicioFolioCheque) + index}</td>
                                    <td>{2000 + index}</td>
                                    <td>{empleado.percepciones}</td>
                                    <td>{empleado.deducciones}</td>
                                    <td>{empleado.liquido}</td>
                                    <td>{empleado.clc}</td>
                                    <td>{empleado.estadoCheque}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
