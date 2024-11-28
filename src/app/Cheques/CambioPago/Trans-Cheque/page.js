"use client";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

export default function ChequeTrans() {
  const [employeeFound, setEmployeeFound] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    id: "",
    nombre: "",
    monto: "",
    numCuenta: "",
  });
  const [fechaCambio, setFechaCambio] = useState("");
  const [message, setMessage] = useState(
    "Los pagos empezarán a correr desde la quincena indicada."
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [rfc, setRfc] = useState("");
  const [changesTable, setChangesTable] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const searchInputRef = useRef();

  // Datos simulados para la tabla
  const empleados = [
    {
      id: "12345",
      nombre: "Juan Pérez",
      sueldo: "5000",
      fechaCambio: "2024-11-27",
      cuentaAntigua: "5849267258935147",
      esCheque: true,
      fechaPagos: "2024-12-01",
    },
    {
      id: "54321",
      nombre: "Ana García",
      sueldo: "4500",
      fechaCambio: "2024-11-20",
      cuentaAntigua: "4789261234567890",
      esCheque: true,
      fechaPagos: "2024-12-01",
    },
  ];

  useEffect(() => {
    const fechaActual = new Date();
    const fechaISO = fechaActual.toISOString().slice(0, 10);
    setFechaCambio(fechaISO);

    const quincena = fechaActual.getDate() < 15 ? "primera" : "segunda";
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    setMessage(
      `Los pagos empezarán a correr desde la ${quincena} quincena de ${mes}/${anio}.`
    );
  }, []);

  const buscarEmpleado = () => {
    const id = searchInputRef.current.value;
    if (id === "12345") {
      setEmployeeData({
        id,
        nombre: "Juan Pérez",
        monto: "5000",
        numCuenta: "5849267258935147",
      });
      setEmployeeFound(true);
    } else if (id === "54321") {
      setEmployeeData({
        id,
        nombre: "Ana García",
        monto: "4500",
        numCuenta: "4789261234567890",
      });
      setEmployeeFound(true);
    } else {
      alert("ID incorrecto. Intente nuevamente.");
    }
  };

  const handleDateChange = (e) => {
    const nuevaFecha = e.target.value;
    setFechaCambio(nuevaFecha);

    const fechaCambio = new Date(nuevaFecha);
    const quincena = fechaCambio.getDate() < 15 ? "primera" : "segunda";
    const mes = fechaCambio.getMonth() + 1;
    const anio = fechaCambio.getFullYear();
    setMessage(
      `Los pagos empezarán a correr desde la ${quincena} quincena de ${mes}/${anio}.`
    );
  };

  const validarCampos = () => {
    const errores = {};
    if (!employeeData.id) errores.id = true;
    if (!employeeData.nombre) errores.nombre = true;
    if (!employeeData.monto) errores.monto = true;
    if (!fechaCambio) errores.fechaCambio = true;
    if (!employeeData.numCuenta) errores.numCuenta = true;

    setFieldErrors(errores);
    return Object.keys(errores).length === 0;
  };

  const handleHacerCambio = () => {
    if (validarCampos()) {
      setShowModal(true); // Mostrar modal si los campos son válidos
    }
  };

  const confirmarCambio = () => {
    if (rfc === "XAXX010101000") {
      alert("¡Cambios guardados correctamente!");
      setShowModal(false);
      setEmployeeFound(false); // Limpiar formulario y datos
      setFieldErrors({});
    } else {
      alert("RFC incorrecto. Inténtelo nuevamente.");
    }
  };

  const handleCancelarCambio = () => {
    setEmployeeFound(false); // Cerrar formulario actual
    setFieldErrors({}); // Limpiar errores
  };

  const verCambiosMes = () => {
    setChangesTable(true); // Mostrar tabla de cambios
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.length === empleados.length) {
      setSelectedEmployees([]); // Deseleccionar todos
    } else {
      setSelectedEmployees(empleados.map((emp) => emp.id)); // Seleccionar todos
    }
  };

  const toggleSelectEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleExportPDF = () => {
    console.log("Exportar a PDF");
    // Agrega aquí la lógica para exportar a PDF
  };

  const handleExportExcel = () => {
    console.log("Exportar a Excel");
    // Agrega aquí la lógica para exportar a Excel
  };

  const handleExportCSV = () => {
    console.log("Exportar a CSV");
    // Agrega aquí la lógica para exportar a CSV
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.mainTitle}>Cambio de transferencia a cheque</h2>
      </div>

      <h3>Buscar empleado por ID</h3>
      <div className={styles.searchContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="curpSearch">ID del empleado:</label>
          <input
            type="text"
            id="curpSearch"
            ref={searchInputRef}
            placeholder="Ingrese ID del empleado"
            onKeyDown={(e) => e.key === "Enter" && buscarEmpleado()}
          />
          <div className={styles.buttonContainer}>
            <button className={styles.styledButton} onClick={buscarEmpleado}>
              Buscar
            </button>
          </div>
        </div>
      </div>

      {employeeFound && (
        <div id="employeeInfo">
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>ID Empleado:</label>
              <input
                type="text"
                value={employeeData.id}
                readOnly
                style={{
                  border: fieldErrors.id ? "2px solid red" : undefined,
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nombre:</label>
              <input
                type="text"
                value={employeeData.nombre}
                readOnly
                style={{
                  border: fieldErrors.nombre ? "2px solid red" : undefined,
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Monto:</label>
              <input
                type="text"
                value={employeeData.monto}
                readOnly
                style={{
                  border: fieldErrors.monto ? "2px solid red" : undefined,
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Fecha de cambio:</label>
              <input
                type="date"
                value={fechaCambio}
                onChange={handleDateChange}
                style={{
                  border: fieldErrors.fechaCambio ? "2px solid red" : undefined,
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Número de cuenta actual:</label>
              <input
                type="text"
                value={employeeData.numCuenta}
                readOnly
                style={{
                  border: fieldErrors.numCuenta ? "2px solid red" : undefined,
                }}
              />
            </div>
          </div>

          <div className={styles.formButtons}>
            <button
              className={styles.styledButton2}
              onClick={handleHacerCambio}
            >
              Hacer cambio
            </button>
            <button
              className={styles.styledButton1}
              onClick={handleCancelarCambio}
            >
              Cancelar cambio
            </button>
          </div>

          <div className={styles.message}>{message}</div>
          <div className={styles.buttonContainer}>
            <button className={styles.styledButton3} onClick={verCambiosMes}>
              Ver cambios realizados este mes
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Confirmar cambios</h3>
            <p>Ingrese su RFC para confirmar los cambios:</p>
            <input
              type="text"
              value={rfc}
              onChange={(e) => setRfc(e.target.value)}
              placeholder="RFC"
            />
            <div className={styles.modalButtons}>
              <button
                className={styles.styledButton2}
                onClick={confirmarCambio}
              >
                Confirmar
              </button>
              <button
                className={styles.styledButton1}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {changesTable && (
        <div className={styles.tableContainer}>
          <h3>Cambios realizados este mes</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === empleados.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>ID Empleado</th>
                <th>Nombre</th>
                <th>Sueldo</th>
                <th>Fecha de cambio</th>
                <th>Número de cuenta antigua</th>
                <th>¿Se pagará con cheque?</th>
                <th>Fecha de pagos</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => toggleSelectEmployee(emp.id)}
                    />
                  </td>
                  <td>{emp.id}</td>
                  <td>{emp.nombre}</td>
                  <td>{emp.sueldo}</td>
                  <td>{emp.fechaCambio}</td>
                  <td>{emp.cuentaAntigua || "N/A"}</td>
                  <td>{emp.esCheque ? "Sí" : "No"}</td>
                  <td>{emp.fechaPagos}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.exportButtons}>
            <button className={styles.styledButton1} onClick={handleExportPDF}>
              Exportar a PDF
            </button>
            <button
              className={styles.styledButton2}
              onClick={handleExportExcel}
            >
              Exportar a Excel
            </button>
            <button className={styles.styledButton3} onClick={handleExportCSV}>
              Exportar a CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
