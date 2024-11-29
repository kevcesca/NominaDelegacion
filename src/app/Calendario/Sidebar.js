'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import API_BASE_URL from '../%Config/apiConfig';

export default function Sidebar({ selectedDate, onSaveEvent }) {
  const [events, setEvents] = useState([]); // Para guardar los eventos del día
  const [eventTitle, setEventTitle] = useState(''); // Título del evento
  const [eventDescription, setEventDescription] = useState(''); // Descripción del evento
  const [loading, setLoading] = useState(false); // Para mostrar el estado de carga

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
          }
        } catch (error) {
          console.error('Error al obtener los eventos:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
    }
  }, [selectedDate]);

  // Manejar la acción de guardar un nuevo evento
  const handleSave = async () => {
    if (!eventTitle || !eventDescription) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const [year, month, day] = selectedDate.split('-');
    const monthName = new Date(selectedDate).toLocaleString('en-US', { month: 'long' }); // Nombre del mes en inglés
    const monthInSpanish = getMonthInSpanish(monthName); // Convertir mes a español
    const dayName = new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' }); // Día de la semana en inglés
    const dayInSpanish = getDayInSpanish(dayName); // Convertir día a español
    const esLaboral = true; // Esto lo deberás definir según tu lógica, si es laboral o no.
    const estadoEvento = 'Pendiente'; // Puedes ajustar el estado si lo necesitas

    try {
      // Construcción de la URL para insertar un evento usando GET
      const url = `${API_BASE_URL}/insertarEventos?fecha=${selectedDate}&diaSemana=${dayInSpanish}&mes=${monthInSpanish}&anio=${year}&esLaboral=${esLaboral}&dia=${day}&tituloEvento=${encodeURIComponent(eventTitle)}&descripcion=${encodeURIComponent(eventDescription)}&estadoEvento=${estadoEvento}`;

      const response = await fetch(url, {
        method: 'GET', // Usamos GET para insertar el evento
      });

      if (!response.ok) {
        throw new Error('Error al guardar el evento');
      }

      // Actualizar eventos en el estado principal (pasar el evento a la vista principal)
      onSaveEvent(selectedDate, { titulo_evento: eventTitle, descripcion: eventDescription });

      // Reiniciar los campos del formulario
      setEventTitle('');
      setEventDescription('');
    } catch (error) {
      console.error('Error al guardar el evento:', error);
    }
  };

  return (
    <aside className={styles.sidebar}>
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
              placeholder="Título del evento"
            />

            <label htmlFor="eventDescription">Descripción del Evento:</label>
            <textarea
              id="eventDescription"
              rows="3"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Descripción del evento"
            />
          </div>

          {/* Botones de acción */}
          <div className={styles.buttons}>
            <button className={styles.btnSave} onClick={handleSave}>
              Guardar Evento
            </button>
            <button
              className={styles.btnCancel}
              onClick={() => {
                setEventTitle('');
                setEventDescription('');
              }}
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        // Mensaje si no hay una fecha seleccionada
        <p>Selecciona una fecha para ver o añadir eventos.</p>
      )}
    </aside>
  );
}
