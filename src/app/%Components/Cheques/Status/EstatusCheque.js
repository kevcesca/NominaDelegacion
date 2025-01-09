"use client";
import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import styles from "./EstatusCheque.module.css";
import API_BASE_URL from "../../../%Config/apiConfig";
import DateFilter from "../../../%Components/DateFilter/DateFilter";

const StatusCheques = () => {
    const [chequeData, setChequeData] = useState([]); // Datos originales
    const [filteredData, setFilteredData] = useState([]); // Datos filtrados
    const [selectedCheques, setSelectedCheques] = useState([]); // Registros seleccionados
    const [recordsPerPage, setRecordsPerPage] = useState(10); // Registros por página
    const [currentParams, setCurrentParams] = useState({ anio: "", quincena: "" }); // Parámetros actuales: año y quincena
    const [searchTerm, setSearchTerm] = useState("");

    // Obtener datos desde el servicio
    const fetchChequeData = async (anio, quincena) => {
        if (!anio || !quincena) {
            alert("Por favor selecciona un año y una quincena.");
            return;
        }
    
        try {
            // Nueva URL del servicio reemplazada correctamente
            const response = await fetch(
                `${API_BASE_URL}/estadoCheques?quincena=${quincena}&anio=${anio}`
            );
    
            if (response.ok) {
                const data = await response.json();
                setChequeData(data); // Guarda los datos en el estado
                setFilteredData(data); // Inicializa los datos filtrados
            } else {
                alert("Error al cargar los datos del servicio.");
            }
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            alert("No se pudo conectar con el servicio.");
        }
    };
    
    // Función para insertar nuevos datos (mantener el servicio existente)


    // Manejar cambios en el filtro de fecha y quincena
    const handleDateChange = ({ anio, quincena }) => {
        setCurrentParams({ anio, quincena });
        fetchChequeData(anio, quincena);
        //insertChequeData(anio, quincena);
    };

    const handleResetTable = () => {
        setCurrentParams({ anio: "", quincena: "" });
        setFilteredData([]);
        setSelectedCheques([]);
    };

    const handleSelectAll = (e) => {
        if (e.checked) {
            setSelectedCheques(filteredData); // Selecciona todos los datos visibles
        } else {
            setSelectedCheques([]); // Deselecciona todo
        }
    };

    const handleRowSelection = (e) => {
        setSelectedCheques(e.value);
    };

    // Actualizar estado de un cheque con fecha actual
    const updateChequeState = async (folioCheque, newState) => {
        try {
            const { anio, quincena } = currentParams;

            // Obtener fecha actual en formato YYYY-MM-DD
            const currentDate = new Date().toISOString().split("T")[0];

            const response = await fetch(
                `${API_BASE_URL}/NominaCtrl/ActualizarEstadoCheques?estadoCheque=${newState}&fecha=${currentDate}&quincena=${quincena}&folioInicial=${folioCheque}&folioFinal=${folioCheque}`,
                {
                    method: "GET", // Asegúrate de que sea POST o GET según el servicio.
                }
            );

            if (response.ok) {
                alert(`El estado del cheque ${folioCheque} se actualizó a "${newState}".`);
                // Actualiza localmente el estado del cheque
                setChequeData((prevData) =>
                    prevData.map((cheque) =>
                        cheque.folio_cheque === folioCheque
                            ? { ...cheque, estado_cheque: newState }
                            : cheque
                    )
                );
                setFilteredData((prevData) =>
                    prevData.map((cheque) =>
                        cheque.folio_cheque === folioCheque
                            ? { ...cheque, estado_cheque: newState }
                            : cheque
                    )
                );
            } else {
                alert("Error al actualizar el estado del cheque en el servidor.");
            }
        } catch (error) {
            console.error("Error al actualizar el estado del cheque:", error);
            alert("No se pudo conectar con el servicio.");
        }
    };

    // Renderizar el campo de estado como un Select
    const renderEstadoEditor = (rowData) => {
        return (
            <Select
                value={rowData.estado_cheque} // Estado actual
                onChange={(e) => updateChequeState(rowData.folio_cheque, e.target.value)}
                displayEmpty
                fullWidth
            >
                <MenuItem value="Creado">Creado</MenuItem>
                <MenuItem value="Pagado">Pagado</MenuItem>
                <MenuItem value="No Cobrado">No Cobrado</MenuItem>
                <MenuItem value="En Transito">En Transito</MenuItem>
                <MenuItem value="Cancelado">Cancelado</MenuItem>
            </Select>
        );
    };

     // Filtrar datos por término de búsqueda
     const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        if (term.trim() === "") {
            setFilteredData(chequeData); // Restaurar datos originales si el campo está vacío
        } else {
            const filtered = chequeData.filter((item) =>
                Object.values(item).some((value) =>
                    value?.toString().toLowerCase().includes(term)
                )
            );
            setFilteredData(filtered);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Reporte de Cheques", 14, 15);

        const tableRows = filteredData.map((cheque) => [
            cheque.id_empleado,
            cheque.nombre_completo,
            cheque.folio_cheque,
            cheque.monto,
            cheque.estado_cheque,
            cheque.fecha,
            cheque.quincena,
            cheque.tipo_nomina,
        ]);

        doc.autoTable({
            head: [
                [
                    "ID Empleado",
                    "Nombre Completo",
                    "Folio Cheque",
                    "Monto",
                    "Estado Cheque",
                    "Fecha",
                    "Quincena",
                    "Tipo Nómina",
                ],
            ],
            body: tableRows,
        });

        doc.save("cheques_reporte.pdf");
    };

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(filteredData);
        XLSX.utils.book_append_sheet(wb, ws, "Cheques");
        XLSX.writeFile(wb, "cheques_reporte.xlsx");
    };

    const exportToCSV = () => {
        const csvData = filteredData.map((cheque) => ({
            "ID Empleado": cheque.id_empleado,
            "Nombre Completo": cheque.nombre_completo,
            "Folio Cheque": cheque.folio_cheque,
            Monto: cheque.monto,
            "Estado Cheque": cheque.estado_cheque,
            Fecha: cheque.fecha,
            Quincena: cheque.quincena,
            "Tipo Nómina": cheque.tipo_nomina,
        }));

        const csv = [
            [
                "ID Empleado",
                "Nombre Completo",
                "Folio Cheque",
                "Monto",
                "Estado Cheque",
                "Fecha",
                "Quincena",
                "Tipo Nómina",
            ],
            ...csvData.map((item) => Object.values(item)),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "cheques_reporte.csv");
    };

    return (
        <Box className={styles.container}>
            <Typography variant="h4" gutterBottom>
                Gestión de Status de Cheques
            </Typography>



            <Box className={styles.controls}>
                <DateFilter onDateChange={handleDateChange} />

                <Button
                    className={styles.resetButton}
                    variant="outlined"
                    onClick={handleResetTable}
                >
                    Reiniciar Filtros
                </Button>

                <Select
                    className={styles.select}
                    value={recordsPerPage}
                    onChange={(e) => setRecordsPerPage(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                </Select>
            </Box>

            <Box className={styles.searchBar}>
            <TextField 
                    sx={{width:"50vw"}}
                    variant="outlined"
                    placeholder="Buscar en todas las propiedades"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </Box>

           

            <DataTable
                value={filteredData}
                paginator
                rows={recordsPerPage}
                dataKey="folio_cheque"
                responsiveLayout="scroll"
                selection={selectedCheques}
                onSelectionChange={handleRowSelection}
                header={
                    <Checkbox
                        onChange={handleSelectAll}
                        checked={
                            selectedCheques.length === filteredData.length && filteredData.length > 0
                        }
                    >
                        Seleccionar Todos
                    </Checkbox>
                }
            >
                <Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
                <Column field="id_empleado" header="ID Empleado" sortable></Column>
                <Column field="nombre_completo" header="Nombre Completo" sortable></Column>
                <Column field="folio_cheque" header="Folio Cheque" sortable></Column>
                <Column field="monto" header="Monto" sortable></Column>
                <Column
                    field="estado_cheque"
                    header="Estado"
                    body={renderEstadoEditor}
                    sortable
                ></Column>
                <Column field="fecha" header="Fecha" sortable></Column>
                <Column field="quincena" header="Quincena" sortable></Column>
                <Column field="tipo_nomina" header="Tipo Nómina" sortable></Column>
            </DataTable>

            <Typography variant="body1" sx={{ marginTop: "1rem", fontWeight: "bold" }}>
                Registros seleccionados: {selectedCheques.length}
            </Typography>
            <Box className={styles.exportButtons}>
                <Button
                    className={styles.exportButton}
                    variant="contained"
                    onClick={exportToPDF}
                >
                    Exportar a PDF
                </Button>
                <Button
                    className={styles.exportButton}
                    variant="contained"
                    onClick={exportToExcel}
                >
                    Exportar a Excel
                </Button>
                <Button
                    className={styles.exportButton}
                    variant="contained"
                    onClick={exportToCSV}
                >
                    Exportar a CSV
                </Button>
            </Box>
        </Box>
        
    );
};

export default StatusCheques;
