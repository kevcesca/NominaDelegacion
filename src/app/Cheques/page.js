"use client"
import { useState } from 'react'
import styles from './page.module.css'
import Link from 'next/link';



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

  // Función para manejar el clic en el botón de "Cambio de Tipo de Pago"
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
    <div className={styles.container}>
      <h1>Gestor de Cheques</h1>

      <div className={styles.section}>
        <div>
          <label>Tipo de Nómina</label>
          <select id="nomina">
            <option value="0">Selecciona el tipo de nómina</option>
            <option value="compuesta">Compuesta</option>
            <option value="base">Base</option>
            <option value="nomina8">Nómina 8</option>
            <option value="estructura">Estructura</option>
            <option value="extraordinario">Extraordinario</option>
          </select>
        </div>
        <div>
          <label>Fecha Actual:</label>
          <input
            type="date"
            id="fechaActual"
            onChange={(e) => actualizarQuincena(e.target.value)}
          />
        </div>
        <div>
          <label>Quincena:</label>
          <input type="text" value={quincena} placeholder="Quincena automática" readOnly />
        </div>
      </div>

      <div className={styles.section}>
        <div>
          <label>Folio Inicial:</label>
          <input
            type="number"
            value={folios}
            onChange={(e) => setFolios(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>Número de Cheques:</label>
          <input
            type="number"
            value={numCheques}
            onChange={(e) => setNumCheques(parseInt(e.target.value))}
          />
        </div>
      </div>


      <div className={styles.tableSection}>
        <h2>PAGO A EMPLEADOS CON CHEQUE</h2>
        <table>
          <thead>
            <tr>
              <th>Id Empleado</th>
              <th>Nombre</th>
              <th>Tipo Nómina</th>
              <th>F. Cheque</th>
              <th>Monto</th>
              <th>Estado Cheque</th>
              <th>Fecha</th>
              <th>Quincena</th>
              <th>CLC</th>
              <th>Tipo de Pago</th>
            </tr>
          </thead>
          <tbody>
            {empleadosGenerados.map((empleado, index) => (
              <tr key={index}>
                <td>{empleado.id}</td>
                <td>{empleado.nombre}</td>
                <td>{empleado.tipoNomina}</td>
                <td>{empleado.folio}</td>
                <td>{empleado.monto}</td>
                <td>{empleado.estadoCheque}</td>
                <td>{empleado.fecha}</td>
                <td>{empleado.quincena}</td>
                <td>{empleado.clc}</td>
                <td>{empleado.tipoPago}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.actions}>
        {chequesGenerados ? (
          <button className={styles.new} onClick={reiniciarTabla}>Generar Nuevos Cheques</button>
        ) : (
          <button className={styles.generate} onClick={generarFolios}>Generar</button>
        )}
      </div>

      <div className={styles.extraButtons}>
      <Link href="./Cheques/CambioPago">
        <button onClick={cambiarTipoPago} className={styles.cambiarTipoPago}>Cambio de Tipo de Pago</button>
        </Link>
        <Link href="./Cheques/Poliza">
        <button className={styles.generarPoliza}>Generar Póliza</button>
        </Link>
      </div>
    </div>
  )
}
