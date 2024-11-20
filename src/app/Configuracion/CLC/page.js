'use client';
import React, { useState } from 'react';
import ProtectedView from "../../%Components/ProtectedView/ProtectedView"; // Ajusta la ruta según tu estructura
import styles from './page.module.css';

const datosIniciales = [
    { id: 'CLC001', clave: 'KP123456', monto: '5000.00', evidencia: '', estado: 'Correcto' },
];

const ClcPage = () => {
    const [clcs, setClcs] = useState(datosIniciales);
    const [detalle, setDetalle] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        clave: '',
        monto: '',
        evidencia: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            evidencia: e.target.files[0],
        }));
    };

    const agregarCLC = () => {
        const { id, clave, monto, evidencia } = formData;
        if (id && clave && monto && evidencia) {
            const newClc = {
                id,
                clave,
                monto,
                evidencia: URL.createObjectURL(evidencia),
                estado: 'Pendiente',
            };
            setClcs([newClc, ...clcs]);
            setFormData({ id: '', clave: '', monto: '', evidencia: null });
        } else {
            alert("Por favor, completa todos los campos y sube un archivo PDF.");
        }
    };

    const mostrarDetalle = (clc) => {
        setDetalle({
            id: clc.id,
            clave: clc.clave,
            monto: clc.monto,
            motivo: 'Compra de Material',
            formaPago: 'Transferencia',
            pagadoA: 'Proveedor ABC',
            descripcion: 'Material de oficina',
            importeTotal: '1500.00',
            fecha: '2024-11-07'
        });
    };

    const exportTo = (format) => {
        alert(`Exportando en formato ${format}`);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.h2}>Verificación de CLC</h2>

            <div className={styles.formGroup}>
                <label>Número de identificación de la CLC:</label>
                <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="Introduce el número de identificación de la CLC"
                />
            </div>
            <div className={styles.formGroup}>
                <label>Clave presupuestaria:</label>
                <input
                    type="text"
                    name="clave"
                    value={formData.clave}
                    onChange={handleInputChange}
                    placeholder="Introduce la clave presupuestaria"
                />
            </div>
            <div className={styles.formGroup}>
                <label>Monto bruto:</label>
                <input
                    type="text"
                    name="monto"
                    value={formData.monto}
                    onChange={handleInputChange}
                    placeholder="Introduce el monto bruto"
                />
            </div>
            <div className={styles.formGroup}>
                <label>Evidencia de la CLC (archivo PDF):</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="application/pdf"
                />
            </div>
            <button className={styles.btn} onClick={agregarCLC}>Agregar CLC</button>

            <h2 className={styles.h2}>Reporte de Verificación de CLC</h2>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tr}>
                        <th className={styles.th}>ID CLC</th>
                        <th className={styles.th}>Clave presupuestaria</th>
                        <th className={styles.th}>Monto bruto</th>
                        <th className={styles.th}>Evidencia</th>
                        <th className={styles.th}>Estado</th>
                        <th className={styles.th}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {clcs.map((clc, index) => (
                        <tr key={index}>
                            <td className={styles.td}>{clc.id}</td>
                            <td className={styles.td}>{clc.clave}</td>
                            <td className={styles.td}>{clc.monto}</td>
                            <td className={styles.td}><a href={clc.evidencia} target="_blank" rel="noopener noreferrer">Ver PDF</a></td>
                            <td className={styles.td}>
                                <select
                                    value={clc.estado}
                                    onChange={(e) => {
                                        const updatedClcs = [...clcs];
                                        updatedClcs[index].estado = e.target.value;
                                        setClcs(updatedClcs);
                                    }}
                                >
                                    <option value="Correcto">Correcto</option>
                                    <option value="Pendiente">Pendiente</option>
                                </select>
                            </td>
                            <td className={styles.td}>
                                <button className={styles.btn} onClick={() => mostrarDetalle(clc)}>Desglosar tabla</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {detalle && (
                <div className={styles.detalleClc}>
                    <h2 className={styles.h2}>Gestión de CLC - Distribución de Dinero</h2>
                    <div className={styles.iconosExportacion}>
                        <div className={styles.iconoExportacion}><a href="#" onClick={() => exportTo('pdf')}><img src="/pdf.png" alt="PDF" /></a></div>
                        <div className={styles.iconoExportacion}><a href="#" onClick={() => exportTo('excel')}><img src="/excel.png" alt="Excel" /></a></div>
                        <div className={styles.iconoExportacion}><a href="#" onClick={() => exportTo('csv')}><img src="/csv.png" alt="CSV" /></a></div>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tr}>
                                <th className={styles.th}>Fecha</th>
                                <th className={styles.th}>Clave presupuestaria</th>
                                <th className={styles.th}>CLC correspondiente</th>
                                <th className={styles.th}>Motivo</th>
                                <th className={styles.th}>Forma de Pago</th>
                                <th className={styles.th}>Pagado a</th>
                                <th className={styles.th}>Descripción</th>
                                <th className={styles.th}>Importe Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={styles.tr}>
                                <td className={styles.td}>{detalle.fecha}</td>
                                <td className={styles.td}>{detalle.clave}</td>
                                <td className={styles.td}>{detalle.id}</td>
                                <td className={styles.td}>{detalle.motivo}</td>
                                <td className={styles.td}>{detalle.formaPago}</td>
                                <td className={styles.td}>{detalle.pagadoA}</td>
                                <td className={styles.td}>{detalle.descripcion}</td>
                                <td className={styles.td}>{detalle.importeTotal}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const ProtectedClcPage = () => (
    <ProtectedView requiredPermissions={["CLC", "Acceso_total"]}>
        <ClcPage />
    </ProtectedView>
);

export default ProtectedClcPage;
