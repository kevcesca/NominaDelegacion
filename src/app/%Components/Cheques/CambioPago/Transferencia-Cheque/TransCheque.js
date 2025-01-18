"use client";
import { useState, useRef, useEffect } from "react";
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
} from "@mui/material";
import ReusableTable3 from "../../../../%Components/ReusableTable3";
import API_BASE_URL from "../../../../%Config/apiConfig";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./TransCheque.module.css";

export default function ChequeTrans() {
  const [employeeData, setEmployeeData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rfc, setRfc] = useState("");
  const searchInputRef = useRef();
  const [fechaCambio, setFechaCambio] = useState("");
  const [changesModalOpen, setChangesModalOpen] = useState(false);

  useEffect(() => {
    const fechaActual = new Date().toISOString().slice(0, 10);
    setFechaCambio(fechaActual);
  }, []);

  // Función para buscar empleado por ID
  const buscarEmpleado = async () => {
    const idEmpleado = searchInputRef.current?.value?.trim();

    if (!idEmpleado) {
      alert("Por favor, ingrese un ID de empleado.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/transferenciaACheque?id_empleado=${idEmpleado}&quincena=03`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.length > 0) {
          const empleado = data[0];
          setEmployeeData({
            id_empleado: empleado.id_empleado,
            nombre_completo: empleado.nombre_completo,
            tipo_pago_actual: empleado.tipo_pago_actual || "Sin tipo de pago",
            monto: empleado.monto || 0,
            referencia: empleado.referencia || "",
            banco: empleado.banco || "",
            titular_cuenta: empleado.titular_cuenta || "",
          });
        } else {
          alert("El ID del empleado no existe.");
          setEmployeeData(null);
        }
      } else {
        alert("Error al buscar los datos del empleado.");
        setEmployeeData(null);
      }
    } catch (error) {
      console.error("Error al buscar el empleado:", error);
      alert("Hubo un error al procesar la solicitud.");
    }
  };

  // Validar RFC
  const validarRFC = async () => {
    if (!rfc.trim()) {
      alert("Ingrese un RFC válido.");
      return false;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/validacionIdentidad?id_legal=${rfc}&id_empleado=${employeeData?.id_empleado}`
      );

      if (response.ok) {
        const data = await response.json();
        return data[0]?.mensaje === "Es correcto";
      } else {
        alert("Error al validar el RFC.");
        return false;
      }
    } catch (error) {
      console.error("Error al validar el RFC:", error);
      return false;
    }
  };

  // Función para actualizar el tipo de pago
  const actualizarTipoPago = async () => {
    if (!employeeData.tipo_pago_actual || employeeData.tipo_pago_actual === "Cheque") {
      alert("El empleado ya tiene como tipo de pago 'Cheque'.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/actualizarTipoPago?tipoPagoActual=Cheque&referencia=${employeeData.referencia}&cambio=true&autorizadoPor=${rfc}&idEmpleado=${employeeData.id_empleado}&banco=${employeeData.banco}&titular=${employeeData.titular_cuenta}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        alert("¡El cambio fue realizado exitosamente!");
        setShowModal(false);

        // Limpiar campos relacionados con la transacción
        setEmployeeData((prevData) => ({
          ...prevData,
          referencia: "",
          banco: "",
          titular_cuenta: "",
        }));
      } else {
        alert("Error al realizar el cambio. Intente más tarde.");
      }
    } catch (error) {
      console.error("Error al realizar el cambio:", error);
      alert("Error al procesar la solicitud.");
    }
  };

  const confirmarCambio = async () => {
    if (await validarRFC()) {
      await actualizarTipoPago();
    }
  };

  // Fetch de la tabla de cambios realizados
  const fetchChangesData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/cambiosTipoPago?tipo_pago_anterior=Transferencia&tipo_pago_actual=Cheque&cambio=true&quincena=03`
      );

      if (!response.ok) {
        throw new Error("Error al obtener los cambios realizados.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al cargar los cambios realizados:", error);
      alert("Error al cargar los datos.");
      return [];
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Cambio de Transferencia a Cheque
      </Typography>

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
          <Button
            variant="contained"
            color="primary"
            onClick={buscarEmpleado}
            className={styles.searchButton}
          >
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

      {employeeData && (
        <Box className={styles.employeeForm}>
          <Box className={styles.row}>
            <TextField
              label="ID Empleado"
              value={employeeData.id_empleado}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Nombre"
              value={employeeData.nombre_completo}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Box>
          <TextField
            label="Monto"
            value={employeeData.monto}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Fecha de cambio"
            value={fechaCambio}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Cuenta clabe"
            value={employeeData.referencia}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <Box className={styles.buttonContainer}>
            <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
              Hacer cambio
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setChangesModalOpen(true)}
            >
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
              { label: "Monto", accessor: "salario" },
              { label: "Fecha de Cambio", accessor: "fecha_cambio" },
              { label: "Tipo de Pago Anterior", accessor: "tipo_pago_anterior" },
              { label: "Tipo de Pago Actual", accessor: "tipo_pago_actual" },
              { label: "Número de Cuenta", accessor: "referencia" },
              { label: "Banco", accessor: "Banco" },
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

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Confirmar cambios</DialogTitle>
        <DialogContent>
          <DialogContentText>Ingrese su RFC para confirmar los cambios:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="RFC"
            fullWidth
            value={rfc}
            onChange={(e) => setRfc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="error">
            Cancelar
          </Button>
          <Button onClick={confirmarCambio} color="success">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
