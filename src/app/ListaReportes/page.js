// src/pages/index.jsx

'use client'

import React, { useState } from 'react';
import styles from './page.module.css';
import ReportCard from '../%Components/Card/Card';

export default function Page() {
    const [searchTerm, setSearchTerm] = useState('');
    const reportes = [
        {
            title: "AbonoPorConceptoMovimientoQuincenas",
            description: "Este reporte muestra un historial detallado de los movimientos de percepción personal durante el último año.",
            link: "/ListaReportes/AbonoPorConceptoMovimientoQuincenas"
        },
        {
            title: "REPORTE DE NÓMINA HISTÓRICO POR MONTO, TIPO DE NÓMINA Y EJERCIDO",
            description: "",
            link: "/ListaReportes/04"
        },
        {
            title: "DiferenciasLiquidoConLpad",
            description: "Visualiza un reporte histórico de nóminas organizadas por monto y tipo de nómina.",
            link: "/ListaReportes/DiferenciasLiquidoConLpad"
        },
        {
            title: "01 NominaNumerosCuentaEmpleados",
            description: "Consulta el histórico de nóminas por monto, tipo de nómina y cantidad ejercida.",
            link: "/ListaReportes/NominaNumerosCuentaEmpleados"
        },
        {
            title: "ReporteAltasBajas",
            description: "Reporte detallado de cuentas pendientes por liquidar.",
            link: "/ListaReportes/ReporteAltasBajas"
        },
        // {
        //     title: "REPORTE DE REINTEGROS POR CUENTA POR LIQUIDAR",
        //     description: "Informe de reintegros relacionados con cuentas por liquidar.",
        //     link: "/ListaReportes/ReintegrosCuentaPorLiquidar"
        // },
        {
            title: "01 TipoPagoTipoNominaPorEmpleadoQuincena",
            description: "Reporte sobre la dispersión de nómina y cuentas por liquidar.",
            link: "/ListaReportes/TipoPagoTipoNominaPorEmpleadoQuincena"
        },
        // {
        //     title: "REPORTE DE NÓMINA, CUENTA POR LIQUIDAR, PAGO POR CHEQUE",
        //     description: "Detalles de nóminas y cuentas por liquidar pagadas mediante cheque.",
        //     link: "/ListaReportes/NominaCuentaPorLiquidarPagoCheque"
        // },
        // {
        //     title: "REPORTE POR CUENTA POR LIQUIDAR CHEQUES EN TRÁNSITO",
        //     description: "Reporte de cheques en tránsito relacionados con cuentas por liquidar.",
        //     link: "/ListaReportes/CuentaPorLiquidarChequesTransito"
        // },
        // {
        //     title: "REPORTE DE NÓMINAS EXTRAORDINARIAS",
        //     description: "Informe sobre nóminas extraordinarias emitidas.",
        //     link: "/ListaReportes/NominasExtraordinarias"
        // },
        // {
        //     title: "REPORTE DE ACTAS POR RETENCIÓN DE PAGOS",
        //     description: "Registro de actas relacionadas con la retención de pagos.",
        //     link: "/ListaReportes/ActasRetencionPagos"
        // },
        // {
        //     title: "REPORTE DE CONCEPTOS NO COBRADOS Y MOTIVO DE REEMBOLSOS",
        //     description: "Informe sobre conceptos no cobrados y las razones de los reembolsos.",
        //     link: "/ListaReportes/ConceptosNoCobradosReembolsos"
        // },
        // {
        //     title: "EMISIÓN DE CHEQUES",
        //     description: "Reporte detallado de la emisión de cheques.",
        //     link: "/ListaReportes/EmisionCheques"
        // },
        // {
        //     title: "REPORTE DE LIBERACIONES",
        //     description: "Informe sobre las liberaciones de fondos o nóminas.",
        //     link: "/ListaReportes/Liberaciones"
        // },
        // {
        //     title: "REPORTE DE DEFUNCIONES",
        //     description: "Reporte de defunciones registradas.",
        //     link: "/ListaReportes/Defunciones"
        // },
        // {
        //     title: "REPORTE DE BAJAS",
        //     description: "Registro de bajas de empleados.",
        //     link: "/ListaReportes/Bajas"
        // },
        // {
        //     title: "REPORTE DE ALTAS",
        //     description: "Informe sobre altas de nuevos empleados.",
        //     link: "/ListaReportes/Altas"
        // },
        // {
        //     title: "SALDOS DIARIOS EN BANCOS",
        //     description: "Consulta los saldos diarios disponibles en bancos.",
        //     link: "/ListaReportes/SaldosDiariosBancos"
        // }
    ];
    
    const filteredReports = reportes.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <h1 className={styles.h1}>
                Lista de reportes
            </h1>
            <input
                type="text"
                placeholder="Buscar reporte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
            />
            <main className={styles.mainLista}>
                {filteredReports.map((report, index) => (
                    <ReportCard
                        key={index}
                        title={report.title}
                        description={report.description}
                        link={report.link}
                    />
                ))}
            </main>
        </>
    );
}
