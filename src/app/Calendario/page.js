'use client';

import React, { useState } from 'react';
import Calendar from './Calendar';
import Sidebar from './Sidebar';
import SummaryTable from './SummaryTable';
import styles from './page.module.css';

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState(null); // Fecha seleccionada
  const [events, setEvents] = useState({}); // Eventos guardados

  // Manejar selección de fecha
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Guardar eventos
  const handleSaveEvent = (date, newEvent) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [date]: [...(prevEvents[date] || []), newEvent],
    }));
  };

  return (
    <div className={styles.container}>
      {/* Título */}
      <div className={styles.title}>
        <h1>CALENDARIO</h1>
      </div>

      {/* Contenido del calendario */}
      <div className={styles.containerContent}>
        <div className={styles.calendarContainer}>
          {/* Calendario */}
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
