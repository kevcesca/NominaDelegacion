"use client";
import React, { useState, useRef, useEffect } from "react"; // Importar useEffect
import { Box, Button, IconButton } from "@mui/material";
import useChequeTable from "./useChequeTable";
import ChequeFilterSection from "./ChequeFilterSection";
import ChequeSearchBar from "./ChequeSearchBar";
import ReusableTable from "../../ReusableTable/ReusableTable"; // Importar ReusableTable
import RefreshIcon from '@mui/icons-material/Refresh';
import { Toast } from 'primereact/toast'; // Importar Toast de PrimeReact

export default function ChequeTable() {
    const {
        tipoNomina,
        cheques,
        setCheques,
        fetchCheques,
        loading,
        anio,
        quincena,
        fechaCompleta,
        handleTipoNominaChange,
        handleDateChange,
        updateCheque // Asegúrate de que esta función esté en useChequeTable
    } = useChequeTable();

    const toast = useRef(null);

    const [searchTerm, setSearchTerm] = useState("");

    // Definir las columnas para ReusableTable
    const columns = [
        { label: "ID Empleado", accessor: "id_empleado" },
        { label: "Nombre", accessor: "nombre" },
        { label: "Tipo de Nomina", accessor: "tipo_nomina" },
        { label: "Fecha Cheque", accessor: "fecha_cheque" },
        { label: "Monto", accessor: "monto" },
        { label: "Estado Cheque", accessor: "estado_cheque" },
        { label: "Quincena", accessor: "quincena" },
        { label: "Fecha", accessor: "fecha" },
        { label: "Tipo de Pago", accessor: "tipo_pago" },
        { label: "Num Folio", accessor: "num_folio" },
        { label: "Descripción", accessor: "descripcion_nomina" }
    ];

    // Filtrar los cheques - esto podría ir dentro de un useMemo si es costoso
    const filteredCheques = cheques.filter((cheque) =>
        columns.some((col) =>
            (cheque[col.accessor] ?? "")
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
    );

    // Llamar a fetchCheques solo cuando cambian los filtros relevantes
    useEffect(() => {
        if (anio && quincena && tipoNomina) {
            fetchCheques();
        }
    }, [anio, quincena, tipoNomina, fechaCompleta]);

    // Función para refrescar los cheques
    const handleRefreshCheques = () => {
        fetchCheques();
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Toast ref={toast} />
            {/* Sección de filtros */}
            <ChequeFilterSection
                tipoNomina={tipoNomina}
                handleTipoNominaChange={handleTipoNominaChange}
                handleDateChange={handleDateChange}
                quincena={quincena}
                fechaCompleta={fechaCompleta}
                anio={anio}
            />

            {/* Tabla de cheques usando ReusableTable */}
            <ReusableTable
                columns={columns}
                fetchData={fetchCheques}
                data={filteredCheques}
            />

            <Button
                color="primary"
                variant="contained"
                onClick={() => (window.location.href = "/Cheques/Poliza")}
                sx={{ marginTop: "2rem" }}
            >
                Visualizar Pólizas
            </Button>
        </Box>
    );
}