import React, { useState, useEffect } from 'react';
import { Modal, Typography, Box } from '@mui/material';
import styles from './page.module.css';

export default function Calendar({
  selectedDate,
  events,
  onDateSelect,
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
}) {
  const [currentDate, setCurrentDate] = useState(new Date(currentYear, currentMonth));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date(); // Día actual

  const isToday = (day) =>
    today.getDate() === day &&
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear();

  useEffect(() => {
    setCurrentDate(new Date(currentYear, currentMonth));
  }, [currentMonth, currentYear]);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
  };

  const renderDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;

      if (i < firstDayOfMonth || day > daysInMonth) {
        cells.push(<td key={i} className={styles.emptyCell}></td>);
      } else {
        const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events.filter(event => event.dia === day); // Filtrar eventos por día

        cells.push(
          <td
            key={i}
            className={`${styles.day} ${isToday(day) ? styles.today : ''} ${
              selectedDate === formattedDate ? styles.selectedDay : ''
            }`} // Aplicar clase al día seleccionado
            onClick={() => onDateSelect(formattedDate)} // Seleccionar día
          >
            <div className={`${styles.dayNumber} ${isToday(day) ? styles.circleToday : ''}`}>
              {day}
            </div>

            {/* Mostrar eventos solo si el día está seleccionado */}
            {selectedDate === formattedDate && (
              <div className={styles.eventContainer}>
                {dayEvents.map((event, index) => (
                  <div
                    key={index}
                    className={styles.eventTag}
                    title={event.titulo_evento} // Tooltip con el título del evento
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar que el clic seleccione el día
                      setSelectedEvent({ ...event, fecha: formatDate(formattedDate) });
                      setIsModalOpen(true); // Abrir modal con detalles del evento
                    }}
                  >
                    {event.titulo_evento}
                  </div>
                ))}
              </div>
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
        <button className={styles.navButton} onClick={onPrevMonth}>&lt;</button>
        {`${currentDate.toLocaleString('es', { month: 'long' })} ${currentYear}`}
        <button className={styles.navButton} onClick={onNextMonth}>&gt;</button>
      </h2>

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

      {/* Modal para mostrar los detalles del evento */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className={styles.modal}>
          {selectedEvent && (
            <>
              <Typography id="modal-title" variant="h6" className={styles.modalTitle}>
                Detalles del Evento
              </Typography>
              <Typography><strong>Título:</strong> {selectedEvent.titulo_evento}</Typography>
              <Typography><strong>Descripción:</strong> {selectedEvent.descripcion}</Typography>
              <Typography><strong>Quincena:</strong> {selectedEvent.quincena}</Typography>
              <Typography><strong>Fecha:</strong> {selectedEvent.fecha}</Typography>
            </>
          )}
        </Box>
      </Modal>
    </section>
  );
}
