import React from 'react';
import styles from './page.module.css';

export default function SummaryTable({ events }) {
  const quincenas = {};

  // Organiza los eventos por quincena
  Object.keys(events).forEach((date) => {
    const [year, month, day] = date.split('-').map(Number);
    const quincena =
      day <= 15
        ? `Primera quincena de ${new Date(year, month - 1).toLocaleString('es', { month: 'long' })}`
        : `Segunda quincena de ${new Date(year, month - 1).toLocaleString('es', { month: 'long' })}`;

    if (!quincenas[quincena]) {
      quincenas[quincena] = [];
    }

    quincenas[quincena].push(...events[date]);
  });

  return (
    <section className={styles.calendar}>
      <h2>Resumen de Eventos por Quincena</h2>
      <table className={styles.calendarTable}>
        <thead>
          <tr>
            <th>Quincena</th>
            <th>Eventos</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(quincenas).length > 0 ? (
            Object.keys(quincenas).map((quincena, index) => (
              <tr key={index}>
                <td>{quincena}</td>
                <td>
                  {quincenas[quincena]
                    .map((event) => `${event.title}: ${event.description}`)
                    .join(', ')}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No hay eventos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
