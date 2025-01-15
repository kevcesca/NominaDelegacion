'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Typography, Box, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './page.module.css';
import API_BASE_URL from '../%Config/apiConfig';
import { Toast } from 'primereact/toast';

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

  // Abrir modal para agregar evento al hacer doble clic en un día
  const handleDayDoubleClick = (date) => {
    setSelectedDate(date);
    setNewEvent({ titulo_evento: '', descripcion: '' });
    setIsAddEventModalOpen(true);
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
  const handleDeleteEvent = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/eliminarEvento?id=${id}`, { method: 'GET' });
      if (response.ok) {
        // Actualiza tanto el estado general como el de los eventos del día
        setEvents((prev) => prev.filter((event) => event.id !== id));
        setSelectedDayEvents((prev) => prev.filter((event) => event.id !== id)); // Actualizar el modal "X más"
        setIsEventDetailModalOpen(false);
        toastRef.current.show({ severity: 'success', summary: 'Evento Eliminado', detail: 'Evento eliminado correctamente.', life: 3000 });
      } else {
        throw new Error('Error al eliminar el evento');
      }
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      toastRef.current.show({ severity: 'error', summary: 'Error al eliminar', detail: 'No se pudo eliminar el evento.', life: 3000 });
    }
  };


  // Actualizar evento
  // Actualizar evento
  const handleUpdateEvent = async () => {
    if (!selectedEvent?.id) {
      toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'El evento no tiene un ID válido.', life: 3000 });
      return;
    }

    try {
      const updateUrl = `${API_BASE_URL}/actualizarEvento?tituloEvento=${encodeURIComponent(selectedEvent.titulo_evento)}&descripcion=${encodeURIComponent(selectedEvent.descripcion)}&id=${selectedEvent.id}`;
      const response = await fetch(updateUrl, { method: 'GET' });

      if (response.ok) {
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
        toastRef.current.show({ severity: 'success', summary: 'Evento Actualizado', detail: 'Evento actualizado correctamente.', life: 3000 });
      } else {
        throw new Error('Error al actualizar el evento');
      }
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      toastRef.current.show({ severity: 'error', summary: 'Error al actualizar', detail: 'No se pudo actualizar el evento.', life: 3000 });
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

      cells.push(
        <td
          key={i}
          className={`${styles.day} ${day > 0 && day <= daysInMonth ? styles.activeDay : ''}`}
          onDoubleClick={() => day > 0 && day <= daysInMonth && handleDayDoubleClick(formattedDate)}
        >
          {day > 0 && day <= daysInMonth && (
            <>
              <div className={styles.dayNumber}>{day}</div>
              <div className={styles.eventContainer}>
                {dayEvents.slice(0, 3).map((event, index) => (
                  <div
                    key={index}
                    className={styles.eventTag}
                    onDoubleClick={(e) => {
                      e.stopPropagation(); // Evitar que abra el modal de agregar evento
                      handleEventDoubleClick(event);
                    }}
                  >
                    {event.titulo_evento}
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
        {`${new Date(currentYear, currentMonth).toLocaleString('es', { month: 'long' })} ${currentYear}`}
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
      <Modal open={isAddEventModalOpen} onClose={() => setIsAddEventModalOpen(false)}>
        <Box className={styles.modal}>
          <Typography variant="h6">Agregar Evento</Typography>
          <TextField
            label="Título del Evento"
            value={newEvent.titulo_evento}
            onChange={(e) => setNewEvent({ ...newEvent, titulo_evento: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Descripción"
            value={newEvent.descripcion}
            onChange={(e) => setNewEvent({ ...newEvent, descripcion: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Box textAlign="right" marginTop={2}>
            <Button onClick={handleSaveEvent} variant="contained" color="primary" sx={{ marginRight: 1 }}>
              Guardar
            </Button>
            <Button onClick={() => setIsAddEventModalOpen(false)} variant="outlined" color="error">
              Cancelar
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
          <Typography variant="h6">Detalles del Evento</Typography>
          {selectedEvent && (
            <>
              {/* Título del evento */}
              {!isEditing ? (
                <Typography variant="body1" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                  <strong>Título:</strong> {selectedEvent.titulo_evento || 'Sin título'}
                </Typography>
              ) : (
                <TextField
                  label="Título"
                  value={selectedEvent.titulo_evento}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, titulo_evento: e.target.value })}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                />
              )}

              {/* Descripción del evento */}
              {!isEditing ? (
                <Typography variant="body2" sx={{ marginBottom: 2 }}>
                  <strong>Descripción:</strong> {selectedEvent.descripcion || 'Sin descripción'}
                </Typography>
              ) : (
                <TextField
                  label="Descripción"
                  value={selectedEvent.descripcion}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, descripcion: e.target.value })}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                />
              )}

              {/* Información adicional */}
              <Typography>
                <strong>Quincena:</strong> {new Date(selectedEvent.fecha).getDate() <= 15 ? 'Primera Quincena' : 'Segunda Quincena'}
              </Typography>
              <Typography>
                <strong>Fecha:</strong>{' '}
                {(() => {
                  const [year, month, day] = selectedEvent.fecha.split('-');
                  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                  return `${parseInt(day)} de ${monthNames[parseInt(month) - 1]} de ${year}`;
                })()}
              </Typography>


              {/* Botones de acción */}
              <Box display="flex" justifyContent="space-between" marginTop={2}>
                {!isEditing ? (
                  <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                ) : (
                  <Button variant="contained" color="success" onClick={handleUpdateEvent}>
                    Guardar Cambios
                  </Button>
                )}
                <Button variant="outlined" color="error" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                  Borrar Evento
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

    </section>
  );
}

