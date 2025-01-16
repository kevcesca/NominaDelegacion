"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import DateFilter from "../../%Components/DateFilter/DateFilter";
import EmpleadoSelector from "./components/EmpleadoSelector";
import ChequeInfo from "./components/ChequeInfo";
import EvidenciaUploader from "./components/EvidenciaUploader";
import MotivoCancelacion from "./components/MotivoCancelacion";
import ReusableTable from "../../%Components/ReusableTable/ReusableTable"; // Importar la tabla reutilizable
import styles from "./page.module.css";
import API_BASE_URL, { API_USERS_URL } from "../../%Config/apiConfig";

const CancelacionCheques = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [chequeInfo, setChequeInfo] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState({ anio: "", quincena: "" });
  const [loading, setLoading] = useState(false);

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
      const evidenciaResponse = await fetch(evidenciaURL, { method: "POST", body: formData });
      if (!evidenciaResponse.ok) throw new Error("Error al subir la evidencia");

      const evidenciaData = await evidenciaResponse.json();
      if (!evidenciaData.fileName) throw new Error("No se recibió el nombre del archivo de evidencia");

      alert(evidenciaData.message);

      const cancelarChequeURL = `${API_BASE_URL}/cancelarCheque?quincena=${fechaSeleccionada.quincena}&foliocheque=${chequeInfo.folio_cheque}&motivo=${encodeURIComponent(
        motivoCancelacion
      )}&evidencia=${evidenciaData.fileName}`;
      const cancelacionResponse = await fetch(cancelarChequeURL, { method: "GET" });

      if (!cancelacionResponse.ok) throw new Error("Error al cancelar el cheque");
      const cancelacionMessage = await cancelacionResponse.text();
      alert(`Cheque cancelado correctamente: ${cancelacionMessage}`);

      fetchCancelaciones(); // Actualiza la tabla de cancelaciones
    } catch (error) {
      console.error("Error en el proceso:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Fetch de la tabla de cancelaciones
  const fetchCancelaciones = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chequesCancelados/tabla?quincena=${fechaSeleccionada.quincena}&anio=${fechaSeleccionada.anio}`
      );
      if (!response.ok) throw new Error("Error al obtener cancelaciones");
      const data = await response.json();
      console.log("Datos de cancelaciones:", data);
      return data || [];
    } catch (error) {
      console.error("Error al obtener cancelaciones:", error);
      return [];
    }
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
      {fechaSeleccionada.anio && fechaSeleccionada.quincena && (
        <Box mt={3}>
          <Typography variant="h6">Histórico de Cancelaciones</Typography>
          <ReusableTable
            columns={[
              { label: "Folio Cheque", accessor: "folio_cheque" },
              { label: "ID Empleado", accessor: "id_empleado" },
              { label: "Nombre", accessor: "nombre_empleado" },
              { label: "Fecha de Cancelación", accessor: "fecha_cancelacion" },
              { label: "Motivo", accessor: "motivo_cancelacion" },
              { label: "Evidencia", accessor: "evidencia" },
            ]}
            fetchData={fetchCancelaciones}
            showExportButtons
            selectable
            editable={false}  // Se desactiva la edición
            deletable={false}  // Se desactiva la opción de eliminar
            insertable={false}  // Se desactiva la opción de agregar
          />

        </Box>
      )}
    </Box>
  );
};

export default CancelacionCheques;

