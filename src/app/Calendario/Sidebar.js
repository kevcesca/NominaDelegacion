'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export default function Sidebar({ selectedDate, events, onSaveEvent }) {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const handleSave = () => {
    if (!eventTitle || !eventDescription) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const newEvent = { title: eventTitle, description: eventDescription };
    onSaveEvent(selectedDate, newEvent);

    // Reinicia los campos del formulario
    setEventTitle('');
    setEventDescription('');
  };

  return (
    <aside className={styles.sidebar}>
      <h3>Eventos para esta fecha</h3>
      {selectedDate ? (
        <>
          <p>Fecha seleccionada:   <br></br>{selectedDate}</p>
          <ul>
            {events.length > 0 ? (
              events.map((event, index) => (
                <li key={index} className={styles.event}>
                  <strong>{event.title}</strong>: {event.description}
                </li>
              ))
            ) : (
              <p>No hay eventos para esta fecha.</p>
            )}
          </ul>

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
        <p>Selecciona una fecha para ver o añadir eventos.</p>
      )}
    </aside>
  );
}
