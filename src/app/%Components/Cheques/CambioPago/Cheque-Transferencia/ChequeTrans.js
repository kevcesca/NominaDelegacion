"use client";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from "@mui/material";
import ReusableTable3 from "../../../../%Components/ReusableTable3"; // Cambiado a ReusableTable3
import API_BASE_URL from "../../../../%Config/apiConfig";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./ChequeTrans.module.css";

const ChequeTrans = () => {
  const [employeeFound, setEmployeeFound] = useState(false); // Control de formulario
  const [employeeData, setEmployeeData] = useState({
    id: "",
    nombre: "",
    monto: "",
    numCuenta: "",
    banco: "",
    titular_cuenta: "",
  });
  const [fechaCambio, setFechaCambio] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // Modal de validación RFC
  const [rfc, setRfc] = useState(""); // RFC del usuario
  const [changesModalOpen, setChangesModalOpen] = useState(false); // Modal de "Ver cambios realizados"
  const searchInputRef = useRef();
  const [warningOpen, setWarningOpen] = useState(false); // Advertencia si ya es "Transferencia"

  useEffect(() => {
    const fechaActual = new Date().toISOString().slice(0, 10);
    setFechaCambio(fechaActual);
  }, []);

  // Función para buscar empleado
  const buscarEmpleado = async () => {
    const id = searchInputRef.current.value;
    if (!id) {
      alert("Por favor, ingrese un ID válido.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chequeATransferencia?id_empleado=${id}&quincena=03`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const empleado = data[0];
          setEmployeeData({
            id: empleado.id_empleado,
            nombre: empleado.nombre_completo,
            monto: empleado.monto,
            tipoPagoActual: empleado.tipo_pago_actual,
            numCuenta: "",
            banco: "",
            titular_cuenta: "",
          });
          setEmployeeFound(true);
        } else {
          alert("El ID del empleado no existe.");
          setEmployeeFound(false);
        }
      } else {
        alert("Error al buscar el empleado. Intente más tarde.");
      }
    } catch (error) {
      console.error("Error al buscar el empleado:", error);
      alert("Error al buscar el empleado.");
    }
  };

  const handleHacerCambio = () => {
    if (!employeeData.id) {
      alert("Debe buscar un empleado antes de realizar el cambio.");
      return;
    }

    if (employeeData.tipoPagoActual === "Transferencia") {
      setWarningOpen(true);
      return;
    }

    if (employeeData.numCuenta.length !== 18) {
      alert("La cuenta CLABE debe tener exactamente 18 dígitos.");
      return;
    }

    setModalOpen(true);
  };

  const validarRFC = async () => {
    if (!rfc.trim()) {
      alert("Ingrese un RFC válido.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/validacionIdentidad?id_legal=${rfc}&id_empleado=${employeeData.id}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data[0]?.mensaje === "Es correcto") {
          alert("RFC validado correctamente. Ahora se procederá con el cambio.");

          await actualizarTipoPago();
          setModalOpen(false);
          await fetchChangesData();

          // Limpiar formulario al confirmar RFC
          cancelarCambio();
        } else {
          alert("El RFC ingresado no es válido.");
        }
      } else {
        alert("Error al validar el RFC. Intente más tarde.");
      }
    } catch (error) {
      console.error("Error al validar el RFC:", error);
      alert("Error al validar el RFC.");
    }
  };

  const actualizarTipoPago = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/actualizarTipoPago?tipoPagoActual=Transferencia&referencia=${employeeData.numCuenta}&cambio=true&autorizadoPor=${rfc}&idEmpleado=${employeeData.id}&banco=${employeeData.banco}&titular=${employeeData.titular_cuenta}`,
        { method: "GET" }
      );

      if (response.ok) {
        alert("¡El cambio fue realizado exitosamente!");
        setModalOpen(false);
      } else {
        alert("Error al actualizar el tipo de pago. Intente más tarde.");
      }
    } catch (error) {
      console.error("Error al actualizar el tipo de pago:", error);
      alert("Error al realizar el cambio.");
    }
  };

  const cancelarCambio = () => {
    setEmployeeData({ id: "", nombre: "", monto: "", numCuenta: "", banco: "", titular_cuenta: "" });
    setEmployeeFound(false);
    setRfc("");
    alert("El formulario ha sido limpiado.");
  };

  const fetchChangesData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/cambiosTipoPago?tipo_pago_anterior=Cheque&tipo_pago_actual=Transferencia&cambio=true&quincena=03`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los cambios.");
      }
      const data = await response.json();

      return data.map((row) => ({
        id_empleado: row.id_empleado || "Sin ID",
        nombre_completo: row.nombre_completo || "Sin nombre",
        salario: row.salario || "Sin salario",
        fecha_cambio: row.fecha_cambio || "Sin fecha",
        tipo_pago_anterior: row.tipo_pago_anterior || "Sin dato",
        tipo_pago_actual: row.tipo_pago_actual || "Sin dato",
        referencia: row.referencia || "Sin número de cuenta",
        banco: row.Banco || "Sin banco",
        titular_cuenta: row.titular_cuenta || "Sin titular",
      }));
    } catch (error) {
      console.error("Error al obtener los cambios:", error);
      alert("Error al cargar los cambios realizados.");
      return [];
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Cambio de Cheque a Transferencia
      </Typography>

      {/* Formulario */}
      <Box className={styles.searchContainer}>
        <Typography variant="h6">Buscar empleado por ID</Typography>
        <Box className={styles.searchField}>
          <TextField
            label="ID del empleado"
            inputRef={searchInputRef}
            variant="outlined"
            fullWidth
            onKeyDown={(e) => e.key === "Enter" && buscarEmpleado()}
          />
          <Button variant="contained" color="primary" onClick={buscarEmpleado}>
            Buscar
          </Button>
        </Box>
        <Box className={styles.volver}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => (window.location.href = "/Cheques/CambioPago")}
          >
            Volver
          </Button>
        </Box>
      </Box>

      {employeeFound && (

        <Box className={styles.employeeForm}>
          {/* Advertencias */}
          <Box className={styles.alert}>
            <Alert severity="info">La CLABE interbancaria debe estar a nombre del titular registrado.</Alert>
            <Alert severity="info">La cuenta CLABE debe tener exactamente 18 dígitos.</Alert>
          </Box>
          <Box className={styles.row}>
            <TextField label="ID Empleado" value={employeeData.id} InputProps={{ readOnly: true }} className={styles.input} />
            <TextField label="Nombre" value={employeeData.nombre} InputProps={{ readOnly: true }} className={styles.input} />
          </Box>
          <Box className={styles.row}>
            <TextField label="Monto" value={employeeData.monto} InputProps={{ readOnly: true }} className={styles.input} />
            <TextField label="Fecha de cambio" value={fechaCambio} InputProps={{ readOnly: true }} className={styles.input} />
          </Box>
          <Box className={styles.row}>
            <TextField
              label="Cuenta Clabe"
              value={employeeData.numCuenta}
              fullWidth
              inputProps={{ maxLength: 18, pattern: "\\d*" }}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, numCuenta: e.target.value.replace(/\D/g, "") })
              }
              className={styles.input}
            />
            <TextField
              label="Banco"
              value={employeeData.banco}
              fullWidth
              onChange={(e) =>
                setEmployeeData({ ...employeeData, banco: e.target.value.toUpperCase() })
              }
              className={styles.input}
            />
          </Box>
          <Box className={styles.buttonContainer}>
            <Button variant="contained" color="primary" onClick={handleHacerCambio}>
              Hacer Cambio
            </Button>
            <Button variant="contained" color="primary" onClick={() => setChangesModalOpen(true)}>
              Ver Cambios
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={changesModalOpen} onClose={() => setChangesModalOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>Cambios realizados</DialogTitle>
        <DialogContent>
          <ReusableTable3
            columns={[
              { label: "ID Empleado", accessor: "id_empleado" },
              { label: "Nombre Completo", accessor: "nombre_completo" },
              { label: "Salario", accessor: "salario" },
              { label: "Fecha de Cambio", accessor: "fecha_cambio" },
              { label: "Tipo de Pago Anterior", accessor: "tipo_pago_anterior" },
              { label: "Tipo de Pago Actual", accessor: "tipo_pago_actual" },
              { label: "Número de Cuenta", accessor: "referencia" },
              { label: "Banco", accessor: "banco" },
              { label: "Titular", accessor: "titular_cuenta" },
            ]}
            fetchData={fetchChangesData}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangesModalOpen(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Confirmar cambios</DialogTitle>
        <DialogContent>
          <DialogContentText>Ingrese su RFC para confirmar los cambios:</DialogContentText>
          <TextField autoFocus margin="dense" label="RFC" fullWidth value={rfc} onChange={(e) => setRfc(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="error">
            Cancelar
          </Button>
          <Button onClick={validarRFC} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={warningOpen} onClose={() => setWarningOpen(false)}>
        <DialogTitle>Advertencia</DialogTitle>
        <DialogContent>
          <DialogContentText>No se puede realizar el cambio porque el tipo de pago actual ya es "Transferencia".</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWarningOpen(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


export default ChequeTrans;
