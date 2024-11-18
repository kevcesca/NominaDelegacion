// src/app/calendar/page.js
"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button, TextField, MenuItem, Select, ThemeProvider } from "@mui/material";
import theme from "../$tema/theme";

const holidays = ["01-01", "02-05", "03-21", "05-01", "09-16", "11-20", "12-25"];
const eventTitles = [
  "Quincena",
  "Captura e Importación",
  "Revisiones y Cálculo de Nómina",
  "Pre-Nómina",
  "Validación de Pre-Nómina",
  "Atención a los Problemas",
  "Cierre de Proceso",
  "Publicación en Web 1",
  "Traslado de la CLC",
  "Ministración de Tarjetas",
  "Días de Pago",
  "Cierre de Captura",
  "Publicación en Web 2",
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const renderCalendar = () => {
    const calendarBody = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let date = 1;

    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || date > daysInMonth) {
          row.push(<td key={j}></td>);
        } else {
          const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
          const isHoliday = holidays.includes(`${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`);
          const hasEvent = events[formattedDate];
          row.push(
            <td
              key={j}
              className={`${isHoliday ? styles.holiday : ""} ${hasEvent ? styles.event : ""} ${date === selectedDate ? styles.selected : ""}`}
              onClick={() => selectDate(date, formattedDate)}
            >
              {date}
            </td>
          );
          date++;
        }
      }
      calendarBody.push(<tr key={i}>{row}</tr>);
    }
    return calendarBody;
  };

  const selectDate = (date, formattedDate) => {
    setSelectedDate(formattedDate);
    if (events[formattedDate]) {
      setEventTitle(events[formattedDate].title);
      setEventDescription(events[formattedDate].description);
    } else {
      setEventTitle("");
      setEventDescription("");
    }
  };

  const addEvent = () => {
    if (selectedDate && eventTitle && eventDescription) {
      setEvents((prevEvents) => ({
        ...prevEvents,
        [selectedDate]: { title: eventTitle, description: eventDescription },
      }));
      setEventTitle("");
      setEventDescription("");
    } else {
      alert("Selecciona una fecha y completa los campos de título y descripción para agregar un evento.");
    }
  };

  const deleteEvent = () => {
    if (selectedDate && events[selectedDate]) {
      const updatedEvents = { ...events };
      delete updatedEvents[selectedDate];
      setEvents(updatedEvents);
      setEventTitle("");
      setEventDescription("");
    } else {
      alert("Selecciona un evento para eliminar.");
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const exportCSV = () => {
    const table = document.querySelector(".dataTableWrapper table");
    let csvContent = "";
    for (let row of table.rows) {
      const cells = [...row.cells].map((cell) => `"${cell.innerText}"`).join(",");
      csvContent += cells + "\n";
    }
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Fechas_Registradas.csv";
    link.click();
  };

  const exportExcel = () => {
    const table = document.querySelector(".dataTableWrapper table");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Fechas Registradas" });
    XLSX.writeFile(wb, "Fechas_Registradas.xlsx");
  };

  const exportPdf = () => {
    const doc = new jsPDF("landscape");
    doc.text("Fechas registradas", 10, 10);
    const table = document.querySelector(".dataTableWrapper table");
    const columns = [...table.querySelectorAll("th")].map((th) => th.innerText);
    const rows = [...table.querySelectorAll("tbody tr")].map((tr) => {
      return [...tr.querySelectorAll("td")].map((td) => td.innerText);
    });

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
      theme: "grid",
    });

    doc.save("Fechas_Registradas.pdf");
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>C A L E N D A R I O</h1>
        </div>
        <div className={styles.containerContent}>
          <div className={styles.calendarContainer}>
            <section className={styles.calendar}>
              <h2>
                <span>
                  {currentDate.toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
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
                <tbody>{renderCalendar()}</tbody>
              </table>
              <div className={styles.buttons}>
                <Button variant="contained" color="primary" onClick={prevMonth}>
                  Mes Anterior
                </Button>
                <Button variant="contained" color="primary" onClick={nextMonth}>
                  Mes Siguiente
                </Button>
              </div>
            </section>

            <aside className={styles.sidebar}>
              <h3>Eventos para esta fecha</h3>
              <div>
                {selectedDate ? (
                  events[selectedDate] ? (
                    <div>
                      <h4>{events[selectedDate].title}</h4>
                      <p>{events[selectedDate].description}</p>
                    </div>
                  ) : (
                    <p>No hay evento para el {selectedDate}</p>
                  )
                ) : (
                  <p>
                    Selecciona una fecha en el calendario para ver los detalles del evento.
                  </p>
                )}
              </div>
              <div className={styles.eventForm}>
                <Select
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="">Selecciona un título</MenuItem>
                  {eventTitles.map((title, index) => (
                    <MenuItem key={index} value={title}>
                      {title}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  placeholder="Descripción del Evento"
                  multiline
                  rows={4}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  fullWidth
                />
                <div className={styles.buttons}>
                  <Button variant="contained" color="success" onClick={addEvent}>
                    Agregar Evento
                  </Button>
                  <Button variant="contained" color="error" onClick={deleteEvent}>
                    Eliminar Evento
                  </Button>
                </div>
              </div>
            </aside>
          </div>

          <div className={styles.extraContainer}>
            <h3>Fechas registradas</h3>
            <div className={styles.exportButtons}>
              <Button variant="outlined" color="primary" onClick={exportCSV}>
                CSV
              </Button>
              <Button variant="outlined" color="primary" onClick={exportExcel}>
                XLS
              </Button>
              <Button variant="outlined" color="primary" onClick={exportPdf}>
                PDF
              </Button>
            </div>
            <div className={styles.dataTableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Quincena</th>
                    <th>Captura e Importación</th>
                    <th colSpan="2">Revisiones y Cálculo de Nómina</th>
                    <th>Pre-Nómina</th>
                    <th>Validación de Pre-Nómina</th>
                    <th colSpan="2">Atención a los Problemas</th>
                    <th>Cierre de Proceso</th>
                    <th>Publicación en Web 1</th>
                    <th>Traslado de la CLC</th>
                    <th>Ministración de Tarjetas</th>
                    <th colSpan="2">Días de Pago</th>
                    <th>Cierre de Captura</th>
                    <th>Publicación en Web 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01</td>
                    <td>01/01/2023</td>
                    <td>01/02/2023</td>
                    <td>01/03/2023</td>
                    <td>01/04/2023</td>
                    <td>01/05/2023</td>
                    <td>01/06/2023</td>
                    <td>01/07/2023</td>
                    <td>01/08/2023</td>
                    <td>01/09/2023</td>
                    <td>01/10/2023</td>
                    <td>01/11/2023</td>
                    <td>01/12/2023</td>
                    <td>01/13/2023</td>
                    <td>01/14/2023</td>
                    <td>01/15/2023</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
