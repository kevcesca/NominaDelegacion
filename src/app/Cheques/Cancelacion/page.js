"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import DateFilter from "../../%Components/DateFilter/DateFilter";
import styles from "./page.module.css";
import API_BASE_URL, { API_USERS_URL } from "../../%Config/apiConfig";
import EmpleadoSelector from "./components/EmpleadoSelector";
import ChequeInfo from "./components/ChequeInfo";
import EvidenciaUploader from "./components/EvidenciaUploader";
import MotivoCancelacion from "./components/MotivoCancelacion";

const CancelacionCheques = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [chequeInfo, setChequeInfo] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState({
    anio: "",
    quincena: "",
  });

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await fetch(`${API_USERS_URL}/employee-ids-with-names`);
        if (!response.ok) {
          throw new Error(`Error al obtener empleados: ${response.statusText}`);
        }
        const data = await response.json();
        setEmpleados(data);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
      }
    };

    fetchEmpleados();
  }, []);

  useEffect(() => {
    if (selectedEmpleado && fechaSeleccionada.anio && fechaSeleccionada.quincena) {
      const fetchCheque = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/chequesGenerados?quincena=${fechaSeleccionada.quincena}&id_empleado=${selectedEmpleado.id_empleado}&anio=${fechaSeleccionada.anio}`
          );
          if (!response.ok) {
            throw new Error(`Error al obtener cheque: ${response.statusText}`);
          }
          const data = await response.json();
          setChequeInfo(data[0]);
        } catch (error) {
          console.error("Error al obtener información del cheque:", error);
        }
      };

      fetchCheque();
    }
  }, [selectedEmpleado, fechaSeleccionada]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!chequeInfo || !chequeInfo.folio_cheque) {
      alert("No se puede enviar la información sin un folio de cheque válido.");
      return;
    }
  
    const evidenciaURL = `${API_BASE_URL}/SubirEvidenciaCheques?quincena=${fechaSeleccionada.quincena}&anio=${fechaSeleccionada.anio}&vuser=kevin&tipo_carga=Evidencias&foliocheque=${chequeInfo.folio_cheque}`;
    const formData = new FormData();
    if (archivo) {
      formData.append("file", archivo);
    }
  
    try {
      // Subir la evidencia
      const evidenciaResponse = await fetch(evidenciaURL, {
        method: "POST",
        body: formData,
      });
  
      if (!evidenciaResponse.ok) {
        throw new Error(`Error al subir la evidencia: ${evidenciaResponse.statusText}`);
      }
  
      const evidenciaData = await evidenciaResponse.json();
  
      if (!evidenciaData.fileName) {
        throw new Error("No se recibió el nombre del archivo de evidencia.");
      }
  
      alert(evidenciaData.message);
  
      // Cancelar cheque
      const cancelarChequeURL = `${API_BASE_URL}/cancelarCheque?quincena=${fechaSeleccionada.quincena}&foliocheque=${chequeInfo.folio_cheque}&motivo=${encodeURIComponent(
        motivoCancelacion
      )}&evidencia=${evidenciaData.fileName}`;
  
      const cancelacionResponse = await fetch(cancelarChequeURL, {
        method: "GET",
      });
  
      if (!cancelacionResponse.ok) {
        throw new Error(`Error al cancelar el cheque: ${cancelacionResponse.statusText}`);
      }
  
      // Verificar el Content-Type de la respuesta
      const contentType = cancelacionResponse.headers.get("Content-Type");
      let cancelacionMessage = "";
  
      if (contentType && contentType.includes("application/json")) {
        const cancelacionData = await cancelacionResponse.json();
        cancelacionMessage = cancelacionData.message;
      } else if (contentType && contentType.includes("text/plain")) {
        cancelacionMessage = await cancelacionResponse.text();
      } else {
        throw new Error("Respuesta desconocida del servidor.");
      }
  
      alert(`Cheque cancelado correctamente: ${cancelacionMessage}`);
    } catch (error) {
      console.error("Error en el proceso:", error);
      alert(`Error: ${error.message}`);
    }
  };  

  return (
    <Box className={styles.container}>
      <DateFilter
        onDateChange={(data) => {
          setFechaSeleccionada(data);
        }}
      />
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
        <MotivoCancelacion
          motivoCancelacion={motivoCancelacion}
          setMotivoCancelacion={setMotivoCancelacion}
        />
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
    </Box>
  );
};

export default CancelacionCheques;
