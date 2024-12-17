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

    // Modificación: Manejar el cambio de fecha completa sin afectar anio y quincena
    const handleDateChange = ({ anio, quincena, fechaISO }) => {
        setAnio(anio);
        setQuincena(quincena);
        if (fechaISO) {
            setFechaCompleta(fechaISO); // Almacena la fecha completa en formato ISO
        }
    };

    // Modificación: Incluir fechaCompleta como parámetro opcional
    const obtenerCheques = async () => {
        if (!anio || !quincena || !tipoNomina) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/NominaCtrl/Cheques`, {
                params: { 
                    anio, 
                    quincena, 
                    tipo_nomina: tipoNomina,
                    fecha: fechaCompleta || undefined // Enviar fecha completa si existe
                },
            });
            setCheques(response.data);
            setSelectedRows([]);
            setSelectAll(false);
        } catch (error) {
            console.error("Error al obtener los cheques:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (anio && quincena && tipoNomina) {
            obtenerCheques();
        }
    }, [anio, quincena, tipoNomina, fechaCompleta]); // Incluimos fechaCompleta como dependencia

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
        const worksheet = XLSX.utils.json_to_sheet(selectedRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Cheques");
        XLSX.writeFile(workbook, "cheques.xlsx");
    };

    const exportToCSV = () => {
        const worksheet = XLSX.utils.json_to_sheet(selectedRows);
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
        const tableRows = selectedRows.map((cheque) => [
            cheque.id_empleado,
            cheque.num_folio,
            cheque.estado_cheque,
            `$${cheque.monto.toFixed(2)}`,
            cheque.fecha_cheque,
        ]);

        doc.text("Cheques Seleccionados", 14, 15);
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
        fechaCompleta, // Exportamos fechaCompleta para su uso
        handleTipoNominaChange,
        handleDateChange,
        handleRowSelect,
        handleSelectAll,
        exportToExcel,
        exportToCSV,
        exportToPDF,
    };
}
