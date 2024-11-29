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

  // Cargar eventos de la fecha seleccionada al montar el componente
  useEffect(() => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-');
      const dateObj = new Date(selectedDate);
      const monthName = dateObj.toLocaleString('en-US', { month: 'long' });
      const dayName = dateObj.toLocaleString('en-US', { weekday: 'long' });

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

      const getDayInSpanish = (dayName) => {
        switch (dayName) {
          case 'Sunday': return 'Domingo';
          case 'Monday': return 'Lunes';
          case 'Tuesday': return 'Martes';
          case 'Wednesday': return 'Miércoles';
          case 'Thursday': return 'Jueves';
          case 'Friday': return 'Viernes';
          case 'Saturday': return 'Sábado';
          default: return dayName;
        }
      };

      const fetchEvents = async () => {
        try {
          const monthInSpanish = getMonthInSpanish(monthName);
          const dayInSpanish = getDayInSpanish(dayName);

          const response = await fetch(
            `${API_BASE_URL}/consultaEventosDia?dia=${day}&anio=${year}&mes=${monthInSpanish}`
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

          {/* Barra lateral (ahora maneja la inserción de eventos) */}
          <Sidebar
            selectedDate={selectedDate}
            events={events}
            onSaveEvent={(date, newEvent) => {
              // Dejar que Sidebar maneje la inserción del evento
            }}
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
