"use client"
import { useState } from 'react'
import styles from './page.module.css'
import Link from 'next/link';
import { Box, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, InputLabel, FormControl, ThemeProvider, Dialog, DialogActions, DialogContent, DialogContentText, Checkbox, TablePagination } from '@mui/material';
import { Calendar } from 'primereact/calendar';
import theme from '../$tema/theme';
import ProtectedView from '../%Components/ProtectedView/ProtectedView';

const empleados = [
  { id: "1", nombre: "Juan Pérez", tipoNomina: "Base", monto: "$5000", estadoCheque: "Creado", clc: "CLC1234", tipoPago: "Cheque" },
  { id: "2", nombre: "Ana Gómez", tipoNomina: "Nomina 8", monto: "$4500", estadoCheque: "Creado", clc: "CLC2345", tipoPago: "Cheque" },
  { id: "3", nombre: "Luis Martínez", tipoNomina: "Nómina 8", monto: "$6200", estadoCheque: "Creado", clc: "CLC3456", tipoPago: "Cheque" },
  { id: "4", nombre: "Maria Fernández", tipoNomina: "Estructura", monto: "$5600", estadoCheque: "Creado", clc: "CLC4567", tipoPago: "Cheque" },
  { id: "5", nombre: "Pedro López", tipoNomina: "Base", monto: "$5000", estadoCheque: "Creado", clc: "CLC5678", tipoPago: "Cheque" },
  { id: "6", nombre: "Armando Paredes", tipoNomina: "Extraordinario", monto: "$2000", estadoCheque: "Creado", clc: "CLC5671", tipoPago: "Cheque" },
]

export default function ChequeManager() {
  const [chequesGenerados, setChequesGenerados] = useState(false)
  const [folios, setFolios] = useState(0)
  const [numCheques, setNumCheques] = useState(0)
  const [quincena, setQuincena] = useState('')
  const [empleadosGenerados, setEmpleadosGenerados] = useState([])
  const [tipoPago, setTipoPago] = useState("Cheque")
  
  const [selectedRows, setSelectedRows] = useState([]); // Estado para manejar las filas seleccionadas
  const [page, setPage] = useState(0); // Página de la tabla
  const [rowsPerPage, setRowsPerPage] = useState(5); // Filas por página
  const [openErrorDialog, setOpenErrorDialog] = useState(false); // Estado para manejar la visibilidad del modal de error
  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error

  const generarFolios = () => {
    if (!folios || numCheques <= 0) {
      alert("Por favor, ingresa un número de folio y cheques válidos.");
      return;
    }

    let nuevosEmpleados = [];

    // Obtener el último folio generado (si hay cheques generados)
    const ultimoFolioGenerado = empleadosGenerados.length > 0 ? Math.max(...empleadosGenerados.map(emp => emp.folio)) : 0;

    // Verificar si el folio inicial es mayor que el último folio generado
    if (folios <= ultimoFolioGenerado) {
      setErrorMessage(`El folio inicial debe ser mayor al último folio generado (${ultimoFolioGenerado}).`);
      setOpenErrorDialog(true);
      return; // No permitir la creación de cheques si el folio inicial es incorrecto
    }

    // Generar nuevos cheques con folios secuenciales
    for (let i = 0; i < numCheques && i < empleados.length; i++) {
      const nuevoFolio = folios + i;

      // Verificar si el folio es secuencial (sin saltos)
      if (nuevoFolio !== ultimoFolioGenerado + i + 1) {
        setErrorMessage(`El folio debe ser secuencial. Por ejemplo, el siguiente folio es ${ultimoFolioGenerado + i + 1}.`);
        setOpenErrorDialog(true);
        return; // No permitir la creación si el folio no es secuencial
      }

      nuevosEmpleados.push({
        ...empleados[i],
        folio: nuevoFolio,
        quincena,
        fecha: new Date().toLocaleDateString(),
        tipoPago: tipoPago
      });
    }

    setEmpleadosGenerados(prev => [...prev, ...nuevosEmpleados]); // Agregar los nuevos empleados sin borrar los anteriores
    setChequesGenerados(true); // Indicar que se generaron cheques
  };

  const reiniciarCampos = () => {
    setFolios(0);
    setNumCheques(0);
    setQuincena('');
  };

  const actualizarQuincena = (fecha) => {
    const fechaActual = new Date(fecha);
    const dia = fechaActual.getDate();
    const mes = fechaActual.toLocaleString('es-ES', { month: 'long' });

    if (dia >= 1 && dia <= 14) {
      setQuincena(`1ra quincena de ${mes}`);
    } else if (dia >= 15 && dia <= 31) {
      setQuincena(`2da quincena de ${mes}`);
    } else {
      setQuincena("Fecha no válida");
    }
  };

  const cambiarTipoPago = () => {
    if (empleadosGenerados.length === 0) {
      alert("No hay empleados generados para cambiar el tipo de pago.");
      return;
    }

    let empleadosActualizados = empleadosGenerados.map((empleado) => ({
      ...empleado,
      tipoPago: tipoPago
    }));

    setEmpleadosGenerados(empleadosActualizados);
  };

  // Calcular el último folio generado
  const ultimoFolio = empleadosGenerados.length > 0 ? Math.max(...empleadosGenerados.map(emp => emp.folio)) : null;

  // Manejar el cambio de selección de checkboxes
  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Manejo de la paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Resetear la página cuando cambias el número de filas por página
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
                <MenuItem value="compuesta">Compuesta</MenuItem>
                <MenuItem value="base">Finiquitos</MenuItem>
                <MenuItem value="extraordinario">Extraordinarios</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <Calendar
                dateFormat="yy-mm-dd"
                id="fechaActual"
                onChange={(e) => actualizarQuincena(e.value)}
                placeholder="Seleccione una fecha"
                className={styles.labels}
              />
            </FormControl>

            <TextField label="Quincena" value={quincena} placeholder="Quincena automática" InputProps={{ readOnly: true }} className={styles.labels} />
          </Box>

          <Box className={styles.section}>
            <TextField
              label="Folio Inicial"
              type="number"
              value={folios}
              onChange={(e) => setFolios(parseInt(e.target.value))}
              className={styles.labels}
            />
            <TextField
              label="Número de Cheques"
              type="number"
              value={numCheques}
              onChange={(e) => setNumCheques(parseInt(e.target.value))}
              className={styles.labels}
            />
          </Box>

          {/* Etiqueta para el último folio generado */}
          {ultimoFolio && (
            <Typography variant="h6" className={styles['last-folio-label']}>
              Último Folio Generado: {ultimoFolio}
            </Typography>
          )}

          <Box className={styles.tableSection}>
            <Typography variant="h5">PAGO A EMPLEADOS CON CHEQUE</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* Columna para el Checkbox */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedRows.length > 0 && selectedRows.length < empleadosGenerados.length}
                        checked={selectedRows.length === empleadosGenerados.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(empleadosGenerados.map((empleado) => empleado.id));
                          } else {
                            setSelectedRows([]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Id Empleado</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Tipo Nómina</TableCell>
                    <TableCell>F. Cheque</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Estado Cheque</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Quincena</TableCell>
                    <TableCell>Tipo de Pago</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {empleadosGenerados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((empleado, index) => (
                    <TableRow key={index}>
                      {/* Checkbox para cada fila */}
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(empleado.id)}
                          onChange={() => handleCheckboxChange(empleado.id)}
                        />
                      </TableCell>
                      <TableCell>{empleado.id}</TableCell>
                      <TableCell>{empleado.nombre}</TableCell>
                      <TableCell>{empleado.tipoNomina}</TableCell>
                      <TableCell>{empleado.folio}</TableCell>
                      <TableCell>{empleado.monto}</TableCell>
                      <TableCell>{empleado.estadoCheque}</TableCell>
                      <TableCell>{empleado.fecha}</TableCell>
                      <TableCell>{empleado.quincena}</TableCell>
                      <TableCell>{empleado.tipoPago}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginación */}
            <TablePagination
              count={empleadosGenerados.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>

          <Box className={styles.actions}>
            <Button variant="contained" color="primary" className={styles.buttons} onClick={generarFolios}>
              Generar
            </Button>
          </Box>

          <Box className={styles.extraButtons}>
            <Link href="./Cheques/CambioPago">
              <Button variant="outlined" className={styles.buttonsOut} onClick={cambiarTipoPago}>Cambio de Tipo de Pago</Button>
            </Link>
            <Link href="./Cheques/Poliza">
              <Button variant="contained" color="primary" className={styles.buttons}>Generar Póliza</Button>
            </Link>
          </Box>
        </Box>

        {/* Modal de error */}
        <Dialog
          open={openErrorDialog}
          onClose={() => setOpenErrorDialog(false)}
        >
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
}

