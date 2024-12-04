"use client";
import React, { useState } from "react";
import ProtectedView from "../../%Components/ProtectedView/ProtectedView"; // Ajusta la ruta según tu estructura
import styles from "./page.module.css";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const datosIniciales = [
  {
    id: "CLC001",
    clave: "KP123456",
    monto: "5000.00",
    evidencia: "",
    estado: "Correcto",
  },
];

const clcs = [
  { id: "CLC001", clave: "KP123456", monto: "5000.00", estado: "Correcto" },
  { id: "CLC002", clave: "KP654321", monto: "3000.00", estado: "Pendiente" },
];

const selectedRows = [0, 1]; // Se seleccionaron todas las filas

const ClcPage = () => {
  const [clcs, setClcs] = useState(datosIniciales);
  const [formData, setFormData] = useState({
    id: "",
    clave: "",
    monto: "",
    evidencia: null,
    total: 0, // Total de las claves presupuestarias
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      // Si se inserta el ID de la CLC, asignamos el monto bruto desde los valores de montosCLC
      if (name === "id" && montosCLC[value]) {
        newData.monto = montosCLC[value].toString(); // Monto bruto
      }

      return newData;
    });
  };

  const handleFileChange = (e) => {
    // Verificamos que haya un archivo seleccionado
    if (e.target.files && e.target.files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        evidencia: e.target.files[0], // Asignamos el primer archivo al campo "evidencia"
      }));
    }
  };

  const handleMontoChange = (index, e) => {
    const { value } = e.target;
    const newClaves = [...clavesPresupuestarias];
    newClaves[index] = { ...newClaves[index], monto: parseFloat(value) || 0 };

    // Calculamos el total de los montos de las claves presupuestarias
    const total = newClaves.reduce((sum, clave) => sum + (clave.monto || 0), 0);

    // Actualizamos el estado de 'total'
    setFormData((prevData) => ({
      ...prevData,
      total: total, // Solo se actualiza el total basado en los montos de las claves
    }));

    setClavesPresupuestarias(newClaves);
  };

  const agregarCLC = () => {
    const { id, clave, monto, evidencia, total } = formData;

    // Validación de que la suma de los montos de las claves sea igual al monto bruto
    if (total === parseFloat(monto) && evidencia && id) {
      const newClc = {
        id,
        clave,
        monto,
        evidencia: URL.createObjectURL(evidencia),
        estado: "Pendiente", // O el estado que desees
      };

      // Actualizar el estado correctamente
      setClcs((prevClcs) => [...prevClcs, newClc]);

      // Limpiar el formulario después de agregar el CLC
      setFormData({ id: "", clave: "", monto: "", evidencia: null, total: 0 });
    } else {
      alert(
        "El monto de las claves no es válido. Asegúrate de que el total sea igual al monto bruto."
      );
    }
  };

  const mostrarDetalle = (clc) => {
    setDetalle({
      id: clc.id,
      clave: clc.clave,
      monto: clc.monto,
      motivo: "Compra de Material",
      formaPago: "Transferencia",
      pagadoA: "Proveedor ABC",
      descripcion: "Material de oficina",
      importeTotal: "1500.00",
      fecha: "2024-11-07",
    });
  };

  const exportTo = (format) => {
    alert(`Exportando en formato ${format}`);

  };

  const [clavesPresupuestarias, setClavesPresupuestarias] = useState([{}]);
  const [numClaves, setNumClaves] = useState(1); // Número de claves presupuestarias
  const [isCLCValid, setIsCLCValid] = useState(true); // Estado de la validación de la CLC
  const [detalle, setDetalle] = useState(null); // Inicializa detalle como null
  console.log("FormData al agregar CLC:", formData);

  const montosCLC = {
    "02 CD 02 100176": 16300,
    "02 CD 02 100177": 8200,
    "02 CD 02 100178": 5400,
  };

  const [selectAll, setSelectAll] = useState(false); // Para el checkbox global
  const [selectedRows, setSelectedRows] = useState([]); // Para las filas seleccionadas

  // Maneja el cambio del checkbox global (select all)
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Si se marca el "select all", seleccionamos todas las filas
      setSelectedRows(clcs.map((_, index) => index));
    } else {
      // Si se desmarca el "select all", desmarcamos todas las filas
      setSelectedRows([]);
    }
  };

  // Maneja el cambio de una fila específica
  const handleSelectRow = (index) => {
    const newSelectedRows = [...selectedRows];
    if (newSelectedRows.includes(index)) {
      // Si la fila ya está seleccionada, la desmarcamos
      const filteredRows = newSelectedRows.filter((row) => row !== index);
      setSelectedRows(filteredRows);
    } else {
      // Si no está seleccionada, la seleccionamos
      newSelectedRows.push(index);
      setSelectedRows(newSelectedRows);
    }
  };

  const handleClaveChange = (index, e) => {
    const { name, value } = e.target;
    const newClaves = [...clavesPresupuestarias];
    newClaves[index] = { ...newClaves[index], [name]: value };

    // Si se agrega una clave, habilitamos el monto
    if (newClaves[index].clave) {
      setIsCLCValid(true); // Habilitamos la CLC si se está ingresando correctamente
    } else {
      setIsCLCValid(false); // Si no hay clave, no se puede registrar
    }

    setClavesPresupuestarias(newClaves);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const selectedClcs = selectedRows.map((index) => clcs[index]); // Filtra las filas seleccionadas

    if (selectedClcs.length === 0) {
      alert("Por favor, selecciona al menos una fila para exportar.");
      return;
    }

    doc.text("Reporte de Verificación de CLC", 20, 10);
    let y = 20;

    selectedClcs.forEach((clc, index) => {
      doc.text('CLC #${index + 1}', 20, y);
      doc.text('ID: ${clc.id}', 20, y + 10);
      doc.text('Clave: ${clc.clave}', 20, y + 20);
      doc.text('Monto: ${clc.monto}', 20, y + 30);
      doc.text('Estado: ${clc.estado}', 20, y + 40);
      y += 50;
    });

    doc.save("reporte_clcs.pdf");
  };

  const exportToExcel = () => {
    const selectedClcs = selectedRows.map((index) => clcs[index]); // Filtra las filas seleccionadas

    if (selectedClcs.length === 0) {
      alert("Por favor, selecciona al menos una fila para exportar.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(selectedClcs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CLCs");
    XLSX.writeFile(wb, "reporte_clcs.xlsx");
  };

  const exportToCSV = () => {
    const selectedClcs = selectedRows.map((index) => clcs[index]); // Filtra las filas seleccionadas

    if (selectedClcs.length === 0) {
      alert("Por favor, selecciona al menos una fila para exportar.");
      return;
    }

    const csvContent = [
      ["ID", "Clave", "Monto", "Estado"], // Cabecera
      ...selectedClcs.map((clc) => [clc.id, clc.clave, clc.monto, clc.estado]), // Datos
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "reporte_clcs.csv");
    link.click();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>Verificación de CLC </h2>

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
        <label>Cantidad de claves presupuestarias:</label>
        <input
          type="text"
          min="1"
          value={numClaves}
          onChange={(e) => {
            const newNumClaves = parseInt(e.target.value, 10) || 0;
            setNumClaves(newNumClaves);
            setClavesPresupuestarias(Array(newNumClaves).fill({}));
          }}
          placeholder="Introduce el número de claves presupuestarias"
        />
      </div>

      {Array.from({ length: numClaves }).map((_, index) => (
        <div key={index} className={styles.row}>
          {/* Columna de clave presupuestaria */}
          <div className={styles.column}>
            <label>Clave presupuestaria {index + 1}:</label>
            <input
              type="text"
              name="clave"
              value={clavesPresupuestarias[index]?.clave || ""}
              onChange={(e) => handleClaveChange(index, e)}
              placeholder={`Introduce la clave presupuestaria ${index + 1}`}

            />
          </div>
          {/* Columna de monto (habilitado solo si hay una clave) */}
          <div className={styles.column}>
            <label>Monto:</label>
            <input
              type="text"
              name="monto"
              value={clavesPresupuestarias[index]?.monto || ""}
              onChange={(e) => handleMontoChange(index, e)}
              placeholder={'Introduce el monto de la clave ${index + 1}'}
              disabled={!clavesPresupuestarias[index]?.clave} // Deshabilitado hasta que haya una clave
            />
          </div>
        </div>
      ))}

      <div className={styles.row}>
        {/* Columna de Monto bruto */}
        <div className={styles.column}>
          <label>Monto bruto:</label>
          <input
            type="text"
            name="montoBruto"
            value={formData.monto || ""} // Solo el monto bruto se asigna aquí
            readOnly
            placeholder="El monto bruto será calculado al introducir el ID de CLC"
          />
        </div>

        {/* Columna de Total */}
        <div className={styles.column}>
          <label>Total:</label>
          <input
            type="text"
            name="total"
            value={formData.total || ""} // El total de las claves presupuestarias se muestra aquí
            readOnly
            placeholder="Total de las claves presupuestarias"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Evidencia de la CLC (archivo PDF):</label>
        <input
          type="file"
          onChange={handleFileChange} // Aquí llamamos la función
          accept="application/pdf" // Solo permite archivos PDF
        />
      </div>
      <button
        className={styles.btn}
        onClick={agregarCLC} // Llama a la función de agregar CLC
        disabled={!isCLCValid || formData.total !== parseFloat(formData.monto)} // Deshabilitado si no es válido
      >
        Agregar CLC
      </button>

      <h2 className={styles.h2}>Reporte de Verificación de CLC</h2>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className={styles.th}>ID CLC</th>
            <th className={styles.th}>Clave o Claves presupuestarias</th>
            <th className={styles.th}>Monto bruto</th>
            <th className={styles.th}>Evidencia</th>
            <th className={styles.th}>Más detalles</th>
          </tr>
        </thead>
        <tbody>
          {clcs.map((clc, index) => (
            <tr key={index}>
              <td className={styles.td}>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => handleSelectRow(index)}
                />
              </td>
              <td className={styles.td}>{clc.id}</td>
              <td className={styles.td}>{clc.clave}</td>
              <td className={styles.td}>{clc.monto}</td>
              <td className={styles.td}>
                <a
                  href={clc.evidencia}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver PDF
                </a>
              </td>
              <td className={styles.td}>
                <button
                  className={styles.btn}
                  onClick={() => mostrarDetalle(clc)}
                >
                  Desglosar CLC
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.iconosExportacion}>
        <button className={styles.btnExportar} onClick={() => exportToPDF()}>
          Exportar a PDF
        </button>
        <button className={styles.btnExportar} onClick={() => exportToExcel()}>
          Exportar a Excel
        </button>
        <button className={styles.btnExportar} onClick={() => exportToCSV()}>
          Exportar a CSV
        </button>
      </div>

      {detalle && (
        <div className={styles.detalleClc}>
          <h2 className={styles.h2}>Gestión de CLC - Distribución de Dinero</h2>
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

const ProtectedClcPage = () => <ClcPage />;

export default ProtectedClcPage;
