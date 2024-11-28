'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export default function Calendar({ selectedDate, events, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date()); // Controla la fecha actual del calendario

  const currentMonth = currentDate.toLocaleString('es', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();

  // Obtiene el día actual
  const today = new Date();
  const isToday = (day) =>
    today.getDate() === day &&
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear();

  // Cambiar al mes anterior
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1));
  };

  // Cambiar al mes siguiente
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1));
  };

  // Maneja la selección de un día
  const handleDateClick = (day) => {
    const formattedDate = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(formattedDate);
  };

  // Generar las celdas del calendario con eventos
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
        const formattedDate = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isSelected = selectedDate === formattedDate;
        const dayEvents = events.filter(event => event.dia === day); // Obtén eventos para este día

        cells.push(
          <td
            key={i}
            className={`${styles.day} ${isToday(day) ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
            onClick={() => handleDateClick(day)}
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
      {/* Encabezado del calendario con navegación */}
      <h2 className={styles.header}>
        <button className={styles.navButton} onClick={handlePrevMonth}>
          &lt;
        </button>
        {`${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} ${currentYear}`}
        <button className={styles.navButton} onClick={handleNextMonth}>
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
