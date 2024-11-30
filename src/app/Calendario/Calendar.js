'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Calendar({
  selectedDate, events, onDateSelect, emptyDates, currentMonth, currentYear, onPrevMonth, onNextMonth
}) {
  const [currentDate, setCurrentDate] = useState(new Date(currentYear, currentMonth)); // Controla la fecha actual del calendario

  useEffect(() => {
    setCurrentDate(new Date(currentYear, currentMonth)); // Actualiza la fecha cuando cambie el mes
  }, [currentMonth, currentYear]);

  // Fecha actual para resaltar el día actual
  const today = new Date();
  const isToday = (day) =>
    today.getDate() === day &&
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear();

  const currentMonthName = currentDate.toLocaleString('es', { month: 'long' });
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Detectar el día actual si no hay uno seleccionado
  useEffect(() => {
    if (!selectedDate) {
      const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      onDateSelect(todayFormatted); // Seleccionar el día actual
    }
  }, [selectedDate, onDateSelect]);

  const renderDays = () => {
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7; // Garantiza celdas completas en la cuadrícula
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;

      if (i < firstDayOfMonth || day > daysInMonth) {
        // Celdas vacías (antes o después del mes)
        cells.push(<td key={i} className={styles.emptyCell}></td>);
      } else {
        // Días del mes
        const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isSelected = selectedDate === formattedDate; // Verificar si el día está seleccionado
        const dayEvents = events.filter(event => event.dia === day); // Obtener eventos para este día

        cells.push(
          <td
            key={i}
            className={`${styles.day} ${isToday(day) ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
            onClick={() => onDateSelect(formattedDate)} // Llamar a onDateSelect al hacer clic
          >
            <div className={styles.dayNumber}>{day}</div>
            {dayEvents.length > 0 && (
              <ul className={styles.eventList}>
                {dayEvents.map((event, index) => (
                  <li key={index} className={styles.eventItem}>
                    {event.titulo_evento}
                  </li>
                ))}
              </ul>
            )}
          </td>
        );
      }
    }

    return cells;
  };

  return (
    <section className={styles.calendar}>
      <h2 className={styles.header}>
        <button className={styles.navButton} onClick={onPrevMonth}>
          &lt;
        </button>
        {`${currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1)} ${currentYear}`}
        <button className={styles.navButton} onClick={onNextMonth}>
          &gt;
        </button>
      </h2>

      {/* Tabla del calendario */}
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
            <tr key={rowIndex}>
              {renderDays().slice(rowIndex * 7, rowIndex * 7 + 7)}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
