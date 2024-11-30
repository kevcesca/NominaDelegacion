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
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Mes actual
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Año actual

  // Cargar la fecha desde el localStorage si existe
  useEffect(() => {
    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      setSelectedDate(savedDate); // Si hay una fecha guardada, cargarla
    }
  }, []);

  // Manejar selección de fecha
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    localStorage.setItem('selectedDate', date); // Guardar la nueva fecha seleccionada en el localStorage
  };

  // Cargar eventos cuando cambie la fecha seleccionada
  useEffect(() => {
    const fetchEvents = async () => {
      if (selectedDate) {
        const [year, month, day] = selectedDate.split('-');
        const dateObj = new Date(selectedDate);
        const monthName = dateObj.toLocaleString('en-US', { month: 'long' });

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

        try {
          const monthInSpanish = getMonthInSpanish(monthName);
          const response = await fetch(
            `${API_BASE_URL}/consultaEventosDia?dia=${day}&anio=${year}&mes=${monthInSpanish}`
          );
          const data = await response.json();
          setEvents(data); // Actualizar los eventos del estado
        } catch (error) {
          console.error('Error al obtener los eventos:', error);
        }
      }
    };

    if (selectedDate) {
      fetchEvents(); // Solo se ejecuta si selectedDate está definido
    }
  }, [selectedDate]); // Ejecutar cuando cambie la fecha seleccionada

  // Cargar eventos al cambiar el mes
  useEffect(() => {
    const fetchMonthlyEvents = async () => {
      if (selectedDate) {
        const [year, month, day] = selectedDate.split('-');
        const dateObj = new Date(currentYear, currentMonth);
        const monthName = dateObj.toLocaleString('en-US', { month: 'long' });

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

        try {
          const monthInSpanish = getMonthInSpanish(monthName);
          setEvents([]); // Vaciar los eventos al cambiar el mes
          // Evitar borrar eventos cuando la fecha seleccionada está en el mismo mes
          if (!selectedDate.includes(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)) {
            setSelectedDate(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${'01'}`); // Cambiar al primer día del mes si se cambia el mes
          }
        } catch (error) {
          console.error('Error al obtener los eventos del mes:', error);
        }
      }
    };

    fetchMonthlyEvents();
  }, [currentMonth, currentYear, selectedDate]); // Ejecutar cuando cambie el mes o año

  // Cambiar al mes anterior
  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = prevMonth === 0 ? 11 : prevMonth - 1;
      const newYear = newMonth === 11 ? currentYear - 1 : currentYear;
      setCurrentYear(newYear); // Establecer el año actualizado
      return newMonth;
    });
  };

  // Cambiar al mes siguiente
  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = prevMonth === 11 ? 0 : prevMonth + 1;
      const newYear = newMonth === 0 ? currentYear + 1 : currentYear;
      setCurrentYear(newYear); // Establecer el año actualizado
      return newMonth;
    });
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
          {/* Componente del calendario */}
          <Calendar
            selectedDate={selectedDate}
            events={events}
            onDateSelect={handleDateSelect}
            currentMonth={currentMonth}
            currentYear={currentYear}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          {/* Barra lateral */}
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
