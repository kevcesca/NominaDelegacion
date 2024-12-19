import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import API_BASE_URL from "../../../%Config/apiConfig";

export default function useChequeTable() {
    const [tipoNomina, setTipoNomina] = useState("");
    const [cheques, setCheques] = useState([]);
    const [loading, setLoading] = useState(false);
    const [anio, setAnio] = useState(""); // Estado existente para el año
    const [quincena, setQuincena] = useState(""); // Estado existente para la quincena
    const [fechaCompleta, setFechaCompleta] = useState(""); // Nuevo estado para la fecha completa
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const handleTipoNominaChange = (event) => setTipoNomina(event.target.value);

    const handleDateChange = ({ anio, quincena, fechaISO }) => {
        setAnio(anio);
        setQuincena(quincena);
        if (fechaISO) {
            setFechaCompleta(fechaISO); // Almacena la fecha completa en formato ISO
        }
    };

    // Obtener cheques desde la API
    const obtenerCheques = async () => {
        if (!anio || !quincena || !tipoNomina) {
            console.log("Faltan parámetros para obtener los cheques.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/NominaCtrl/Cheques`, {
                params: { 
                    anio, 
                    quincena, 
                    tipo_nomina: tipoNomina,
                    fecha: fechaCompleta || undefined,
                },
            });
            setCheques(response.data);
        } catch (error) {
            console.error("Error al obtener los cheques:", error);
        } finally {
            setLoading(false);
        }
    };

    // Refrescar manualmente los cheques (para usar con el botón de actualización)
    const refreshCheques = async () => {
        console.log("Refrescando cheques...");
        await obtenerCheques();
    };

    // Efecto para cargar cheques automáticamente cuando cambian los filtros
    useEffect(() => {
        console.log("Cargando cheques automáticamente...");
        obtenerCheques();
    }, [anio, quincena, tipoNomina, fechaCompleta]);

    const handleRowSelect = (cheque) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(cheque)
                ? prevSelected.filter((row) => row !== cheque)
                : [...prevSelected, cheque]
        );
    };

    const handleSelectAll = () => {
        setSelectedRows(selectAll ? [] : cheques);
        setSelectAll(!selectAll);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(selectedRows.length > 0 ? selectedRows : cheques);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Cheques");
        XLSX.writeFile(workbook, "cheques.xlsx");
    };

    const exportToCSV = () => {
        const worksheet = XLSX.utils.json_to_sheet(selectedRows.length > 0 ? selectedRows : cheques);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "cheques.csv";
        link.click();
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["ID Empleado", "Folio Cheque", "Estado Cheque", "Monto", "Fecha"];
        const tableRows = (selectedRows.length > 0 ? selectedRows : cheques).map((cheque) => [
            cheque.id_empleado,
            cheque.num_folio,
            cheque.estado_cheque,
            `$${cheque.monto.toFixed(2)}`,
            cheque.fecha_cheque,
        ]);

        doc.text("Cheques", 14, 15);
        doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
        doc.save("cheques.pdf");
    };

    return {
        tipoNomina,
        cheques,
        loading,
        selectedRows,
        selectAll,
        anio,
        quincena,
        fechaCompleta,
        handleTipoNominaChange,
        handleDateChange,
        handleRowSelect,
        handleSelectAll,
        exportToExcel,
        exportToCSV,
        exportToPDF,
        refreshCheques, // Exportamos refreshCheques para que pueda ser usado en el botón
    };
}
