"use client";
import { useState, useEffect } from "react";
import styles from './ChequeManager.module.css';
import { Box, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, InputLabel, FormControl, ThemeProvider, Checkbox, TablePagination, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { Calendar } from 'primereact/calendar';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import theme from '../../$tema/theme';
import ProtectedView from '../ProtectedView/ProtectedView';
import axios from 'axios';
import API_BASE_URL, { API_USERS_URL } from "../../%Config/apiConfig";



const ChequeManager = () => {
  const [folios, setFolios] = useState(0);
  const [numCheques, setNumCheques] = useState(0);
  const [quincena, setQuincena] = useState('');
  const [empleadosGenerados, setEmpleadosGenerados] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [ultimoFolioGenerado, setUltimoFolioGenerado] = useState(0);

  // Servicio para obtener los cheques generados
  const fetchCheques = async () => {
    if (!quincena) return; // Validar que la quincena esté seleccionada
    try {
      const response = await axios.get(`${API_USERS_URL}/cheques`, {
        params: { anio: new Date().getFullYear(), quincena },
      });

      // Procesar los datos recibidos
      const cheques = response.data.map((cheque) => ({
        idEmpleado: cheque.id_empleado,
        nombre: cheque.nombre,
        tipoNomina: cheque.tipo_nomina,
        fechaCheque: new Date(cheque.fecha_cheque).toLocaleDateString(), // Formatear fecha
        monto: parseFloat(cheque.monto).toFixed(2), // Formatear monto como decimal
        estadoCheque: cheque.estado_cheque,
        quincena: cheque.quincena,
        fechaEmision: new Date(cheque.fecha).toLocaleDateString(), // Formatear fecha de emisión
        tipoPago: cheque.tipo_pago,
        numFolio: cheque.num_folio,
      }));

      setEmpleadosGenerados(cheques);
    } catch (error) {
      setErrorMessage('Error al obtener los cheques');
      setOpenErrorDialog(true);
    }
  };

  // Servicio para generar cheques
  const generarCheques = async () => {
    if (!folios || !numCheques || !quincena || !selectedDate) {
      alert("Por favor, completa todos los campos para generar cheques.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/Nomina/generarCheques`, null, {
        params: {
          folioInicial: folios,
          totalCheques: numCheques,
          quincena,
          fecha: selectedDate.toISOString().split("T")[0], // Formato YYYY-MM-DD
        },
      });

      // Actualizar tabla con los cheques recién generados
      if (response.data) {
        const chequesGenerados = response.data.map((cheque) => ({
          idEmpleado: cheque.id_empleado,
          nombre: cheque.nombre,
          tipoNomina: cheque.tipo_nomina,
          fechaCheque: new Date(cheque.fecha_cheque).toLocaleDateString(),
          monto: parseFloat(cheque.monto).toFixed(2),
          estadoCheque: cheque.estado_cheque,
          quincena: cheque.quincena,
          fechaEmision: new Date(cheque.fecha).toLocaleDateString(),
          tipoPago: cheque.tipo_pago,
          numFolio: cheque.num_folio,
        }));

        setEmpleadosGenerados(chequesGenerados);
        setUltimoFolioGenerado(folios + numCheques - 1);
      }
    } catch (error) {
      setErrorMessage('Error al generar cheques');
      setOpenErrorDialog(true);
    }
  };

  const getSelectedData = () => {
    // Si hay registros seleccionados, filtrarlos de empleadosGenerados
    if (selectedRows.length > 0) {
      return empleadosGenerados.filter((empleado) =>
        selectedRows.includes(empleado.numFolio)
      );
    }
    // Si no hay filas seleccionadas, exportar todos
    return empleadosGenerados;
  };
  

  const exportToPDF = () => {
    try {
      const dataToExport = getSelectedData();
      if (dataToExport.length === 0) {
        alert("No hay datos disponibles para exportar.");
        return;
      }
  
      const doc = new jsPDF();
      autoTable(doc, {
        head: [["Folio", "Nombre", "Tipo Nómina", "Fecha Cheque", "Monto", "Estado", "Fecha Emisión", "Tipo Pago"]],
        body: dataToExport.map((empleado) => [
          empleado.numFolio,
          empleado.nombre,
          empleado.tipoNomina,
          empleado.fechaCheque,
          empleado.monto,
          empleado.estadoCheque,
          empleado.fechaEmision,
          empleado.tipoPago,
        ]),
      });
      doc.save("reporte_cheques.pdf");
    } catch (error) {
      console.error("Error al exportar a PDF:", error);
      alert("Ocurrió un error al exportar a PDF. Verifica la consola para más detalles.");
    }
  };
  

  const exportToExcel = () => {
    try {
      const dataToExport = getSelectedData();
      if (dataToExport.length === 0) {
        alert("No hay datos disponibles para exportar.");
        return;
      }
  
      const worksheet = XLSX.utils.json_to_sheet(
        dataToExport.map((empleado) => ({
          Folio: empleado.numFolio,
          Nombre: empleado.nombre,
          "Tipo Nómina": empleado.tipoNomina,
          "Fecha Cheque": empleado.fechaCheque,
          Monto: empleado.monto,
          Estado: empleado.estadoCheque,
          "Fecha Emisión": empleado.fechaEmision,
          "Tipo Pago": empleado.tipoPago,
        }))
      );
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Cheques");
      XLSX.writeFile(workbook, "reporte_cheques.xlsx");
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      alert("Ocurrió un error al exportar a Excel. Verifica la consola para más detalles.");
    }
  };
  

  const exportToCSV = () => {
    try {
      const dataToExport = getSelectedData();
      if (dataToExport.length === 0) {
        alert("No hay datos disponibles para exportar.");
        return;
      }
  
      const csvRows = [
        ["Folio", "Nombre", "Tipo Nómina", "Fecha Cheque", "Monto", "Estado", "Fecha Emisión", "Tipo Pago"].join(","),
        ...dataToExport.map((empleado) =>
          [
            empleado.numFolio,
            empleado.nombre,
            empleado.tipoNomina,
            empleado.fechaCheque,
            empleado.monto,
            empleado.estadoCheque,
            empleado.fechaEmision,
            empleado.tipoPago,
          ].join(",")
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
      alert("Ocurrió un error al exportar a CSV. Verifica la consola para más detalles.");
    }
  };
  
  useEffect(() => {
    fetchCheques();
  }, [quincena]);

  const calcularQuincena = (fecha) => {
    const fechaInicioAnio = new Date(fecha.getFullYear(), 0, 1); // 1 de enero del año
    const diffDias = Math.floor((fecha - fechaInicioAnio) / (1000 * 60 * 60 * 24)); // Días transcurridos desde inicio del año
    const quincenaActual = Math.floor(diffDias / 14) + 1; // Calcular el número de quincena

    return quincenaActual.toString().padStart(2, '0'); // Formato de 2 dígitos
  };

  const actualizarQuincena = (fecha) => {
    setSelectedDate(fecha);
    const quincenaCalculada = calcularQuincena(fecha);
    setQuincena(quincenaCalculada);
  };

  const manejarCambioFolio = (e) => {
    const nuevoFolio = parseInt(e.target.value);
    setFolios(nuevoFolio > ultimoFolioGenerado ? nuevoFolio : ultimoFolioGenerado + 1);
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ProtectedView requiredPermissions={["Gestion_Cheques", "Acceso_total"]}>
      <ThemeProvider theme={theme}>
        <Box className={styles.container}>
          <Typography variant="h4">Gestor de Cheques</Typography>

          <Box className={styles.section}>
            <FormControl className={styles.labels}>
              <InputLabel>Tipo de Nómina</InputLabel>
              <Select id="nomina" label="Tipo de Nómina" defaultValue="">
                <MenuItem value="base">Compuesta</MenuItem>
                <MenuItem value="extraordinario">Extraordinario</MenuItem>
                <MenuItem value="finiquitos">Finiquitos</MenuItem>
                <MenuItem value="honorarios">Honorarios</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <Calendar dateFormat="dd-mm-yy" id="fechaActual" onChange={(e) => actualizarQuincena(e.value)} placeholder="Seleccione una fecha" className={styles.labels} />
            </FormControl>

            <TextField label="Quincena" value={quincena} placeholder="Quincena automática" InputProps={{ readOnly: true }} className={styles.labels} />
          </Box>

          <Box className={styles.section}>
            <TextField label="Folio Inicial" type="number" value={folios} onChange={manejarCambioFolio} className={styles.labels} />
            <TextField label="Número de Cheques" type="number" value={numCheques} onChange={(e) => setNumCheques(parseInt(e.target.value))} className={styles.labels} />
          </Box>

          {ultimoFolioGenerado > 0 && (
            <Typography variant="h6" className={styles['last-folio-label']}>
              Último Folio Generado: {ultimoFolioGenerado}
            </Typography>
          )}

          <Box className={styles.tableSection}>
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



            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedRows.length > 0 && selectedRows.length < empleadosGenerados.length}
                        checked={selectedRows.length === empleadosGenerados.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(empleadosGenerados.map((empleado) => empleado.numFolio));
                          } else {
                            setSelectedRows([]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Folio</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Tipo Nómina</TableCell>
                    <TableCell>Fecha Cheque</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha Emisión</TableCell>
                    <TableCell>Tipo Pago</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {empleadosGenerados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((empleado) => (
                    <TableRow key={empleado.numFolio}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(empleado.numFolio)}
                          onChange={() => handleCheckboxChange(empleado.numFolio)}
                        />
                      </TableCell>
                      <TableCell>{empleado.numFolio}</TableCell>
                      <TableCell>{empleado.nombre}</TableCell>
                      <TableCell>{empleado.tipoNomina}</TableCell>
                      <TableCell>{empleado.fechaCheque}</TableCell>
                      <TableCell>{empleado.monto}</TableCell>
                      <TableCell>{empleado.estadoCheque}</TableCell>
                      <TableCell>{empleado.fechaEmision}</TableCell>
                      <TableCell>{empleado.tipoPago}</TableCell>
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
          </Box>

          <Box className={styles.buttons}>
            <Button variant="contained" color="primary" onClick={generarCheques}>
              Generar Cheques
            </Button>
          </Box>
        </Box>

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
      </ThemeProvider>
    </ProtectedView>
  );
};

export default ChequeManager;
