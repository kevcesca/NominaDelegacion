'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export default function Sidebar({ selectedDate, events, onSaveEvent }) {
  const [eventTitle, setEventTitle] = useState(''); // Título del evento
  const [eventDescription, setEventDescription] = useState(''); // Descripción del evento

  // Manejar la acción de guardar un nuevo evento
  const handleSave = async () => {
    if (!eventTitle || !eventDescription) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const newEvent = { titulo: eventTitle, descripcion: eventDescription };

    try {
      const response = await fetch('/calendario/evento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newEvent, fecha: selectedDate, id_creador: 1 }), // Cambiar id_creador según tu lógica
      });

      if (!response.ok) {
        throw new Error('Error al guardar el evento');
      }

      // Actualizar eventos en el estado principal
      onSaveEvent(selectedDate, newEvent);

      // Reiniciar los campos del formulario
      setEventTitle('');
      setEventDescription('');
    } catch (error) {
      console.error('Error al guardar el evento:', error);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <h3>Eventos para esta fecha</h3>
      {selectedDate ? (
        <>
          {/* Fecha seleccionada */}
          <p>
            <strong>Fecha seleccionada:</strong>
            <br />
            {selectedDate}
          </p>

          {/* Lista de eventos para la fecha seleccionada */}
          <ul className={styles.eventList}>
            {events.length > 0 ? (
              events.map((event, index) => (
                <li key={index} className={styles.event}>
                  <strong>{event.titulo}</strong>: {event.descripcion}
                </li>
              ))
            ) : (
              <p>No hay eventos para esta fecha.</p>
            )}
          </ul>

          {/* Formulario para agregar un nuevo evento */}
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

          {/* Botones de acción */}
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
        // Mensaje si no hay una fecha seleccionada
        <p>Selecciona una fecha para ver o añadir eventos.</p>
      )}
    </aside>
  );
}
