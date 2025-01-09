'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import DynamicTable from '../../%Components/ReporteTable/ReportTable';  // Asegúrate de que la ruta es correcta
import { ReporteService } from '../../%Components/ReporteTable/ReporteService';
import styles from './page.module.css';

const formFields = {
    "HISTÓRICO DE MOVIMIENTOS DE PERCEPCIÓN DE PERSONAL": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO", "NO. DE REGISTRO", "FECHA DE PAGO"],
    "HISTÓRICO DE MOVIMIENTOS DE PERCEPCIÓN DE PERSONAL POR TIPO DE NÓMINA": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO", "NO. DE REGISTRO", "FECHA DE PAGO"],
    "REPORTE DE NÓMINA HISTÓRICO POR MONTO, TIPO DE NÓMINA": ["REGISTRO", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO DE CLC", "PAGO DE INICIO DE PAGO"],
    "REPORTE DE NÓMINA HISTÓRICO POR MONTO, TIPO DE NOMINA Y EJERCIDO": ["REGISTRO", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO DE CLC", "PAGO DE INICIO DE PAGO", "MONTO PAGADO", "PENDIENTE POR PAGAR"],
    "REPORTE POR CUENTA POR LIQUIDAR": ["REGISTRO", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "NO. DE CLC", "MONTO DE CLC"],
    "REPORTE DE REINTEGROS POR CUENTA POR LIQUIDAR": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO POR REEMBOLSAR", "CONCEPTO DE REINTEGRO", "FECHA DE PAGO DE REEMBOLSO"],
    "REPORTE DE NOMINA, CUENTA POR LIQUIDAR, DISPERSIÓN": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO", "NO. DE REGISTRO", "FECHA DE PAGO", "NO. DE REGISTRO", "FECHA DE PAGO"],
    "REPORTE DE NOMINA, CUENTA POR LIQUIDAR, PAGO POR CHEQUE": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO", "NO. DE REGISTRO", "FECHA DE PAGO"],
    "REPORTE POR CUENTA POR LIQUIDAR CHEQUES EN TRÁNSITO": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO", "NO. DE REGISTRO", "FECHA DEVOLUCION (SI EXISTIERA EL CASO)", "CHEQUE POR REPOSICIÓN"],
    "REPORTE DE NÓMINAS EXTRAORDINARIAS": ["REGISTRO", "NOMINA EXTRAORDINARIA", "CLC DE LA NOMINA GENERADA", "MONTO DE CLC"],
    "REPORTE DE ACTAS POR RETENCIÓN DE PAGOS": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "MOTIVO DE RETENCIÓN", "SOPORTE DOCUMENTAL"],
    "REPORTE DE CONCEPTOS NO COBRADOS Y MOTIVO DE REEMBOLSOS": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO", "MOTIVO DE REEMBOLSO", "FECHA DE REEMBOLSO"],
    "EMISIÓN DE CHEQUES": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "NO. DE CHEQUE"],
    "REPORTE DE LIBERACIONES": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "CLC DE LA NOMINA GENERADA", "PERIODO", "MONTO", "PAGO RETENIDO", "SOPORTE DOCUMENTAL DE RETENCIÓN", "FECHA DE PAGO LIBERACIÓN", "SOPORTE DOCUMENTAL DE LIBERACIÓN"],
    "REPORTE DE DEFUNCIONES": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "SOPORTE DOCUMENTAL DE RETENCIÓN"],
    "REPORTE DE BAJAS": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "ÚLTIMA QUINCENA COBRADA", "QUINCENA QUE NO APARECE EN REGISTROS", "SOPORTE DOCUMENTAL (SI FUERA EL CASO)"],
    "REPORTE DE ALTAS": ["REGISTRO", "NO. EMPLEADO", "NOMBRE", "TIPO DE NOMINA", "PRIMER QNA EN LA QUE APARECE EL EMPLEADO", "SOPORTE DOCUMENTAL (SI FUERA EL CASO)"],
    "SALDOS DIARIOS EN BANCOS": ["REGISTRO", "DÍA", "SALDO INICIAL"],
};

const CargarDatos = () => {
    const [tableData, setTableData] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const pathname = usePathname();

    // Extraer el tipo de reporte desde la URL y convertirlo a mayúsculas
    const reportType = pathname.split('/').pop().replace(/-/g, ' ').toUpperCase();

    useEffect(() => {
        const fetchData = async () => {
            if (reportType && formFields[reportType]) {
                try {
                    const data = await ReporteService.getData(reportType);
                    setTableData(data);
                    setTableColumns(formFields[reportType] || []);
                } catch (error) {
                    console.error('Error al cargar los datos del reporte:', error);
                }
            } else {
                console.error('Tipo de reporte no encontrado:', reportType);
            }
        };

        fetchData();
    }, [reportType]);

    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Reportes: {reportType}</h1>
            {tableData.length > 0 ? (
                <DynamicTable data={tableData} columns={tableColumns} />
            ) : (
                <p>Cargando datos del reporte...</p>
            )}
        </main>
    );
};

export default CargarDatos;

