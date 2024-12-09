'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import API_BASE_URL from '../%Config/apiConfig';
import { Toast } from 'primereact/toast';
import AsyncButton from '../%Components/AsyncButton/AsyncButton';
import { Button } from "@mui/material"


export default function Sidebar({ selectedDate, onSaveEvent }) {
  const [events, setEvents] = useState([]); // Para guardar los eventos del día seleccionado
  const [eventTitle, setEventTitle] = useState(''); // Título del evento
  const [eventDescription, setEventDescription] = useState(''); // Descripción del evento
  const [loading, setLoading] = useState(false); // Para mostrar el estado de carga
  const toastRef = useRef(null); // Referencia al Toast para las notificaciones

  // Función para convertir el mes en inglés a español usando un switch
  const getMonthInSpanish = (monthName) => {
    switch (monthName) {
      case 'January': return 'Enero';
      case 'February': return 'Febrero';
      case 'March': return 'Marzo';
      case 'April': return 'Abril';
      case 'May': return 'Mayo';
      case 'June': return 'Junio';
      case 'July': return 'Julio';
      case 'August': return 'Agosto';
      case 'September': return 'Septiembre';
      case 'October': return 'Octubre';
      case 'November': return 'Noviembre';
      case 'December': return 'Diciembre';
      default: return monthName;
    }
  };

  // Función para convertir el día de la semana en inglés a español
  const getDayInSpanish = (dayName) => {
    if (dayName === 'Sunday') return 'Domingo';
    if (dayName === 'Monday') return 'Lunes';
    if (dayName === 'Tuesday') return 'Martes';
    if (dayName === 'Wednesday') return 'Miércoles';
    if (dayName === 'Thursday') return 'Jueves';
    if (dayName === 'Friday') return 'Viernes';
    if (dayName === 'Saturday') return 'Sábado';
    return dayName;
  };

  // Obtiene los eventos del día seleccionado
  useEffect(() => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-');
      const date = new Date(selectedDate);

      // Usamos las funciones para traducir el mes y el día a español
      const monthName = date.toLocaleString('en-US', { month: 'long' }); // Mes en inglés
      const dayName = date.toLocaleString('en-US', { weekday: 'long' }); // Día de la semana en inglés

      // Traducimos el mes y el día a español
      const monthInSpanish = getMonthInSpanish(monthName);
      const dayInSpanish = getDayInSpanish(dayName);

      const fetchEvents = async () => {
        setLoading(true);
        try {
          // Construcción de la URL para consultaEventosDia usando GET
          const url = `${API_BASE_URL}/consultaEventosDia?dia=${day}&anio=${year}&mes=${monthInSpanish}`; // Usamos el mes en español

          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setEvents(data); // Suponiendo que la respuesta es un arreglo de eventos
          } else {
            console.error('Error al obtener eventos:', response.statusText);
            setEvents([]); // Limpiamos los eventos en caso de error
          }
        } catch (error) {
          console.error('Error al obtener los eventos:', error);
          setEvents([]); // Limpiamos los eventos en caso de error
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
    }
  }, [selectedDate]); // El useEffect solo se ejecuta cuando cambia selectedDate

  // Función para manejar el guardado del evento
  const handleSave = async () => {
    if (!eventTitle || !eventDescription) {
      toastRef.current.show({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor, completa todos los campos.',
        life: 3000,
      });
      return;
    }

    const [year, month, day] = selectedDate.split('-');
    const monthName = new Date(selectedDate).toLocaleString('en-US', { month: 'long' });
    const monthInSpanish = getMonthInSpanish(monthName); // Convertir mes a español
    const dayName = new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' });
    const dayInSpanish = getDayInSpanish(dayName); // Convertir día a español
    const esLaboral = true;
    const estadoEvento = 'Pendiente';

    try {
      const url = `${API_BASE_URL}/insertarEventos?fecha=${selectedDate}&diaSemana=${dayInSpanish}&mes=${monthInSpanish}&anio=${year}&esLaboral=${esLaboral}&dia=${day}&tituloEvento=${encodeURIComponent(eventTitle)}&descripcion=${encodeURIComponent(eventDescription)}&estadoEvento=${estadoEvento}`;

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error al guardar el evento');
      }

      // Nuevo evento guardado
      const newEvent = {
        titulo_evento: eventTitle,
        descripcion: eventDescription,
        dia: day,
        mes: monthInSpanish,
        anio: year,
        dia_del_evento: dayInSpanish,
      };

      // Actualizar los eventos en el componente padre (calendario)
      onSaveEvent(newEvent);

      // Añadir el nuevo evento a la lista de eventos del día seleccionado
      setEvents((prevEvents) => [...prevEvents, newEvent]);

      // Mostrar notificación de éxito
      toastRef.current.show({
        severity: 'success',
        summary: 'Evento Guardado',
        detail: 'El evento se ha guardado exitosamente.',
        life: 3000,
      });

      // Reiniciar los campos del formulario
      setEventTitle('');
      setEventDescription('');
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      // Mostrar notificación de error
      toastRef.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un problema al guardar el evento. Inténtalo de nuevo.',
        life: 3000,
      });
    }
  };

  return (
    <aside className={styles.sidebar}>
      {/* Componente Toast para mostrar las notificaciones */}
      <Toast ref={toastRef} />

      <h3>Eventos para esta fecha</h3>
      {selectedDate ? (
        <>
          {/* Fecha seleccionada */}
          <p>
            <strong>Fecha seleccionada:</strong>
            <br />
            {selectedDate}
          </p>

          {/* Mostrar los eventos de la fecha seleccionada */}
          {loading ? (
            <p>Cargando eventos...</p>
          ) : (
            <ul className={styles.eventList}>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <li key={index} className={styles.event}>
                    <strong>{event.titulo_evento}</strong>: {event.descripcion}
                    <br />
                    <span className={styles.quincena}>Quincena: {event.quincena}</span>
                    <br />
                    <span className={styles.date}>
                      {/* Mostrar el día y mes en español */}
                      {getDayInSpanish(event.dia_del_evento)}, {event.dia} de {getMonthInSpanish(event.mes)} {event.anio}
                    </span>
                  </li>
                ))
              ) : (
                <p>No hay eventos para esta fecha.</p>
              )}
            </ul>
          )}

          {/* Formulario para agregar un nuevo evento */}
          <div className={styles.formSection}>
            <label htmlFor="eventTitle">Título del Evento:</label>
            <input
              type="text"
              id="eventTitle"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <label htmlFor="eventDescription">Descripción:</label>
            <textarea
              id="eventDescription"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <AsyncButton
              onClick={handleSave}
              variant="contained"
              color="primary"
              className={styles.btnSave}
            >
              <Button className={styles.btnSave}>
                Guardar Evento
              </Button>
            </AsyncButton>
            <AsyncButton
              onClick= {() => { setEventTitle(''); setEventDescription(''); }}
              variant="contained"
              color="primary"
              className={styles.btnCancel}
              >
                 <Button className={styles.btnCancel} >
              Cancelar
            </Button>
            </AsyncButton>
           </div>
        </>
      ) : (
        <p>Por favor, selecciona una fecha para ver los eventos.</p>
      )}
    </aside>
  );
}
