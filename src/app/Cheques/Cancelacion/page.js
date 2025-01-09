"use client";
import { useEffect, useState } from "react";
import { Box, Typography, TextField, Pagination, Button } from "@mui/material";
import DateFilter from "../../%Components/DateFilter/DateFilter";
import EmpleadoSelector from "./components/EmpleadoSelector";
import ChequeInfo from "./components/ChequeInfo";
import EvidenciaUploader from "./components/EvidenciaUploader";
import MotivoCancelacion from "./components/MotivoCancelacion";
import CancelacionesTable from "./components/CancelacionesTable";
import styles from "./page.module.css";
import API_BASE_URL, { API_USERS_URL } from "../../%Config/apiConfig";
import TablePagination from "@mui/material/TablePagination";


const CancelacionCheques = () => {
  // Estados principales
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [chequeInfo, setChequeInfo] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState({ anio: "", quincena: "" });

  // Estados de la tabla de cancelaciones
  const [cancelaciones, setCancelaciones] = useState([]);
  const [filteredCancelaciones, setFilteredCancelaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0); // Página inicial

  // Fetch de empleados
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await fetch(`${API_USERS_URL}/employee-ids-with-names`);
        if (!response.ok) throw new Error("Error al obtener empleados");
        const data = await response.json();
        setEmpleados(data);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
      }
    };
    fetchEmpleados();
  }, []);

  // Fetch de cheque del empleado seleccionado
  useEffect(() => {
    if (selectedEmpleado && fechaSeleccionada.anio && fechaSeleccionada.quincena) {
      const fetchCheque = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/chequesGenerados?quincena=${fechaSeleccionada.quincena}&id_empleado=${selectedEmpleado.id_empleado}&anio=${fechaSeleccionada.anio}`
          );
          if (!response.ok) throw new Error("Error al obtener cheque");
          const data = await response.json();
          setChequeInfo(data[0]);
        } catch (error) {
          console.error("Error al obtener información del cheque:", error);
        }
      };
      fetchCheque();
    }
  }, [selectedEmpleado, fechaSeleccionada]);

  // Subir evidencia y cancelar cheque
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!chequeInfo || !chequeInfo.folio_cheque) {
      alert("No se puede enviar la información sin un folio de cheque válido.");
      return;
    }

    const evidenciaURL = `${API_BASE_URL}/SubirEvidenciaCheques?quincena=${fechaSeleccionada.quincena}&anio=${fechaSeleccionada.anio}&vuser=kevin&tipo_carga=Evidencias&foliocheque=${chequeInfo.folio_cheque}`;
    const formData = new FormData();
    if (archivo) formData.append("file", archivo);

    try {
      // Subir la evidencia
      const evidenciaResponse = await fetch(evidenciaURL, { method: "POST", body: formData });
      if (!evidenciaResponse.ok) throw new Error("Error al subir la evidencia");

      const evidenciaData = await evidenciaResponse.json();
      if (!evidenciaData.fileName) throw new Error("No se recibió el nombre del archivo de evidencia");

      alert(evidenciaData.message);

      // Cancelar cheque
      const cancelarChequeURL = `${API_BASE_URL}/cancelarCheque?quincena=${fechaSeleccionada.quincena}&foliocheque=${chequeInfo.folio_cheque}&motivo=${encodeURIComponent(
        motivoCancelacion
      )}&evidencia=${evidenciaData.fileName}`;
      const cancelacionResponse = await fetch(cancelarChequeURL, { method: "GET" });

      if (!cancelacionResponse.ok) throw new Error("Error al cancelar el cheque");
      const cancelacionMessage = await cancelacionResponse.text();
      alert(`Cheque cancelado correctamente: ${cancelacionMessage}`);

      // Actualizar la tabla de cancelaciones
      fetchCancelaciones();
    } catch (error) {
      console.error("Error en el proceso:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Fetch de la tabla de cancelaciones
  const fetchCancelaciones = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/chequesCancelados/tabla?quincena=${fechaSeleccionada.quincena}&anio=${fechaSeleccionada.anio}`
      );
      if (!response.ok) throw new Error("Error al obtener cancelaciones");
      const data = await response.json();
      setCancelaciones(data);
      setFilteredCancelaciones(data);
    } catch (error) {
      console.error("Error al obtener cancelaciones:", error);
      setCancelaciones([]);
      setFilteredCancelaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fechaSeleccionada.anio && fechaSeleccionada.quincena) {
      fetchCancelaciones();
    }
  }, [fechaSeleccionada]);

  // Búsqueda en la tabla
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = cancelaciones.filter((item) =>
      Object.values(item).some((value) => value.toString().toLowerCase().includes(query))
    );
    setFilteredCancelaciones(filtered);
    setCurrentPage(1);
  };

  // Datos paginados
  const paginatedData = filteredCancelaciones.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reiniciar a la primera página
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };



  return (
    <Box className={styles.container}>
      {/* Filtros y formulario */}
      <DateFilter onDateChange={(data) => setFechaSeleccionada(data)} />
      <Typography variant="h5" className={styles.title}>
        Cancelación de Cheques
      </Typography>
      <form onSubmit={handleSubmit}>
        <EmpleadoSelector
          empleados={empleados}
          selectedEmpleado={selectedEmpleado}
          setSelectedEmpleado={setSelectedEmpleado}
          setChequeInfo={setChequeInfo}
        />
        <ChequeInfo chequeInfo={chequeInfo} />
        <MotivoCancelacion motivoCancelacion={motivoCancelacion} setMotivoCancelacion={setMotivoCancelacion} />
        <EvidenciaUploader archivo={archivo} setArchivo={setArchivo} />
        <Button
          type="submit"
          variant="contained"
          color="error"
          fullWidth
          className={styles.submitButton}
        >
          Cancelar Cheque
        </Button>
      </form>

      {/* Tabla de cancelaciones */}
      <Typography variant="h6" className={styles.subtitle} sx={{ marginTop: "2rem" }}>
        Historial de Cancelaciones
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Buscar cancelaciones..."
        value={searchQuery}
        onChange={handleSearch}
        fullWidth
        margin="normal"
      />
      <CancelacionesTable
        cancelaciones={paginatedData}
        loading={loading}
        fechaSeleccionada={fechaSeleccionada} // Pasamos la quincena y el año
      />
      <TablePagination
        component="div"
        count={Math.ceil(filteredCancelaciones.length / rowsPerPage)}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página"
      />


    </Box>
  );
};

export default CancelacionCheques;
