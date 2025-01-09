"use client";
import { useState, useEffect } from "react";
import styles from "./ChequeManager.module.css";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  InputLabel,
  FormControl,
  ThemeProvider,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { Calendar } from "primereact/calendar";
import theme from "../../$tema/theme";
import ProtectedView from "../ProtectedView/ProtectedView";
import axios from "axios";
import API_BASE_URL from "../../%Config/apiConfig";

const ChequeManager = () => {
  const [folios, setFolios] = useState(0);
  const [numCheques, setNumCheques] = useState(0);
  const [quincena, setQuincena] = useState("");
  const [empleadosGenerados, setEmpleadosGenerados] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tipoNomina, setTipoNomina] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const nominaMap = {
    compuesta: ["COMPUESTA"],
    extraordinarios: ["EXTRAORDINARIOS"],
    finiquitos: ["FINIQUITOS"],
    honorarios: ["HONORARIOS"],
  };

  const fetchCheques = async () => {
    if (!quincena || !tipoNomina) {
      alert("Selecciona una quincena y tipo de nómina para actualizar los datos.");
      return;
    }

    setIsLoading(true); // Mostrar indicador de carga

    try {
      const tiposNomina = nominaMap[tipoNomina] || [];
      const responses = await Promise.all(
        tiposNomina.map((tipo) =>
          axios.get(`${API_BASE_URL}/NominaCtrl/Cheques`, {
            params: { anio: new Date().getFullYear(), quincena, tipo_nomina: tipo },
          })
        )
      );

      const cheques = responses.flatMap((response) =>
        response.data.map((cheque) => ({
          idEmpleado: cheque.id_empleado,
          numFolio: cheque.num_folio,
          nombre: cheque.nombre,
          tipoNomina: cheque.tipo_nomina,
          fechaCheque: new Date(cheque.fecha_cheque).toLocaleDateString(),
          monto: parseFloat(cheque.monto).toFixed(2),
          estadoCheque: cheque.estado_cheque,
          fechaEmision: new Date(cheque.fecha).toLocaleDateString(),
          quincena: cheque.quincena,
          tipoPago: cheque.tipo_pago,
        }))
      );

      setEmpleadosGenerados(cheques);
    } catch (error) {
      console.error("Error al cargar cheques:", error);
      setErrorMessage("Error al cargar los cheques desde el servidor.");
      setOpenErrorDialog(true);
    } finally {
      setIsLoading(false); // Ocultar indicador de carga
    }
  };

  const generarCheques = async () => {
    if (!folios || !numCheques || !quincena || !selectedDate || !tipoNomina) {
      alert("Por favor, completa todos los campos para generar cheques.");
      return;
    }

    const tiposNomina = nominaMap[tipoNomina] || [];

    try {
      setOpenSuccessDialog(false);
      setOpenErrorDialog(false);
      setIsLoading(true);

      const responses = await Promise.all(
        tiposNomina.map((tipo) => {
          const params = new URLSearchParams({
            folioInicial: folios,
            totalCheques: numCheques,
            quincena,
            fecha: selectedDate.toISOString().split("T")[0],
            tipoNominaSeleccionado: tipo,
          });

          return axios.get(`${API_BASE_URL}/generarCheques?${params.toString()}`);
        })
      );

      console.log("Cheques generados:", responses);
      setOpenSuccessDialog(true);

      await fetchCheques();
    } catch (error) {
      console.error("Error al generar cheques:", error);
      setErrorMessage("No se pudieron generar los cheques.");
      setOpenErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const actualizarQuincena = (fecha) => {
    setSelectedDate(fecha);
    const diffDias = Math.floor((fecha - new Date(fecha.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24));
    const quincenaCalculada = Math.floor(diffDias / 14) + 1;
    setQuincena(quincenaCalculada.toString().padStart(2, "0"));
  };

  return (
    <ProtectedView requiredPermissions={["Gestion_Cheques", "Acceso_total"]}>
      <ThemeProvider theme={theme}>
        <Box className={styles.container}>
          <Typography variant="h4">Generador de Cheques</Typography>

          <Box className={styles.formSection}>
            <FormControl className={styles.formControl}>
              <InputLabel>Tipo de Nómina</InputLabel>
              <Select
                value={tipoNomina}
                onChange={(e) => setTipoNomina(e.target.value)}
              >
                <MenuItem value="compuesta">Compuesta</MenuItem>
                <MenuItem value="extraordinarios">Extraordinarios</MenuItem>
                <MenuItem value="finiquitos">Finiquitos</MenuItem>
                <MenuItem value="honorarios">Honorarios</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.formControl}>
              <Calendar
                dateFormat="dd-mm-yy"
                onChange={(e) => actualizarQuincena(e.value)}
                placeholder="Selecciona una fecha"
              />
            </FormControl>

            <TextField
              label="Quincena"
              value={quincena}
              InputProps={{ readOnly: true }}
              className={styles.formControl}
            />

            <TextField
              label="Folio Inicial"
              type="number"
              value={folios}
              onChange={(e) => setFolios(e.target.value)}
              className={styles.formControl}
            />

            <TextField
              label="Número de Cheques"
              type="number"
              value={numCheques}
              onChange={(e) => setNumCheques(e.target.value)}
              className={styles.formControl}
            />
          </Box>

          <Box className={styles.buttons}>
            <Button
              variant="contained"
              color="primary"
              onClick={generarCheques}
              className={styles.button}
            >
              Generar Cheques
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={fetchCheques}
              className={styles.button}
            >
              Actualizar
            </Button>
          </Box>

          {isLoading ? (
            <Typography variant="h6">Cargando datos...</Typography>
          ) : (
            <TableContainer component={Paper} className={styles.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Empleado</TableCell>
                    <TableCell>Folio</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {empleadosGenerados
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((empleado) => (
                      <TableRow key={empleado.numFolio}>
                        <TableCell>{empleado.idEmpleado}</TableCell>
                        <TableCell>{empleado.numFolio}</TableCell>
                        <TableCell>{empleado.nombre}</TableCell>
                        <TableCell>{empleado.monto}</TableCell>
                        <TableCell>{empleado.estadoCheque}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={empleadosGenerados.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}

          <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
            <DialogContent>
              <DialogContentText>Cheques generados con éxito.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenSuccessDialog(false)} color="primary">
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)}>
            <DialogContent>
              <DialogContentText>{errorMessage}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenErrorDialog(false)} color="primary">
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </ThemeProvider>
    </ProtectedView>
  );
};

export default ChequeManager;
