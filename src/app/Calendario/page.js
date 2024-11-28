'use client';

import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import Sidebar from './Sidebar';
import EventTable from './EventTable';
import styles from './page.module.css';
import API_BASE_URL from '../%Config/apiConfig';

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState(null); // Fecha seleccionada
  const [events, setEvents] = useState([]); // Eventos de la fecha seleccionada

  // Manejar selección de fecha
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Guardar evento (ahora con GET)
  const handleSaveEvent = async (date, newEvent) => {
    try {
      const [year, month, day] = date.split('-');
      const monthName = new Date(date).toLocaleString('en-US', { month: 'long' });
      const quincenaEvento = 'Primera quincena'; // Asumido que esto es fijo o calculado de alguna manera

      // Construcción de la URL para insertar un evento usando GET
      const url = `${API_BASE_URL}/insertarEventos?fechaEvento=${date}&quincenaEvento=${quincenaEvento}&mesEvento=${monthName}&anioEvento=${year}&tituloEvento=${newEvent.titulo_evento}&descripcionEvento=${newEvent.descripcion}`;

      const response = await fetch(url, {
        method: 'GET', // Usar GET en vez de POST
      });

      if (!response.ok) {
        throw new Error('Error al guardar el evento');
      }

      // Actualiza el estado local con el nuevo evento
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    } catch (error) {
      console.error('Error al guardar el evento:', error);
    }
  };

  // Cargar eventos de la fecha seleccionada al montar el componente
  useEffect(() => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-');
      const monthName = new Date(selectedDate).toLocaleString('en-US', { month: 'long' }); // Nombre del mes en inglés

      const fetchEvents = async () => {
        try {
          // Consultar eventos para la fecha seleccionada
          const response = await fetch(
            `${API_BASE_URL}/consultaEventosDia?dia=${day}&anio=${year}&mes=${monthName}`
          );
          const data = await response.json();

          // Actualizar los eventos del estado
          setEvents(data);
        } catch (error) {
          console.error('Error al obtener los eventos:', error);
        }
      };

      fetchEvents();
    }
  }, [selectedDate]); // Ejecutar cuando cambie la fecha seleccionada

  return (
    <div className={styles.container}>
      {/* Título */}
      <div className={styles.title}>
        <h1>CALENDARIO</h1>
      </div>

      {/* Contenido del calendario */}
      <div className={styles.containerContent}>
        <div className={styles.calendarContainer}>
          {/* Componente del calendario */}
          <Calendar
            selectedDate={selectedDate}
            events={events}
            onDateSelect={handleDateSelect}
          />

          {/* Barra lateral */}
          <Sidebar
            selectedDate={selectedDate}
            events={events}
            onSaveEvent={handleSaveEvent}
          />
        </div>

        {/* Tabla resumen */}
        <div className={styles.summaryContainer}>
          <EventTable events={events} />
        </div>
      </div>
    </div>
  );
}
