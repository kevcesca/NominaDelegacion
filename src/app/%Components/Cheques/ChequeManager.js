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
  Checkbox,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Collapse,
  IconButton,
} from "@mui/material";
import { Calendar } from "primereact/calendar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import theme from "../../$tema/theme";
import ProtectedView from "../ProtectedView/ProtectedView";
import axios from "axios";
import API_BASE_URL, { API_USERS_URL } from "../../%Config/apiConfig";
import ColumnSelector from "../../%Components/ColumnSelector/ColumnSelector";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const ChequeManager = () => {
  const [folios, setFolios] = useState(0);
  const [numCheques, setNumCheques] = useState(0);
  const [quincena, setQuincena] = useState("");
  const [empleadosGenerados, setEmpleadosGenerados] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [ultimoFolioGenerado, setUltimoFolioGenerado] = useState(0);
  const [tipoNomina, setTipoNomina] = useState(""); // Estado para el tipo de nómina
  const [searchQuery, setSearchQuery] = useState("");


  const [visibleColumns, setVisibleColumns] = useState({
    idEmpleado: true,
    numFolio: true,
    nombre: true,
    tipoNomina: true,
    fechaCheque: true,
    monto: true,
    estadoCheque: true,
    fechaEmision: true,
    quincena: true,
    tipoPago: true,
  });
  const [columnSelectorOpen, setColumnSelectorOpen] = useState(false);

  const fetchCheques = async () => {
    if (!quincena || !tipoNomina) return; // Validar campos necesarios

    // Obtener los tipos de nómina asociados a la selección
    const tiposNomina = nominaMap[tipoNomina] || [];

    try {
      const responses = await Promise.all(
        tiposNomina.map((tipo) =>
          axios.get(`${API_BASE_URL}/NominaCtrl/Cheques`, {
            params: {
              anio: new Date().getFullYear(),
              quincena,
              tipo_nomina: tipo, // Enviar cada tipo de nómina
            },
          })
        )
      );

      // Combinar los resultados de todas las solicitudes
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
      setErrorMessage("Error al obtener los cheques");
      setOpenErrorDialog(true);
    }
  };

  const filterData = (data) => {
    if (!searchQuery.trim()) return data; // Si no hay búsqueda, devolver todos los datos.
    return data.filter((empleado) =>
      Object.keys(visibleColumns)
        .filter((key) => visibleColumns[key]) // Solo columnas visibles.
        .some((key) => String(empleado[key]) === searchQuery.trim()) // Coincidencia exacta.
    );
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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

      const responses = await Promise.all(
        tiposNomina.map((tipo) => {
          const params = new URLSearchParams({
            folioInicial: folios,
            totalCheques: numCheques,
            quincena,
            fecha: selectedDate.toISOString().split("T")[0],
            tipoNominaSeleccionado: capitalizeFirstLetter(tipo),
          });

          return axios.get(`${API_BASE_URL}/generarCheques?${params.toString()}`);
        })
      );

      const chequesGenerados = responses.flatMap((response) =>
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

      setEmpleadosGenerados((prev) => [...prev, ...chequesGenerados]);

      const ultimoCheque = folios + numCheques - 1;
      setUltimoFolioGenerado(ultimoCheque);

      // Guardar en localStorage
      localStorage.setItem("ultimoFolioGenerado", ultimoCheque.toString());

      setOpenSuccessDialog(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error al generar los cheques.");
      setOpenErrorDialog(true);
    }
  };

  useEffect(() => {
    const ultimoChequeGuardado = localStorage.getItem("ultimoFolioGenerado");
    if (ultimoChequeGuardado) {
      setUltimoFolioGenerado(parseInt(ultimoChequeGuardado, 10));
    }
  }, []);



  const calcularQuincena = (fecha) => {
    const fechaInicioAnio = new Date(fecha.getFullYear(), 0, 1);
    const diffDias = Math.floor((fecha - fechaInicioAnio) / (1000 * 60 * 60 * 24));
    const quincenaActual = Math.floor(diffDias / 14) + 1;
    return quincenaActual.toString().padStart(2, "0");
  };

  const actualizarQuincena = (fecha) => {
    setSelectedDate(fecha);
    const quincenaCalculada = calcularQuincena(fecha);
    setQuincena(quincenaCalculada);
  };

  const exportToPDF = () => {
    try {
      const dataToExport = getSelectedData();
      const doc = new jsPDF();
      autoTable(doc, {
        head: [Object.keys(visibleColumns).filter((key) => visibleColumns[key])],
        body: dataToExport.map((empleado) =>
          Object.keys(visibleColumns)
            .filter((key) => visibleColumns[key])
            .map((key) => empleado[key])
        ),
      });
      doc.save("reporte_cheques.pdf");
    } catch (error) {
      console.error("Error al exportar a PDF:", error);
    }
  };
  const exportToExcel = () => {
    try {
      const dataToExport = getSelectedData();
      const worksheet = XLSX.utils.json_to_sheet(
        dataToExport.map((empleado) =>
          Object.keys(visibleColumns)
            .filter((key) => visibleColumns[key])
            .reduce((acc, key) => {
              acc[key] = empleado[key];
              return acc;
            }, {})
        )
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Cheques");
      XLSX.writeFile(workbook, "reporte_cheques.xlsx");
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    }
  };

  const exportToCSV = () => {
    try {
      const dataToExport = getSelectedData();
      const csvRows = [
        Object.keys(visibleColumns).filter((key) => visibleColumns[key]).join(","),
        ...dataToExport.map((empleado) =>
          Object.keys(visibleColumns)
            .filter((key) => visibleColumns[key])
            .map((key) => empleado[key])
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvRows], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "reporte_cheques.csv");
      a.click();
    } catch (error) {
      console.error("Error al exportar a CSV:", error);
    }
  };

  const nominaMap = {
    compuesta: ["COMPUESTA"], // Tipos asociados a "Compuesta"
    extraordinarios: ["EXTRAORDINARIOS"], // Tipo único
    finiquitos: ["FINIQUITOS"], // Tipo único
    honorarios: ["HONORARIOS"], // Tipo único
  };


  const handleColumnSelectionChange = (selectedColumns) => {
    setVisibleColumns(selectedColumns);
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getSelectedData = () => {
    if (selectedRows.length > 0) {
      return empleadosGenerados.filter((empleado) =>
        selectedRows.includes(empleado.numFolio)
      );
    }
    return empleadosGenerados;
  };

  useEffect(() => {
    fetchCheques();
  }, [quincena, tipoNomina]);
  return (
    <ProtectedView requiredPermissions={["Gestion_Cheques", "Acceso_total"]}>
      <ThemeProvider theme={theme}>
        <Box className={styles.container}>
          <Typography variant="h4">Gestor de Cheques</Typography>

          {/* Sección de Inputs */}
          <Box className={styles.section}>

            <FormControl className={styles.labels}>
              <InputLabel>Tipo de Nómina</InputLabel>
              <Select
                id="nomina"
                label="Tipo de Nómina"
                value={tipoNomina} // Vincula con el estado
                onChange={(e) => setTipoNomina(e.target.value)} // Actualiza el estado
              >
                <MenuItem value="compuesta">Compuesta</MenuItem>
                <MenuItem value="extraordinarios">Extraordinarios</MenuItem>
                <MenuItem value="finiquitos">Finiquitos</MenuItem>
                <MenuItem value="honorarios">Honorarios</MenuItem>
              </Select>
            </FormControl>



            <FormControl>
              <Calendar
                dateFormat="dd-mm-yy"
                id="fechaActual"
                onChange={(e) => actualizarQuincena(e.value)}
                placeholder="Seleccione una fecha"
                className={styles.labels}
              />
            </FormControl>

            <TextField
              label="Quincena"
              value={quincena}
              placeholder="Quincena automática"
              InputProps={{ readOnly: true }}
              className={styles.labels}
            />
          </Box>

          {/* Inputs adicionales */}
          <Box className={styles.section}>
            <TextField
              label="Folio Inicial"
              type="number"
              value={folios}
              onChange={(e) => setFolios(e.target.value)}
              className={styles.labels}
            />
            <TextField
              label="Número de Cheques"
              type="number"
              value={numCheques}
              onChange={(e) => setNumCheques(e.target.value)}
              className={styles.labels}
            />
          </Box>

          <Box className={styles.searchSection}>
            <TextField
              label="Buscar"
              placeholder="Ingrese un término para buscar"
              variant="outlined"
              fullWidth
              onChange={(e) => setSearchQuery(e.target.value.trim())}
              className={styles.searchBar}
            />
          </Box>

          <Button
                variant="contained"
                color="secondary"
                onClick={() => window.location.href = "/Cheques/CambioPago"}
                className={`${styles.secondaryButton} ${selectedRows.length === 0 ? styles.hidden : ""
                  }`}
              >
                Cambiar Tipo de Pago
              </Button>


          {/* Selector de columnas */}
          <Box>
            <IconButton
              className={styles.iconButton}
              onClick={() => setColumnSelectorOpen(!columnSelectorOpen)}
              color="primary"
            >
              <FilterAltIcon />
            </IconButton>
            <Collapse in={columnSelectorOpen}>
              <ColumnSelector
                availableColumns={[
                  { key: "idEmpleado", label: "ID Empleado" },
                  { key: "numFolio", label: "Folio" },
                  { key: "nombre", label: "Nombre" },
                  { key: "tipoNomina", label: "Tipo Nómina" },
                  { key: "fechaCheque", label: "Fecha Cheque" },
                  { key: "monto", label: "Monto" },
                  { key: "estadoCheque", label: "Estado Cheque" },
                  { key: "fechaEmision", label: "Fecha Emisión" },
                  { key: "quincena", label: "Quincena" },
                  { key: "tipoPago", label: "Tipo Pago" },
                ]}
                onSelectionChange={handleColumnSelectionChange}
              />
            </Collapse>
          </Box>


          {/* Botones de exportación */}
          <Box className={styles.exportButtons}>
            <Button variant="contained" color="primary" onClick={exportToPDF}>
              Exportar PDF
            </Button>
            <Button variant="contained" color="primary" onClick={exportToExcel}>
              Exportar Excel
            </Button>
            <Button variant="contained" color="primary" onClick={exportToCSV}>
              Exportar CSV
            </Button>
          </Box>

          <Box className={styles.lastChequeSection}>
            {ultimoFolioGenerado > 0 && (
              <Typography variant="h6" color="textSecondary">
                Último cheque generado: {ultimoFolioGenerado}
              </Typography>
            )}
          </Box>

          

          {/* Tabla de datos */}
          <Box className={styles.tableSection}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedRows.length > 0 &&
                          selectedRows.length < empleadosGenerados.length
                        }
                        checked={selectedRows.length === empleadosGenerados.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(
                              empleadosGenerados.map((empleado) => empleado.numFolio)
                            );
                          } else {
                            setSelectedRows([]);
                          }
                        }}
                      />
                    </TableCell>
                    {Object.keys(visibleColumns).map(
                      (key) =>
                        visibleColumns[key] && (
                          <TableCell key={key} className={styles.tableHeader}>
                            {key}
                          </TableCell>
                        )
                    )}
                  </TableRow>
                </TableHead>


                <TableBody>
                  {filterData(empleadosGenerados)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((empleado) => (
                      <TableRow key={empleado.numFolio}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedRows.includes(empleado.numFolio)}
                            onChange={() => handleCheckboxChange(empleado.numFolio)}
                          />
                        </TableCell>
                        {Object.keys(visibleColumns).map(
                          (key) =>
                            visibleColumns[key] && <TableCell key={key}>{empleado[key]}</TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>



                <TableBody>
                  {empleadosGenerados
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((empleado) => (
                      <TableRow key={empleado.numFolio}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedRows.includes(empleado.numFolio)}
                            onChange={() =>
                              handleCheckboxChange(empleado.numFolio)
                            }
                          />
                        </TableCell>
                        {Object.keys(visibleColumns).map(
                          (key) =>
                            visibleColumns[key] && (
                              <TableCell key={key}>{empleado[key]}</TableCell>
                            )
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={empleadosGenerados.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Botones adicionales */}
            <Box className={styles.actionButtons}>
              {/* Este botón estará oculto cuando no haya cheques seleccionados */}
              

              
            </Box>
          </Box>

          {/* Botón de generar */}
          <Box className={styles.buttons}>
            <Button variant="contained" color="primary" onClick={generarCheques}>
              Generar
            </Button>
            <Button
                variant="contained"
                onClick={() => window.location.href = "/Cheques/Poliza"}
                className={styles.generatePolizasButton}
              >
                Generar Pólizas
              </Button>
          </Box>

          {/* Modal de Éxito */}
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

          {/* Modal de Error */}
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
