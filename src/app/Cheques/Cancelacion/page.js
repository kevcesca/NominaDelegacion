"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import DateFilter from "../../%Components/DateFilter/DateFilter";
import EmpleadoSelector from "./components/EmpleadoSelector";
import ChequeInfo from "./components/ChequeInfo";
import EvidenciaUploader from "./components/EvidenciaUploader";
import MotivoCancelacion from "./components/MotivoCancelacion";
import ReusableTable3 from "../../%Components/ReusableTable3"; // Cambiado a ReusableTable3
import styles from "./page.module.css";
import API_BASE_URL, { API_USERS_URL } from "../../%Config/apiConfig";

const CancelacionCheques = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [chequeInfo, setChequeInfo] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState({ anio: "", quincena: "" });

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
      return data || [];
    } catch (error) {
      console.error("Error al obtener cancelaciones:", error);
      return [];
    }
  };

  // Renderizar columna de evidencia
  const renderEvidencia = (row) => {
    if (!row.evidencia) {
      return "Sin evidencia";
    }

    const downloadURL = `${API_BASE_URL}/download/evidencias?quincena=${fechaSeleccionada.quincena}&anio=${fechaSeleccionada.anio}&tipo=Evidencias&nombre=${row.evidencia}`;
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.open(downloadURL, "_blank")}
      >
        Descargar
      </Button>
    );
  };

  return (
    <Box className={styles.container}>
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
        <Button type="submit" variant="contained" color="error" fullWidth className={styles.submitButton}>
          Cancelar Cheque
        </Button>
      </form>

      {fechaSeleccionada.anio && fechaSeleccionada.quincena && (
        <Box mt={3}>
          <Typography variant="h6">Histórico de Cancelaciones</Typography>
          <ReusableTable3
            columns={[
              { label: "Folio Cheque", accessor: "folio_cheque" },
              { label: "ID Empleado", accessor: "id_empleado" },
              { label: "Fecha de Cancelación", accessor: "fecha_cancelacion" },
              { label: "Número de Quincena", accessor: "numero_quincena" },
              { label: "Motivo", accessor: "motivo_cancelacion" },
              { label: "Evidencia", accessor: "evidencia", body: renderEvidencia },
            ]}
            fetchData={fetchCancelaciones}
          />
        </Box>
      )}
    </Box>
  );
};

export default CancelacionCheques;
