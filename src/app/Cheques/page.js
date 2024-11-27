"use client"
import { useState } from 'react'
import styles from './page.module.css'
import Link from 'next/link';
import { Box, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, InputLabel, FormControl, ThemeProvider } from '@mui/material';
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

  const generarFolios = () => {
    if (!folios || numCheques <= 0) {
      alert("Por favor, ingresa un número de folio y cheques válidos.")
      return
    }

    let nuevosEmpleados = []
    for (let i = 0; i < numCheques && i < empleados.length; i++) {
      nuevosEmpleados.push({
        ...empleados[i],
        folio: folios + i,
        quincena,
        fecha: new Date().toLocaleDateString(),
        tipoPago: tipoPago
      })
    }

    setEmpleadosGenerados(nuevosEmpleados)
    setChequesGenerados(true)
  }

  const reiniciarTabla = () => {
    setEmpleadosGenerados([])
    setChequesGenerados(false)
    setFolios(0)
    setNumCheques(0)
    setQuincena('')
  }

  const actualizarQuincena = (fecha) => {
    const fechaActual = new Date(fecha)
    const dia = fechaActual.getDate()
    const mes = fechaActual.toLocaleString('es-ES', { month: 'long' })

    if (dia >= 1 && dia <= 14) {
      setQuincena(`1ra quincena de ${mes}`)
    } else if (dia >= 15 && dia <= 31) {
      setQuincena(`2da quincena de ${mes}`)
    } else {
      setQuincena("Fecha no válida")
    }
  }

  const cambiarTipoPago = () => {
    if (empleadosGenerados.length === 0) {
      alert("No hay empleados generados para cambiar el tipo de pago.")
      return
    }

    let empleadosActualizados = empleadosGenerados.map((empleado) => ({
      ...empleado,
      tipoPago: tipoPago
    }))

    setEmpleadosGenerados(empleadosActualizados)
  }

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

          <Box className={styles.tableSection}>
            <Typography variant="h5">PAGO A EMPLEADOS CON CHEQUE</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
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
                  {empleadosGenerados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        No hay cheques generados
                      </TableCell>
                    </TableRow>
                  ) : (
                    empleadosGenerados.map((empleado, index) => (
                      <TableRow key={index}>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box className={styles.actions}>
            {chequesGenerados ? (
              <Button variant="contained" color="secondary" className={styles.buttons} onClick={reiniciarTabla}>Generar Nuevos Cheques</Button>
            ) : (
              <Button variant="contained" color="primary" className={styles.buttons} onClick={generarFolios}>Generar</Button>
            )}
          </Box>

          <Box className={styles.extraButtons}>
            <Link href="./Cheques/CambioPago">
              <Button variant="outlined" className={styles.buttonsOut} onClick={cambiarTipoPago}>Cambio de Tipo de Pago</Button>
            </Link>
            <Link href="./Cheques/Poliza">
              <Button variant="contained" color="primary" className={styles.buttons} >Generar Póliza</Button>
            </Link>
          </Box>
        </Box>
      </ThemeProvider>

    </ProtectedView>

  )
}
