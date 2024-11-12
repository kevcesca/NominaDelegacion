"use client";
import { useState, useRef } from "react";
import styles from "./page.module.css";

export default function ChequeTrans() {
  const [employeeFound, setEmployeeFound] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    id: "",
    nombre: "",
    monto: "",
    numCuenta: "",
  });
  const [message, setMessage] = useState(
    "Los pagos empezarán a correr desde la quincena indicada."
  );
  const searchInputRef = useRef();

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
    } else {
      alert("ID incorrecto. Intente nuevamente.");
    }
  };

  const handleDateChange = (e) => {
    const fechaCambio = new Date(e.target.value);
    const quincena = fechaCambio.getDate() < 15 ? "primera" : "segunda";
    const mes = fechaCambio.getMonth() + 1;
    const anio = fechaCambio.getFullYear();
    setMessage(
      `Los pagos empezarán a correr desde la ${quincena} quincena de ${mes}/${anio}.`
    );
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
              <input type="text" value={employeeData.id} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label>Nombre:</label>
              <input type="text" value={employeeData.nombre} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label>Monto:</label>
              <input type="text" value={employeeData.monto} readOnly />
              <button className={styles.styledButton}>Actualizar Monto</button>
            </div>
            <div className={styles.formGroup}>
              <label>Fecha de cambio:</label>
              <input type="date" onChange={handleDateChange} />
            </div>
            <div className={styles.formGroup}>
              <label>CURP:</label>
              <input type="text" />
            </div>
            <div className={styles.formGroup}>
              <label>Número de cuenta actual:</label>
              <input type="text" value={employeeData.numCuenta} readOnly />
            </div>
          </div>

          <div className={styles.formButtons}>
            <button className={styles.styledButton2}>Hacer cambio</button>
            <button
              className={styles.styledButton1}
              onClick={() => setEmployeeFound(false)}
            >
              Cancelar cambio
            </button>
          </div>

          <div className={styles.message}>{message}</div>
          <div className={styles.buttonContainer}>
            <button className={styles.styledButton3}>
              Ver cambios realizados este mes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
