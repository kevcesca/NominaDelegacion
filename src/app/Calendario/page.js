'use client';

import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import Sidebar from './Sidebar';
import SummaryTable from './SummaryTable';
import styles from './page.module.css';
import { API_USERS_URL } from '../%Config/apiConfig';

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState(null); // Fecha seleccionada
  const [events, setEvents] = useState({}); // Eventos organizados por fecha

  // Manejar selección de fecha
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Guardar evento (envía al backend y actualiza el estado local)
  const handleSaveEvent = async (date, newEvent) => {
    try {
      const response = await fetch(`${API_USERS_URL}/calendario/evento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newEvent, fecha: date, id_creador: 1 }), // Cambia id_creador según tu lógica
      });

      if (!response.ok) {
        throw new Error('Error al guardar el evento');
      }

      // Actualiza el estado local
      setEvents((prevEvents) => ({
        ...prevEvents,
        [date]: [...(prevEvents[date] || []), newEvent],
      }));
    } catch (error) {
      console.error('Error al guardar el evento:', error);
    }
  };

  // Cargar eventos desde el backend al montar el componente
  useEffect(() => {
    const fetchEvents = async () => {
      const inicio = new Date().toISOString().split('T')[0]; // Fecha actual (inicio)
      const fin = new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .split('T')[0]; // Fecha de fin (mes siguiente)

      try {
        const response = await fetch(`${API_USERS_URL}/calendario/eventos?inicio=${inicio}&fin=${fin}`);
        const data = await response.json();

        // Organiza los eventos por fecha
        const organizedEvents = data.reduce((acc, event) => {
          if (!acc[event.fecha]) {
            acc[event.fecha] = [];
          }
          acc[event.fecha].push(event);
          return acc;
        }, {});

        setEvents(organizedEvents);
      } catch (error) {
        console.error('Error al cargar los eventos:', error);
      }
    };

    fetchEvents();
  }, []);

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
            events={events[selectedDate] || []}
            onSaveEvent={handleSaveEvent}
          />
        </div>

        {/* Tabla resumen */}
        <div className={styles.summaryContainer}>
          <SummaryTable events={events} />
        </div>
      </div>
    </div>
  );
}
