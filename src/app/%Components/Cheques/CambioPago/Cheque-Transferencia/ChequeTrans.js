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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Select,
  row,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import styles from "./ChequeTrans.module.css";
import API_BASE_URL from "../../../../%Config/apiConfig";

const ChequeTrans = () => {
  const [employeeFound, setEmployeeFound] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    id: "",
    nombre: "",
    monto: "",
    numCuenta: "",
    banco: "",
    titular: "",
  });
  const [fechaCambio, setFechaCambio] = useState("");
  const [originalEmployeeData, setOriginalEmployeeData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rfc, setRfc] = useState("");
  const [changesData, setChangesData] = useState([]);
  const [changesModalOpen, setChangesModalOpen] = useState(false); // Modal para la tabla de cambios
  const searchInputRef = useRef();
  const [selectedRows, setSelectedRows] = useState([]);
  // Inicializar la fecha al montar el componente
  useEffect(() => {
    const fechaActual = new Date();
    const fechaISO = fechaActual.toISOString().slice(0, 10);
    setFechaCambio(fechaISO);
  }, []);

  // Buscar empleado por ID
  const buscarEmpleado = async () => {
    const id = searchInputRef.current.value;
    if (!id) {
      alert("Por favor, ingrese un ID válido.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/chequeATransferencia?id_empleado=${id}&quincena=03`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const empleado = data[0];
          const employeeData = {
            id: empleado.id_empleado,
            nombre: empleado.nombre_completo,
            monto: empleado.monto,
            numCuenta: "",
            banco: "",
            titular: "",
          };
          setEmployeeData(employeeData);
          setOriginalEmployeeData(employeeData); // Guardar datos originales
          setEmployeeFound(true);
        } else {
          alert("El ID del empleado no existe. Por favor, intente nuevamente.");
          setEmployeeFound(false);
        }
      } else {
        alert("Error al buscar el empleado. Intente más tarde.");
      }
    } catch (error) {
      console.error("Error al buscar el empleado:", error);
      alert("Error al buscar el empleado. Intente nuevamente.");
    }
  };

  // Abrir modal de confirmación
  const handleHacerCambio = () => {
    if (!employeeData.id) {
      alert("Debe buscar un empleado antes de realizar el cambio.");
      return;
    }
    setModalOpen(true);
  };

  // Cancelar cambios y restaurar datos originales
  const cancelarCambio = () => {
    if (originalEmployeeData) {
      setEmployeeData(originalEmployeeData); // Restaurar datos originales
      alert("Los cambios han sido cancelados y se han restaurado los datos originales.");
    } else {
      alert("No hay cambios que cancelar.");
    }
  };

  // Validar RFC usando el servicio
  const validarRFC = async () => {
    if (!rfc) {
      alert("Ingrese un RFC para continuar.");
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
          setModalOpen(false);
          actualizarTipoPago(); // Proceder a actualizar el tipo de pago
        } else {
          alert("El RFC ingresado no es válido. Por favor, vuelva a ingresarlo.");
        }
      } else {
        alert("Error al validar el RFC. Intente más tarde.");
      }
    } catch (error) {
      console.error("Error al conectar con el servicio:", error);
      alert("Error al conectar con el servicio. Intente más tarde.");
    }
  };

  // Actualizar tipo de pago usando el servicio
  const actualizarTipoPago = async () => {
    try {
      const referencia = "564846846846";
      const autorizadoPor = "Kevin";
      const tipoPagoActual = "Transferencia";
      const banco = employeeData.banco;

      const response = await fetch(
        `${API_BASE_URL}/actualizarTipoPago?tipoPagoActual=${tipoPagoActual}&referencia=${referencia}&cambio=true&autorizadoPor=${autorizadoPor}&idEmpleado=${employeeData.id}&banco=${banco}`
      );

      if (response.ok) {
        const data = await response.text();
        if (data === "Actualización exitosa") {
          alert("¡El cambio fue realizado exitosamente!");
        } else {
          alert("Error al actualizar el tipo de pago. Intente más tarde.");
        }
      } else {
        alert("Error al conectar con el servicio. Intente más tarde.");
      }
    } catch (error) {
      console.error("Error al actualizar el tipo de pago:", error);
      alert("Error al realizar el cambio. Intente nuevamente.");
    }
  };

  const handleRowSelect = (rowId) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowId)
        ? prevSelected.filter((id) => id !== rowId)
        : [...prevSelected, rowId]
    );
  };


  const exportToCSV = () => {
    const selectedData = changesData.filter((row) =>
      selectedRows.includes(row.id_empleado)
    );
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cambios");
    XLSX.writeFile(workbook, "CambiosRealizados.csv");
  };

  const exportToExcel = () => {
    const selectedData = changesData.filter((row) =>
      selectedRows.includes(row.id_empleado)
    );
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cambios");
    XLSX.writeFile(workbook, "CambiosRealizados.xlsx");
  };

  const exportToPDF = () => {
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
        `${API_BASE_URL}/cambiosTipoPago?tipo_pago_anterior=Cheque&tipo_pago_actual=Transferencia&cambio=true&quincena=03`
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
      {/* Encabezado */}
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          Cambio de Cheque a Transferencia
        </Typography>
      </Box>
      {/* Buscar empleado */}
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

      {/* Mostrar formulario si se encuentra al empleado */}
      {employeeFound && (
        <Box className={styles.employeeForm}>
          <Box className={styles.row}>
            <TextField
              label="ID Empleado"
              value={employeeData.id}
              InputProps={{ readOnly: true }}
              variant="outlined"
              className={styles.input}
            />
            <TextField
              label="Nombre"
              value={employeeData.nombre}
              InputProps={{ readOnly: true }}
              variant="outlined"
              className={styles.input}
            />
          </Box>
          <Box className={styles.row}>
            <TextField
              label="Monto"
              value={employeeData.monto}
              InputProps={{ readOnly: true }}
              variant="outlined"
              className={styles.input}
            />
            <TextField
              label="Fecha de cambio"
              value={fechaCambio}
              InputProps={{ readOnly: true }}
              variant="outlined"
              className={styles.input}
            />
          </Box>
          <Box className={styles.row}>
            <TextField
              label="Número de cuenta actual"
              value={employeeData.numCuenta}
              placeholder="Ingrese el número de cuenta"
              onChange={(e) =>
                setEmployeeData({ ...employeeData, numCuenta: e.target.value })
              }
              variant="outlined"
              className={styles.input}
            />
            <TextField
              label="Banco"
              value={employeeData.banco}
              placeholder="Ingrese el nombre del banco"
              onChange={(e) =>
                setEmployeeData({ ...employeeData, banco: e.target.value })
              }
              variant="outlined"
              className={styles.input}
            />
          </Box>
          <Box className={styles.row}>
            <TextField
              label="Titular de la cuenta"
              value={employeeData.titular}
              placeholder="Ingrese el titular de la cuenta"
              onChange={(e) =>
                setEmployeeData({ ...employeeData, titular: e.target.value })
              }
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box className={styles.buttonContainer}>
            <Button variant="contained" color="success" onClick={handleHacerCambio}>
              Hacer cambio
            </Button>
            <Button variant="contained" color="error" onClick={cancelarCambio}>
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
          <Box className={styles.buttonchange}>
            <Button variant="contained" onClick={verCambiosRealizados}>
              Ver cambios realizados este mes
            </Button>
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

      {/* Modal de confirmación */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
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
          <Button onClick={() => setModalOpen(false)} color="error">
            Cancelar
          </Button>
          <Button onClick={validarRFC} color="success">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChequeTrans;
