'use client';

import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import ReusableTableCalendar from "../%Components/ReusableTableCalendar/ReusableTableCalendar";
import styles from "../%Components/ReusableTableCalendar/ReusableTableCalendar.module.css";
import API_BASE_URL from '../%Config/apiConfig';
import { Alert } from '@mui/material'; // Importar Alert de Material-UI

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState(null); // Fecha seleccionada
  const [events, setEvents] = useState([]); // Eventos del mes seleccionado
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Mes actual
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Año actual

  // Definir columnas fijas para la tabla
  const columns = [
    { label: 'ID', accessor: 'id' },
    { label: 'Título del Evento', accessor: 'titulo_evento' },
    { label: 'Descripción', accessor: 'descripcion' },
    { label: 'Fecha', accessor: 'fecha' },
  ];

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
        const [year, month, day] = selectedDate.split('-'); // Año, mes y día
        const dateObj = new Date(selectedDate);
        const monthNameInEnglish = dateObj.toLocaleString('en-US', { month: 'long' });
  
        // Función para convertir nombre del mes al español
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
  
        const monthInSpanish = getMonthInSpanish(monthNameInEnglish);
  
        try {
          // Aquí el servicio manda el mes en formato numérico y el nombre del mes
          const response = await fetch(
            `${API_BASE_URL}/consultaEventosDia?dia=${day}&anio=${year}&mes=${String(month).padStart(2, '0')}&nombre_mes=${monthInSpanish}`
          );
  
          if (!response.ok) {
            throw new Error('Error en la solicitud');
          }
  
          const data = await response.json();
          console.log("Eventos recibidos:", data); // Verificar en consola qué eventos se reciben
  
          // Verifica si los datos tienen la estructura correcta
          const formattedEvents = data.map((event) => ({
            id: event.id,
            titulo_evento: event.titulo_evento || 'Sin título',
            descripcion: event.descripcion || 'Sin descripción',
            fecha: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          }));
  
          setEvents(formattedEvents); // Guardar los eventos formateados
        } catch (error) {
          console.error('Error al obtener los eventos:', error);
        }
      }
    };
  
    if (selectedDate) {
      fetchEvents(); // Solo ejecuta si hay fecha seleccionada
    }
  }, [selectedDate]);
  

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

  // Manejo de eventos guardados desde el Sidebar
  const handleSaveEvent = (newEvent) => {
    // Asegurarse de que `selectedDate` esté en el formato correcto (yyyy-mm-dd)
    if (selectedDate) {
      const fetchUpdatedEvents = async () => {
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
          setEvents(data); // Actualizar los eventos de la fecha seleccionada
        } catch (error) {
          console.error('Error al obtener los eventos actualizados:', error);
        }
      };

      fetchUpdatedEvents(); // Llamada para actualizar los eventos después de guardar
    }
  };

  return (
    <div className={styles.container}>
      {/* Título */}
      <div className={styles.title}>
        <h1>CALENDARIO</h1>
      </div>

      {/* Mensaje de advertencia */}
      <Alert severity="info" sx={{ width: "28.5vw", textAlign: "center" }}>
        Al cambiar el mes se actualizará en automatico en "Eventos del mes".
      </Alert>

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
            fetchEvents={() => fetchMonthlyEvents()}
          />
        </div>

        <div className={styles.summaryContainer}>
          <div className={styles.title}>
            <h1>EVENTOS DEL MES</h1>
          </div>

          {/* Mensaje de advertencia */}
          <Alert severity="info" sx={{ width: "28.5vw", textAlign: "center" }}>
            "Para actualizar la tabla se debe presionar el icono de refrescar". 
          </Alert>

          {/* Pasar correctamente el año y mes al componente de tabla */}
          <ReusableTableCalendar
            API_BASE_URL={API_BASE_URL}
            anio={currentYear.toString()}
            mes={`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`}
          />
        </div>
      </div>
    </div>
  );
}
