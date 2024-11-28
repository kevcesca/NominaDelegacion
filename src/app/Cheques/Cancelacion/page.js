'use client';
import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider } from '@mui/material';
import { useRouter } from 'next/navigation';
import ProtectedView from "../../%Components/ProtectedView/ProtectedView"; // Ajusta la ruta según tu estructura
import styles from './page.module.css';
import theme from '../../$tema/theme';

const initialEmpleados = [
  { id: "1", nombre: "Juan", apellido: "Pérez", nomina: "Nómina 8", clc: "123456", numeroCheque: "23432", quincena: "1" },
  { id: "2", nombre: "Ana", apellido: "Gómez", nomina: "Base", clc: "654321", numeroCheque: "56789", quincena: "2" },
  // Agrega más empleados si es necesario
];

function CancelacionCheques() {
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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  const router = useRouter();

  useEffect(() => {
    setEmpleados(initialEmpleados);
  }, []);

  const autocompletarDatos = (idEmpleado) => {
    const empleado = empleados.find(emp => emp.id === idEmpleado);
    if (empleado) {
      setNumeroCheque(empleado.numeroCheque);
      setQuincena(empleado.quincena);
      setTipoNomina(empleado.nomina);
    } else {
      limpiarFormulario();
    }
  };

  const agregarChequeCancelado = (empleado, numeroCheque, motivoCancelacion, quincena, evidencia) => {
    const newCancelado = {
      idEmpleado: empleado.id,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      nomina: empleado.nomina,
      quincena,
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

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < Math.ceil(filteredCancelados.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter(rowId => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllRows = () => {
    const allRowIds = paginatedCancelados.map(row => row.idEmpleado);
    if (selectedRows.length === allRowIds.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allRowIds);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page
  };

  const handleReposicion = () => {
    router.push('/Cheques/Reposicion'); // Navega a la ruta de reposición
  };

  // Funciones de exportación
const handleExportCSV = () => {
  if (paginatedCancelados.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const csvData = paginatedCancelados.map(row => ({
    'ID Empleado': row.idEmpleado,
    Nombre: row.nombre,
    Apellido: row.apellido,
    'Tipo de Nómina': row.nomina,
    Quincena: row.quincena,
    CLC: row.clc,
    'Número de Cheque': row.numeroCheque,
    'Motivo de Cancelación': row.motivoCancelacion,
    'Fecha de Cancelación': row.fechaCancelacion,
    Evidencia: row.evidencia,
  }));

  const csv = [
    Object.keys(csvData[0]).join(','), // Encabezados dinámicos
    ...csvData.map(row => Object.values(row).join(',')), // Filas de datos
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'cancelados.csv');
};

const handleExportExcel = () => {
  if (paginatedCancelados.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(paginatedCancelados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cancelados');
  XLSX.writeFile(workbook, 'cancelados.xlsx');
};

const handleExportPDF = () => {
  if (paginatedCancelados.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const doc = new jsPDF();
  const tableData = paginatedCancelados.map(row => [
    row.idEmpleado,
    row.nombre,
    row.apellido,
    row.nomina,
    row.quincena,
    row.numeroCheque,
    row.motivoCancelacion,
    row.fechaCancelacion,
    row.evidencia,
  ]);

  doc.text('Cancelación de Cheques', 20, 10);
  doc.autoTable({
    head: [['ID Empleado', 'Nombre', 'Apellido', 'Tipo de Nómina', 'Quincena', 'Número de Cheque', 'Motivo de Cancelación', 'Fecha de Cancelación', 'Evidencia']],
    body: tableData,
  });
  doc.save('cancelados.pdf');
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
                autocompletarDatos(e.target.value);
              }}
              placeholder="Ingrese ID de empleados"
            />
            <label className={styles.label}>Folio del Cheque:</label>
            <input type="text" className={styles.input} value={numeroCheque} readOnly />
            <label className={styles.label}>Número de Quincena:</label>
            <input type="text" className={styles.input} value={quincena} readOnly />
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

         {/* Tabla existente */}
{cancelados.length > 0 && (
  <div className={styles.tableSection}>
    {/* Botones de exportación dentro de la tabla */}
    <div className={styles.exportButtons}>
      <Button onClick={handleExportCSV} variant="contained" className={styles.exportButton}>
        Exportar a CSV
      </Button>
      <Button onClick={handleExportExcel} variant="contained" className={styles.exportButton}>
        Exportar a Excel
      </Button>
      <Button onClick={handleExportPDF} variant="contained" className={styles.exportButton}>
        Exportar a PDF
      </Button>
    </div>

    <div className={styles.searchBar}>
      <input
        type="text"
        className={styles.searchInput}
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Buscar por Nombre o Apellido"
      />
    </div>

    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              onChange={handleSelectAllRows}
              checked={paginatedCancelados.every(row => selectedRows.includes(row.idEmpleado))}
            />
          </th>
          <th>ID Empleado</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Tipo de Nómina</th>
          <th>Quincena</th>
          <th>Número de Cheque</th>
          <th>Motivo de Cancelación</th>
          <th>Fecha de Cancelación</th>
          <th>Evidencia</th>
        </tr>
      </thead>
      <tbody>
        {paginatedCancelados.map((item) => (
          <tr key={item.idEmpleado}>
            <td>
              <input
                type="checkbox"
                checked={selectedRows.includes(item.idEmpleado)}
                onChange={() => handleSelectRow(item.idEmpleado)}
              />
            </td>
            <td>{item.idEmpleado}</td>
            <td>{item.nombre}</td>
            <td>{item.apellido}</td>
            <td>{item.nomina}</td>
            <td>{item.quincena}</td>
            <td>{item.numeroCheque}</td>
            <td>{item.motivoCancelacion}</td>
            <td>{item.fechaCancelacion}</td>
            <td>{item.evidencia}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className={styles.pagination}>
      <div className={styles.paginationControl}>
        <span className={styles.rowsText}>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className={styles.select}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
      <span className={styles.range}>
        {`${(currentPage - 1) * rowsPerPage + 1}–${Math.min(
          currentPage * rowsPerPage,
          empleados.length
        )} of ${empleados.length}`}
      </span>
      <button
        onClick={() => handlePageChange('prev')}
        disabled={currentPage === 1}
        className={styles.paginationButton}
      >
        &lt;
      </button>
      <button
        onClick={() => handlePageChange('next')}
        disabled={currentPage === Math.ceil(empleados.length / rowsPerPage)}
        className={styles.paginationButton}
      >
        &gt;
      </button>
    </div>

    <button type="button" className={styles.actions} onClick={handleReposicion}>
      Reposición de Cheque
    </button>
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

const ProtectedCancelacionCheques = () => (
  <ProtectedView requiredPermissions={["Cancelacion_Cheques", "Acceso_total"]}>
    <CancelacionCheques />
  </ProtectedView>
);

export default ProtectedCancelacionCheques;
