// src/app/CancelacionChequesForm/page.js

'use client';
import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider } from '@mui/material';
import TablaCancelados from '../../%Components/TablaCancelados/TablaCancelados'; // Importa el componente de tabla
import styles from './page.module.css';
import theme from '../../$tema/theme'; // Importa el tema

const initialEmpleados = [
  { id: "1", nombre: "Juan", apellido: "Pérez", nomina: "Nómina 8", clc: "123456" },
  { id: "2", nombre: "Ana", apellido: "Gómez", nomina: "Base", clc: "654321" },
  { id: "3", nombre: "Luis", apellido: "Martínez", nomina: "Estructura", clc: "112233" },
  { id: "4", nombre: "Marta", apellido: "Sánchez", nomina: "Nómina 8", clc: "223344" },
  { id: "5", nombre: "Carlos", apellido: "Ramírez", nomina: "Base", clc: "334455" }
];

export default function CancelacionCheques() {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosIds, setEmpleadosIds] = useState('');
  const [numeroCheque, setNumeroCheque] = useState('');
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [quincena, setQuincena] = useState('0');
  const [tipoNomina, setTipoNomina] = useState('');
  const [evidencia, setEvidencia] = useState(null);
  const [cancelados, setCancelados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

  useEffect(() => {
    setEmpleados(initialEmpleados);
  }, []);

  const autocompletarNomina = (idEmpleado) => {
    const empleado = empleados.find(emp => emp.id === idEmpleado);
    setTipoNomina(empleado ? empleado.nomina : '');
  };

  const agregarChequeCancelado = (empleado, numeroCheque, motivoCancelacion, quincena, evidencia) => {
    const newCancelado = {
      idEmpleado: empleado.id,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      nomina: empleado.nomina,
      quincena,
      clc: empleado.clc,
      numeroCheque,
      motivoCancelacion,
      fechaCancelacion: new Date().toLocaleDateString(),
      evidencia: evidencia ? evidencia.name : "No Subido"
    };
    setCancelados(prevCancelados => [...prevCancelados, newCancelado]);
  };

  const handleSubmit = () => {
    if (!empleadosIds || !numeroCheque || !motivoCancelacion || quincena === '0') {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (!evidencia) {
      alert("Por favor, sube un archivo de evidencia antes de cancelar.");
      return;
    }

    const empleado = empleados.find(emp => emp.id === empleadosIds);
    if (!empleado) {
      alert("ID de empleado no válido.");
      return;
    }

    setSelectedEmpleado(empleado);
    setModalVisible(true);
  };

  const confirmarCancelacion = () => {
    agregarChequeCancelado(selectedEmpleado, numeroCheque, motivoCancelacion, quincena, evidencia);
    setModalVisible(false);
    limpiarFormulario();
  };

  const cancelarCancelacion = () => {
    setModalVisible(false);
  };

  const limpiarFormulario = () => {
    setEmpleadosIds('');
    setNumeroCheque('');
    setMotivoCancelacion('');
    setQuincena('0');
    setTipoNomina('');
    setEvidencia(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.body}>
      <div className={styles.container}>
        <h1 className={styles.h1}>Cancelación de Cheques</h1>

        <form>
          <label className={styles.label}>ID de Empleados:</label>
          <input
            type="text"
            className={styles.input}
            value={empleadosIds}
            onChange={(e) => {
              setEmpleadosIds(e.target.value);
              autocompletarNomina(e.target.value);
            }}
            placeholder="Ingrese ID de empleados"
          />

          <label className={styles.label}>Número de Cheque:</label>
          <input
            type="text"
            className={styles.input}
            value={numeroCheque}
            onChange={(e) => setNumeroCheque(e.target.value)}
            placeholder="Número de cheque a cancelar"
          />

          <label className={styles.label}>Número de Quincena:</label>
          <select className={styles.select} value={quincena} onChange={(e) => setQuincena(e.target.value)}>
            <option value="0">Selecciona la quincena</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>

          <label className={styles.label}>Tipo de Nómina:</label>
          <input type="text" className={styles.input} value={tipoNomina} readOnly />

          <label className={styles.label}>Motivo de Cancelación:</label>
          <textarea
            className={styles.textarea}
            value={motivoCancelacion}
            onChange={(e) => setMotivoCancelacion(e.target.value)}
            placeholder="Describa el motivo de la cancelación"
          />

          <label className={styles.label}>Subir Evidencia (Opcional):</label>
          <input
            type="file"
            className={styles.input}
            accept=".jpg, .jpeg, .png, .pdf"
            onChange={(e) => setEvidencia(e.target.files[0])}
          />

          <button type="button" className={styles.actions} onClick={handleSubmit}>Cancelar Cheque</button>
        </form>

        {/* Usar el componente TablaCancelados y pasarle los datos */}
        {cancelados.length > 0 && (
          <TablaCancelados cancelados={cancelados} />
        )}

        {/* Modal de Confirmación */}
        <Dialog open={modalVisible} onClose={cancelarCancelacion}>
          <DialogTitle>Confirmación de Cancelación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas cancelar el cheque para el empleado{" "}
              <strong>{selectedEmpleado?.nombre} {selectedEmpleado?.apellido}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelarCancelacion} color="secondary" variant="contained">
              No
            </Button>
            <Button onClick={confirmarCancelacion} className={styles.actions} variant="contained">
              Sí
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
    </ThemeProvider>
    
  );
}
