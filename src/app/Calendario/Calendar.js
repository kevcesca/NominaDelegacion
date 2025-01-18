'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Typography, Box, IconButton, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './page.module.css';
import API_BASE_URL from '../%Config/apiConfig';
import { Toast } from 'primereact/toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


// Tu código restante...



export default function Calendar({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
}) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [isDayEventsModalOpen, setIsDayEventsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ titulo_evento: '', descripcion: '' });
  const [isEditing, setIsEditing] = useState(false);
  const toastRef = useRef(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  const [titleError, setTitleError] = useState(false); // Estado para manejar el error del título




  useEffect(() => {
    fetchEventsForMonth();
  }, [currentMonth, currentYear]);

  // Cargar eventos del mes actual
  const fetchEventsForMonth = async () => {
    try {
      const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${new Date(currentYear, currentMonth + 1, 0).getDate()}`;
      const response = await fetch(`${API_BASE_URL}/rangoFechas?fechaInicio=${startDate}&fechaFin=${endDate}`);
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
    }
  };


  const handleDayDoubleClick = (date) => {
    setSelectedDate(date);
    setNewEvent({ titulo_evento: '', descripcion: '' }); // Reinicia los valores del evento
    setTitleError(false); // Reinicia el error del título al abrir el modal
    setIsAddEventModalOpen(true); // Abre el modal
  };

  // Cerrar modal de agregar evento
  const closeAddEventModal = () => {
    setIsAddEventModalOpen(false); // Cierra el modal
    setTitleError(false); // Reinicia el error del título al cerrar el modal
  };

  // Guardar evento nuevo
  const handleSaveEvent = async () => {
    const [year, month, day] = selectedDate.split('-');
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const monthNameInSpanish = monthNames[parseInt(month, 10) - 1];
    const dateObj = new Date(selectedDate);
    const dayNameInSpanish = dayNames[dateObj.getDay()];
    const esLaboral = true;  // Campo constante
    const estadoEvento = 'Pendiente';  // Estado por defecto

    // **Campos del nuevo evento, limpiados**
    const cleanedTitle = newEvent.titulo_evento.trim();  // Limpia espacios
    const cleanedDescription = newEvent.descripcion.trim();

    if (!cleanedTitle || !cleanedDescription) {
      toastRef.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El título y la descripción no pueden estar vacíos.', life: 3000 });
      return;
    }

    const idEmpleado = 101;  // Cambia según sea necesario
    const saveUrl = `${API_BASE_URL}/insertarEventos?fecha=${selectedDate}&diaSemana=${dayNameInSpanish}&mes=${monthNameInSpanish}&anio=${year}&esLaboral=true&id_empleado=${idEmpleado}&tituloEvento=${encodeURIComponent(cleanedTitle)}&descripcion=${encodeURIComponent(cleanedDescription)}&estadoEvento=${estadoEvento}`;

    try {
      const response = await fetch(saveUrl, { method: 'GET' });
      const data = await response.json().catch(() => null);

      if (response.ok) {
        if (data?.id) {
          const savedEvent = {
            ...newEvent,
            id: data.id,
            fecha: selectedDate,
          };
          setEvents((prev) => [...prev, savedEvent]);
        } else {
          await fetchEventsForMonth();  // Recargar si no devuelve el ID
        }

        setIsAddEventModalOpen(false);
        setNewEvent({ titulo_evento: '', descripcion: '' });
        toastRef.current.show({ severity: 'success', summary: 'Evento Guardado', detail: 'El evento se ha guardado correctamente.', life: 3000 });
      } else {
        throw new Error('Error al guardar el evento');
      }
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      toastRef.current.show({ severity: 'error', summary: 'Error al guardar', detail: 'No se pudo guardar el evento.', life: 3000 });
    }
  };



  // Funciones para abrir/cerrar el modal
  const openConfirmDeleteModal = (event) => {
    setEventToDelete(event);
    setIsConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setIsConfirmDeleteModalOpen(false);
  };

  // Abrir modal de "X más" para ver eventos del día con un clic
  const handleDayClick = (date) => {
    const dayEvents = events.filter((event) => event.fecha === date);
    setSelectedDate(date);
    setSelectedDayEvents(dayEvents);
    setIsDayEventsModalOpen(true);
  };

  // Mostrar detalles del evento al hacer doble clic en la etiqueta del evento
  const handleEventDoubleClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailModalOpen(true);
    setIsEditing(false); // Deshabilitar edición al abrir el modal
  };


  // Eliminar evento
  // Eliminar evento
  const handleDeleteEvent = async () => {
    if (!eventToDelete?.id) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/eliminarEvento?id=${eventToDelete.id}`,
        { method: 'GET' }
      );

      if (response.ok) {
        // Eliminar el evento de la lista principal
        setEvents((prev) =>
          prev.filter((event) => event.id !== eventToDelete.id)
        );

        // Eliminar el evento del modal de "X más"
        setSelectedDayEvents((prev) =>
          prev.filter((event) => event.id !== eventToDelete.id)
        );

        setIsEventDetailModalOpen(false);
        closeConfirmDeleteModal();

        toastRef.current.show({
          severity: 'success',
          summary: 'Evento Eliminado',
          detail: 'Evento eliminado correctamente.',
          life: 3000,
        });
      } else {
        throw new Error('Error al eliminar el evento');
      }
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      toastRef.current.show({
        severity: 'error',
        summary: 'Error al eliminar',
        detail: 'No se pudo eliminar el evento.',
        life: 3000,
      });
    }
  };



  // Actualizar evento
  // Actualizar evento
  const handleUpdateEvent = async () => {
    if (!selectedEvent?.id) {
      toastRef.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'El evento no tiene un ID válido.',
        life: 3000,
      });
      return;
    }

    try {
      const updateUrl = `${API_BASE_URL}/actualizarEvento?tituloEvento=${encodeURIComponent(
        selectedEvent.titulo_evento
      )}&descripcion=${encodeURIComponent(selectedEvent.descripcion)}&id=${selectedEvent.id}`;
      const response = await fetch(updateUrl, { method: 'GET' });

      if (response.ok) {
        // Crear una copia actualizada del evento
        const updatedEvent = {
          ...selectedEvent,
          titulo_evento: selectedEvent.titulo_evento,
          descripcion: selectedEvent.descripcion,
        };

        // Actualizar la lista de eventos principal
        setEvents((prev) =>
          prev.map((event) =>
            event.id === selectedEvent.id ? updatedEvent : event
          )
        );

        // Actualizar los eventos del modal de "X más"
        setSelectedDayEvents((prev) =>
          prev.map((event) =>
            event.id === selectedEvent.id ? updatedEvent : event
          )
        );

        setIsEditing(false);
        toastRef.current.show({
          severity: 'success',
          summary: 'Evento Actualizado',
          detail: 'Evento actualizado correctamente.',
          life: 3000,
        });
      } else {
        throw new Error('Error al actualizar el evento');
      }
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      toastRef.current.show({
        severity: 'error',
        summary: 'Error al actualizar',
        detail: 'No se pudo actualizar el evento.',
        life: 3000,
      });
    }
  };




  const renderDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter((event) => event.fecha === formattedDate);

      // Verificar si es el día actual
      const isToday =
        currentYear === todayYear &&
        currentMonth === todayMonth &&
        day === todayDate;

      cells.push(
        <td
          key={i}
          className={`${styles.day} ${day > 0 && day <= daysInMonth ? styles.activeDay : ''}`}
          onDoubleClick={() => day > 0 && day <= daysInMonth && handleDayDoubleClick(formattedDate)}
        >
          {day > 0 && day <= daysInMonth && (
            <>
              <div className={`${styles.dayNumber} ${isToday ? styles.circleToday : ''}`}>
                {day}
              </div>
              <div className={styles.eventContainer}>
                {dayEvents.slice(0, 3).map((event, index) => (
                  <div
                    key={index}
                    className={styles.eventTag}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleEventDoubleClick(event);
                    }}
                  >
                    {event.titulo_evento.length > 20
                      ? `${event.titulo_evento.slice(0, 20)}...` // Truncar títulos largos
                      : event.titulo_evento}
                  </div>
                ))}

                {dayEvents.length > 3 && (
                  <div
                    className={styles.viewMoreTag}
                    onClick={() => handleDayClick(formattedDate)}
                  >
                    {`${dayEvents.length - 3} más`}
                  </div>
                )}
              </div>
            </>
          )}
        </td>
      );
    }

    return cells;
  };

  return (
    <section className={styles.calendar}>
      <Toast ref={toastRef} />
      <h2 className={styles.header}>
        <button className={styles.navButton} onClick={onPrevMonth}>
          &lt;
        </button>
        {`${new Date(currentYear, currentMonth)
          .toLocaleString('es', { month: 'long' })
          .charAt(0)
          .toUpperCase()}${new Date(currentYear, currentMonth)
            .toLocaleString('es', { month: 'long' })
            .slice(1)} ${currentYear}`}
        <button className={styles.navButton} onClick={onNextMonth}>
          &gt;
        </button>
      </h2>


      <table className={styles.calendarTable}>
        <thead>
          <tr>
            <th>Dom</th>
            <th>Lun</th>
            <th>Mar</th>
            <th>Mié</th>
            <th>Jue</th>
            <th>Vie</th>
            <th>Sáb</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: renderDays().length / 7 }).map((_, rowIndex) => (
            <tr key={rowIndex}>{renderDays().slice(rowIndex * 7, rowIndex * 7 + 7)}</tr>
          ))}
        </tbody>
      </table>

      {/* Modal para agregar evento */}
      <Modal open={isAddEventModalOpen} onClose={closeAddEventModal}>
        <Box className={styles.modal}>
          {/* Botón de cierre en la esquina superior derecha */}
          <IconButton
            onClick={closeAddEventModal}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              color: '#9b1d1d',
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Agregar Evento
          </Typography>

          <TextField
            label="Título del Evento"
            value={newEvent.titulo_evento}
            onChange={(e) => {
              const maxLength = 60; // Límite de caracteres para el título
              const value = e.target.value.slice(0, maxLength); // Truncar al límite
              if (value.length === maxLength) {
                setTitleError(true); // Mostrar error si alcanza el límite
              } else {
                setTitleError(false); // Limpiar error si está dentro del límite
              }
              setNewEvent({ ...newEvent, titulo_evento: value }); // Actualizar el título
            }}
            fullWidth
            margin="normal"
            error={titleError} // Mostrar error visualmente
            helperText={titleError ? "El título no puede superar los 60 caracteres" : ""} // Mostrar el mensaje de error
          />

          <TextField
            label="Descripción"
            value={newEvent.descripcion}
            onChange={(e) => {
              const maxLength = 255; // Límite de caracteres para la descripción
              if (e.target.value.length <= maxLength) {
                setNewEvent({ ...newEvent, descripcion: e.target.value }); // Actualizar la descripción
              }
            }}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            helperText={`${newEvent.descripcion.length}/255 caracteres`} // Contador de caracteres
          />

          <Box textAlign="right" marginTop={2}>
            <Button onClick={handleSaveEvent} variant="contained" color="primary">
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>



      {/* Modal para ver eventos del día */}
      <Modal open={isDayEventsModalOpen} onClose={() => setIsDayEventsModalOpen(false)}>
        <Box className={styles.modal}>
          <Typography variant="h6">Eventos del día {selectedDate.split('-')[2]}</Typography>
          <Box className={styles.eventContainer}>
            {selectedDayEvents.map((event, index) => (
              <div
                key={index}
                className={styles.eventTag}
                onDoubleClick={() => handleEventDoubleClick(event)}
              >
                {event.titulo_evento}
              </div>
            ))}
          </Box>
        </Box>
      </Modal>


      {/* Modal para detalles del evento */}
      <Modal open={isEventDetailModalOpen} onClose={() => setIsEventDetailModalOpen(false)}>
        <Box className={styles.modal}>
          {/* Botones de cierre y retroceso en la esquina superior derecha */}
          <Box
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px', // Ahora la "X" estará en la esquina superior derecha
            }}
          >
            <IconButton
              onClick={() => setIsEventDetailModalOpen(false)} // Cierra el modal
              sx={{
                color: '#9b1d1d',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Si está en modo edición, muestra la flecha */}
          {isEditing && (
            <Box
              sx={{
                position: 'absolute',
                top: '8px',
                left: '8px', // Ahora la flecha estará en la esquina superior izquierda
              }}
            >
              <IconButton
                onClick={() => setIsEditing(false)} // Regresa al modo de solo lectura
                sx={{
                  color: '#9b1d1d',
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>
          )}


          <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Detalles del Evento
          </Typography>

          {selectedEvent && (
            <>
              {/* Campo del título */}
              {!isEditing ? (
                <Typography
                  variant="body1"
                  sx={{
                    marginBottom: 2,
                    fontWeight: 'bold',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                  }}
                >
                  <strong>Título:</strong> {selectedEvent.titulo_evento || 'Sin título'}
                </Typography>
              ) : (
                <TextField
                  label="Título"
                  value={selectedEvent.titulo_evento}
                  onChange={(e) => {
                    const maxLength = 60;
                    const value = e.target.value.slice(0, maxLength);
                    if (value.length === maxLength) {
                      setTitleError(true);
                    } else {
                      setTitleError(false);
                    }
                    setSelectedEvent({ ...selectedEvent, titulo_evento: value });
                  }}
                  fullWidth
                  margin="normal"
                  error={titleError}
                  helperText={titleError ? 'El título no puede superar los 60 caracteres' : ''}
                />
              )}

              {/* Campo de la descripción */}
              {!isEditing ? (
                <Typography
                  variant="body2"
                  sx={{
                    marginBottom: 2,
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                  }}
                >
                  <strong>Descripción:</strong> {selectedEvent.descripcion || 'Sin descripción'}
                </Typography>
              ) : (
                <TextField
                  label="Descripción"
                  value={selectedEvent.descripcion}
                  onChange={(e) => {
                    const maxLength = 255;
                    if (e.target.value.length <= maxLength) {
                      setSelectedEvent({ ...selectedEvent, descripcion: e.target.value });
                    }
                  }}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  helperText={`${selectedEvent.descripcion.length}/255 caracteres`}
                />
              )}

              {/* Información adicional */}
              <Typography>
                <strong>Quincena:</strong>{' '}
                {new Date(selectedEvent.fecha).getDate() <= 15 ? 'Primera Quincena' : 'Segunda Quincena'}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Fecha:</strong>{' '}
                {(() => {
                  const [year, month, day] = selectedEvent.fecha.split('-');
                  const monthNames = [
                    'enero',
                    'febrero',
                    'marzo',
                    'abril',
                    'mayo',
                    'junio',
                    'julio',
                    'agosto',
                    'septiembre',
                    'octubre',
                    'noviembre',
                    'diciembre',
                  ];
                  return `${parseInt(day)} de ${monthNames[parseInt(month) - 1]} de ${year}`;
                })()}
              </Typography>

              {/* Botones de acción */}
              <Box display="flex" justifyContent="space-between" marginTop={2}>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditing(true)} // Activar edición
                    sx={{
                      backgroundColor: '#9b1d1d',
                      '&:hover': { backgroundColor: '#7b1616' },
                    }}
                  >
                    Editar
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleUpdateEvent} // Guardar cambios
                  >
                    Guardar Cambios
                  </Button>
                )}

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => openConfirmDeleteModal(selectedEvent)} // Confirmar eliminación
                >
                  Borrar Evento
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>



      <Dialog open={isConfirmDeleteModalOpen} onClose={closeConfirmDeleteModal}>
        <DialogTitle>Confirmación de Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar este evento?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDeleteModal} variant="outlined" color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteEvent} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}

