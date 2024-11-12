"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function ChequeToTransfer() {
  const [isEmployeeInfoVisible, setIsEmployeeInfoVisible] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    id: "",
    nombre: "",
    monto: "",
    curp: "",
    numCuenta: "",
    banco: "",
    titularTarjeta: "",
    fechaCambio: "",
  });
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [historial, setHistorial] = useState([]);

  const buscarEmpleado = () => {
    if (employeeData.id === "12345") {
      setEmployeeData({
        ...employeeData,
        id: "12345",
        nombre: "Juan Pérez",
        monto: "5000",
      });
      setIsEmployeeInfoVisible(true);
    } else {
      alert("ID incorrecto. Intente nuevamente.");
    }
  };

  const abrirLogin = () => {
    setIsLoginModalVisible(true);
  };

  const cerrarLogin = () => {
    setIsLoginModalVisible(false);
  };

  const procesarLogin = () => {
    const usuario = document.getElementById("loginUsuario").value;
    const password = document.getElementById("loginPassword").value;
    const nuevoMonto = document.getElementById("nuevoMonto").value;

    if (usuario === "admin" && password === "1234") {
      setEmployeeData({ ...employeeData, monto: nuevoMonto });
      cerrarLogin();
      alert("Monto actualizado correctamente.");
    } else {
      alert("Credenciales incorrectas.");
    }
  };

  const actualizarFechaPago = (event) => {
    const fechaCambio = new Date(event.target.value);
    const quincena = fechaCambio.getDate() < 15 ? "primera" : "segunda";
    const mes = fechaCambio.getMonth() + 1;
    const anio = fechaCambio.getFullYear();
    setMessage(
      `Los pagos empezarán a correr desde la ${quincena} quincena de ${mes}/${anio}.`
    );
  };

  const guardarCambios = () => {
    setHistorial([
      ...historial,
      {
        fecha: new Date().toLocaleDateString(),
        metodoAnterior: "Cheque",
        metodoNuevo: "Transferencia",
        usuario: employeeData.id,
        monto: employeeData.monto,
      },
    ]);
    alert("Cambios guardados y reflejados en el historial.");
  };

  const cancelarCambios = () => {
    setIsEmployeeInfoVisible(false);
    setEmployeeData({ ...employeeData, id: "" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}></div>
      <h2 className={styles.mainTitle}>Cambio de cheque a transferencia</h2>
      <h3 className={styles.subtitle}>Buscar empleado por ID</h3>
      <div
        className={styles.searchContainer}
        style={{ display: isEmployeeInfoVisible ? "none" : "block" }}
      >
        <div className={styles.formGroup}>
          <label>ID del empleado:</label>
          <input
            type="text"
            value={employeeData.id}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, id: e.target.value })
            }
            placeholder="Ingrese ID del empleado"
          />
          <div className={styles.buttonContainer}>
            <button className={styles.styledButton} onClick={buscarEmpleado}>
              Buscar
            </button>
          </div>
        </div>
      </div>

      {isEmployeeInfoVisible && (
        <div>
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
              <button className={styles.styledButton} onClick={abrirLogin}>
                Actualizar Monto
              </button>
            </div>
            <div className={styles.formGroup}>
              <label>Fecha de cambio:</label>
              <input type="date" onChange={actualizarFechaPago} />
            </div>
            <div className={styles.formGroup}>
              <label>CURP:</label>
              <input
                type="text"
                value={employeeData.curp}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, curp: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Número de cuenta:</label>
              <input
                type="text"
                value={employeeData.numCuenta}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    numCuenta: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Banco:</label>
              <input
                type="text"
                value={employeeData.banco}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, banco: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Titular de la tarjeta:</label>
              <input
                type="text"
                value={employeeData.titularTarjeta}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    titularTarjeta: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className={styles.formButtons}>
            <button className={styles.styledButton2} onClick={guardarCambios}>
              Guardar
            </button>
            <button className={styles.styledButton1} onClick={cancelarCambios}>
              Cancelar
            </button>
          </div>

          <div className={styles.message}>{message}</div>
          <div className={styles.buttonContainer}>
            <button
              className={styles.styledButton3}
              onClick={() => setIsHistoryModalVisible(true)}
            >
              Ver cambios realizados este mes
            </button>
          </div>
        </div>
      )}

      {/* Modal de actualización de monto */}
      {isLoginModalVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={cerrarLogin}>
              &times;
            </span>
            <h2>Actualizar Monto</h2>
            <input type="text" placeholder="Usuario" id="loginUsuario" />
            <input
              type="password"
              placeholder="Contraseña"
              id="loginPassword"
            />
            <input type="number" placeholder="Nuevo Monto" id="nuevoMonto" />
            <button className={styles.styledButton} onClick={procesarLogin}>
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Modal de historial */}
      {isHistoryModalVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span
              className={styles.closeButton}
              onClick={() => setIsHistoryModalVisible(false)}
            >
              &times;
            </span>
            <h3>Historial de cambios realizados este mes</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Método Anterior</th>
                  <th>Método Nuevo</th>
                  <th>Usuario</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((item, index) => (
                  <tr key={index}>
                    <td>{item.fecha}</td>
                    <td>{item.metodoAnterior}</td>
                    <td>{item.metodoNuevo}</td>
                    <td>{item.usuario}</td>
                    <td>{item.monto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
