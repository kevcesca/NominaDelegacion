'use client';
import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider } from '@mui/material';
import { useRouter } from 'next/navigation'; // Importa useRouter para manejar la navegación
import styles from './page.module.css';
import theme from '../../$tema/theme';

const initialEmpleados = [
  { id: "1", nombre: "Juan", apellido: "Pérez", nomina: "Nómina 8", clc: "123456", numeroCheque: "23432", quincena: "1", motivoCancelacion: "Duplicado", fechaCancelacion: "15/11/2024", evidencia: "documento.pdf" },
  { id: "2", nombre: "Ana", apellido: "Gómez", nomina: "Base", clc: "654321", numeroCheque: "56789", quincena: "2", motivoCancelacion: "Error", fechaCancelacion: "15/11/2024", evidencia: "evidencia.jpg" }
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTable, setShowTable] = useState(false);
  const rowsPerPage = 5;

  const router = useRouter(); // Inicializa el router

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
    setShowTable(true); // Muestra la tabla después de agregar datos
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCancelados = cancelados.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCancelados = filteredCancelados.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredCancelados.map((item) => item.idEmpleado));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleReposicion = () => {
    router.push('/Cheques/Reposicion'); // Navega a la ruta "/reposicion"
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.body}>
        <div className={styles.container}>
          <h1 className={styles.h1}>Cancelación de Cheques</h1>

          <form>
            <label className={styles.label}>ID de Empleados:</label>
            <input type="text" className={styles.input} value={empleadosIds} onChange={(e) => { setEmpleadosIds(e.target.value); autocompletarNomina(e.target.value); }} placeholder="Ingrese ID de empleados" />
            <label className={styles.label}>Número de Cheque:</label>
            <input type="text" className={styles.input} value={numeroCheque} onChange={(e) => setNumeroCheque(e.target.value)} placeholder="Número de cheque a cancelar" />
            <label className={styles.label}>Número de Quincena:</label>
            <select className={styles.select} value={quincena} onChange={(e) => setQuincena(e.target.value)}>
              <option value="0">Selecciona la quincena</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            <label className={styles.label}>Tipo de Nómina:</label>
            <input type="text" className={styles.input} value={tipoNomina} readOnly />
            <label className={styles.label}>Motivo de Cancelación:</label>
            <textarea className={styles.textarea} value={motivoCancelacion} onChange={(e) => setMotivoCancelacion(e.target.value)} placeholder="Describa el motivo de la cancelación" />
            <label className={styles.label}>Subir Evidencia (Opcional):</label>
            <input type="file" className={styles.input} accept=".jpg, .jpeg, .png, .pdf" onChange={(e) => setEvidencia(e.target.files[0])} />
            <button type="button" className={styles.actions} onClick={handleSubmit}>Cancelar Cheque</button>
          </form>

          {showTable && (
            <div className={styles.tableSection}>
              <div className={styles.searchBar}>
                <input type="text" className={styles.searchInput} value={searchTerm} onChange={handleSearch} placeholder="Buscar por Nombre, Apellido" />
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th><input type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === filteredCancelados.length && filteredCancelados.length > 0} /></th>
                    <th>ID Empleado</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Tipo de Nómina</th>
                    <th>Quincena</th>
                    <th>CLC</th>
                    <th>Número de Cheque</th>
                    <th>Motivo de Cancelación</th>
                    <th>Fecha de Cancelación</th>
                    <th>Evidencia</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCancelados.map((item) => (
                    <tr key={item.idEmpleado}>
                      <td><input type="checkbox" checked={selectedRows.includes(item.idEmpleado)} onChange={() => handleSelectRow(item.idEmpleado)} /></td>
                      <td>{item.idEmpleado}</td>
                      <td>{item.nombre}</td>
                      <td>{item.apellido}</td>
                      <td>{item.nomina}</td>
                      <td>{item.quincena}</td>
                      <td>{item.clc}</td>
                      <td>{item.numeroCheque}</td>
                      <td>{item.motivoCancelacion}</td>
                      <td>{item.fechaCancelacion}</td>
                      <td>{item.evidencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.pagination}>
                <button onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}>&lt;&lt;</button>
                <span> Página {currentPage} </span>
                <button onClick={() => handlePageChange(currentPage + 1)}>&gt;&gt;</button>
              </div>

              <button className={styles.actions} onClick={handleReposicion}>Reposición de Cheque</button>
            </div>
          )}
        </div>

        <Dialog open={modalVisible} onClose={cancelarCancelacion}>
          <DialogTitle>Confirmación de Cancelación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas cancelar el cheque para el empleado{" "}
              <strong>{selectedEmpleado?.nombre} {selectedEmpleado?.apellido}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelarCancelacion} color="secondary" variant="contained">No</Button>
            <Button onClick={confirmarCancelacion} className={styles.actions} variant="contained">Sí</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
