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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import styles from "./TransCheque.module.css";
import API_BASE_URL from "../../../../%Config/apiConfig";

export default function ChequeTrans() {
  const [employeeData, setEmployeeData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rfc, setRfc] = useState("");
  const searchInputRef = useRef();
  const [fechaCambio, setFechaCambio] = useState("");
  const [changesModalOpen, setChangesModalOpen] = useState(false);
  const [changesData, setChangesData] = useState([]);
  const [isInitialView, setIsInitialView] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fechaActual = new Date();
    const fechaISO = fechaActual.toISOString().slice(0, 10);
    setFechaCambio(fechaISO);
  }, []);

  const buscarEmpleado = async () => {
    const idEmpleado = searchInputRef.current?.value;

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
                setEmployeeData(data[0]); // Establecer datos del empleado
                setIsInitialView(false); // Cambiar a vista de edición
            } else {
                // Mostrar alerta y vaciar campos
                alert("El ID del empleado no existe. Por favor, intente nuevamente.");
                setEmployeeData(null); // Limpiar datos del empleado
                setIsInitialView(true); // Regresar a la vista inicial
            }
        } else {
            alert("Error al buscar los datos del empleado.");
            setEmployeeData(null); // Limpiar datos en caso de error
            setIsInitialView(true); // Regresar a la vista inicial
        }
    } catch (error) {
        console.error("Error al buscar el empleado:", error);
        alert("Hubo un error al procesar la solicitud.");
        setEmployeeData(null); // Limpiar datos en caso de error
        setIsInitialView(true); // Regresar a la vista inicial
    }
};


  const validarRFC = async () => {
    if (!rfc) {
      alert("Por favor, ingrese un RFC válido.");
      return false;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/validacionIdentidad?id_legal=${rfc}&id_empleado=${employeeData.id_empleado}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data[0]?.mensaje === "Es correcto") {
          return true;
        } else {
          alert("El RFC ingresado no es válido. Por favor, vuelva a ingresarlo.");
          return false;
        }
      } else {
        alert("Error al validar el RFC. Por favor, inténtelo nuevamente.");
        return false;
      }
    } catch (error) {
      console.error("Error al validar el RFC:", error);
      alert("Hubo un error al procesar la validación del RFC.");
      return false;
    }
  };

  const confirmarCambio = async () => {
    const esRFCValido = await validarRFC();

    if (esRFCValido) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/actualizarTipoPago/2?tipoPagoActual=Cheque&cambio=true&autorizadoPor=${rfc}&idEmpleado=${employeeData.id_empleado}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const result = await response.text();
          alert(result);
          setShowModal(false);
          setRfc("");
        } else {
          alert("Hubo un error al realizar el cambio. Inténtelo nuevamente.");
        }
      } catch (error) {
        console.error("Error al confirmar el cambio:", error);
        alert("Hubo un error al procesar la solicitud.");
      }
    }
  };

  const cancelarCambio = () => {
    setEmployeeData(null);
    setIsInitialView(true);
  };

  const handleSelectAll = (isSelected) => {
    setSelectedRows(isSelected ? changesData.map((row) => row.id_empleado) : []);
  };

  const handleRowSelect = (rowId) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowId)
        ? prevSelected.filter((id) => id !== rowId)
        : [...prevSelected, rowId]
    );
  };

  const exportToCSV = () => {
    if (selectedRows.length === 0) {
      alert("Seleccione al menos una fila para exportar.");
      return;
    }

    const selectedData = changesData.filter((row) =>
      selectedRows.includes(row.id_empleado)
    );
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cambios");
    XLSX.writeFile(workbook, "CambiosRealizados.csv");
  };

  const exportToExcel = () => {
    if (selectedRows.length === 0) {
      alert("Seleccione al menos una fila para exportar.");
      return;
    }

    const selectedData = changesData.filter((row) =>
      selectedRows.includes(row.id_empleado)
    );
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cambios");
    XLSX.writeFile(workbook, "CambiosRealizados.xlsx");
  };

  const exportToPDF = () => {
    if (selectedRows.length === 0) {
      alert("Seleccione al menos una fila para exportar.");
      return;
    }

    const selectedData = changesData.filter((row) =>
      selectedRows.includes(row.id_empleado)
    );
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "ID",
          "Nombre Completo",
          "Salario",
          "Fecha de Cambio",
          "Tipo de Pago Anterior",
          "Tipo de Pago Actual",
          "Número de Cuenta",
          "Banco",
          "Titular",
        ],
      ],
      body: selectedData.map((row) => [
        row.id_empleado,
        row.nombre_completo,
        row.salario,
        new Date(row.fecha_cambio).toLocaleDateString(),
        row.tipo_pago_anterior,
        row.tipo_pago_actual,
        row.referencia,
        row.Banco,
        row.titular_cuenta,
      ]),
    });
    doc.save("CambiosRealizados.pdf");
  };

  

  // Mostrar cambios realizados este mes
  const verCambiosRealizados = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/cambiosTipoPago?tipo_pago_anterior=Transferencia&tipo_pago_actual=Cheque&cambio=true&quincena=03`
      );
      if (response.ok) {
        const data = await response.json();
        setChangesData(data);
        setChangesModalOpen(true);
      } else {
        alert("Error al obtener los cambios realizados. Intente más tarde.");
      }
    } catch (error) {
      console.error("Error al obtener los cambios:", error);
      alert("Error al conectar con el servicio. Intente más tarde.");
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h5" className={styles.title}>
          Cambio de transferencia a cheque
        </Typography>
      </Box>

      {isInitialView ? (
        <Box className={styles.searchContainer}>
          <Typography variant="h6">Buscar empleado por ID</Typography>
          <Box className={styles.searchField}>
            <TextField
              label="ID del empleado"
              inputRef={searchInputRef}
              variant="outlined"
              fullWidth
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
        </Box>
      ) : (
        <Box>
          <Box className={styles.searchContainer}>
            <Typography variant="h6">Buscar otro empleado por ID</Typography>
            <Box className={styles.searchField}>
              <TextField
                label="ID del empleado"
                inputRef={searchInputRef}
                variant="outlined"
                fullWidth
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
          </Box>

          <Box className={styles.employeeForm}>
            <Box className={styles.row}>
              <TextField
                label="ID Empleado"
                value={employeeData?.id_empleado || ""}
                variant="outlined"
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Nombre"
                value={employeeData?.nombre_completo || ""}
                variant="outlined"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Box>
            <Box className={styles.row}>
              <TextField
                label="Monto"
                value={employeeData?.monto || ""}
                variant="outlined"
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Fecha de cambio"
                type="date"
                value={fechaCambio}
                onChange={(e) => setFechaCambio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
            <TextField
              label="Número de cuenta actual"
              value={employeeData?.referencia || ""}
              variant="outlined"
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <Box className={styles.buttonContainer}>
              <Button
                variant="contained"
                color="success"
                onClick={() => setShowModal(true)}
              >
                Hacer cambio
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={cancelarCambio}
              >
                Cancelar cambio
              </Button>
            </Box>
            <Typography
              variant="subtitle1"
              color="error"
              align="center"
              className={styles.message}
            >
              Los pagos empezarán a correr desde la primera quincena de{" "}
              {fechaCambio.slice(0, 7)}.
            </Typography>
            <Box mt={2} className={styles.verCambios}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#d4a373",
                  color: "white",
                }}
                onClick={verCambiosRealizados}
              >
                Ver cambios realizados este mes
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Modal con la tabla de cambios */}
      <Dialog
        open={changesModalOpen}
        onClose={() => setChangesModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Cambios realizados este mes</DialogTitle>
        <DialogContent>

          <Box className={styles.exportButtons}>
            <Button variant="contained" onClick={exportToCSV}>
              Exportar CSV
            </Button>
            <Button variant="contained" onClick={exportToExcel}>
              Exportar Excel
            </Button>
            <Button variant="contained" onClick={exportToPDF}>
              Exportar PDF
            </Button>
          </Box>

          <TableContainer component={Paper} className={styles.tableContainer}>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < changesData.length
                      }
                      checked={
                        selectedRows.length === changesData.length
                      }
                      onChange={(e) =>
                        setSelectedRows(
                          e.target.checked
                            ? changesData.map((row) => row.id_empleado)
                            : []
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre Completo</TableCell>
                  <TableCell>Salario</TableCell>
                  <TableCell>Fecha de Cambio</TableCell>
                  <TableCell>Tipo de Pago Anterior</TableCell>
                  <TableCell>Tipo de Pago Actual</TableCell>
                  <TableCell>Número de Cuenta</TableCell>
                  <TableCell>Banco</TableCell>
                  <TableCell>Titular</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {changesData.map((row) => (
                  <TableRow key={row.id_empleado}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.includes(row.id_empleado)}
                        onChange={() => handleRowSelect(row.id_empleado)}
                      />
                    </TableCell>
                    <TableCell>{row.id_empleado}</TableCell>
                    <TableCell>{row.nombre_completo}</TableCell>
                    <TableCell>{row.salario}</TableCell>
                    <TableCell>{new Date(row.fecha_cambio).toLocaleDateString()}</TableCell>
                    <TableCell>{row.tipo_pago_anterior}</TableCell>
                    <TableCell>{row.tipo_pago_actual}</TableCell>
                    <TableCell>{row.referencia}</TableCell>
                    <TableCell>{row.Banco}</TableCell>
                    <TableCell>{row.titular_cuenta}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
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
          <DialogContentText>
            Ingrese su RFC para confirmar los cambios:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="RFC"
            type="text"
            fullWidth
            value={rfc}
            onChange={(e) => setRfc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmarCambio} color="success">
            Confirmar
          </Button>
          <Button onClick={() => setShowModal(false)} color="error">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
