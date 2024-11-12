"use client";
import { useState } from 'react';
import styles from '../Reposicion/page.module.css';
import Link from 'next/link';


export default function RepositionCheque() {
  const [employeeData] = useState({
    "123": { firstName: "Juan", lastName: "Pérez", amount: "1500", payrollType: "NOMINA 8" },
    "456": { firstName: "Ana", lastName: "Gómez", amount: "2000", payrollType: "ESTRUCTURA" }
  });

  const [checkData] = useState({
    "101": { policyFolio: "1001", fortnight: "1", year: "2024" },
    "102": { policyFolio: "1002", fortnight: "2", year: "2024" }
  });

  const [formState, setFormState] = useState({
    employeeId: '',
    checkFolio: '',
    reason: '',
    evidence: null
  });

  const [displayData, setDisplayData] = useState({
    firstName: '-',
    lastName: '-',
    amount: '-',
    payrollType: '-',
    policyFolio: '-',
    fortnight: '-',
    year: '-'
  });

  const [successMessage, setSuccessMessage] = useState(false);

  const fetchEmployeeData = () => {
    const data = employeeData[formState.employeeId];
    if (data) {
      setDisplayData((prevState) => ({
        ...prevState,
        firstName: data.firstName,
        lastName: data.lastName,
        amount: data.amount,
        payrollType: data.payrollType
      }));
    } else {
      setDisplayData((prevState) => ({
        ...prevState,
        firstName: '-',
        lastName: '-',
        amount: '-',
        payrollType: '-'
      }));
    }
  };

  const fetchCheckData = () => {
    const data = checkData[formState.checkFolio];
    if (data) {
      setDisplayData((prevState) => ({
        ...prevState,
        policyFolio: data.policyFolio,
        fortnight: data.fortnight,
        year: data.year
      }));
    } else {
      setDisplayData((prevState) => ({
        ...prevState,
        policyFolio: '-',
        fortnight: '-',
        year: '-'
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage(true);
    setFormState({ employeeId: '', checkFolio: '', reason: '', evidence: null });
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className={styles.container}>
      <h2>Reposición de Cheques</h2>
      <form id="repositionForm" onSubmit={handleSubmit}>
        <div className={styles.formColumns}>
          {/* Columna de Información del Empleado */}
          <div className={styles.formColumn}>
            <label htmlFor="employeeId">ID Empleado:</label>
            <input
              type="text"
              id="employeeId"
              placeholder="Ingrese el ID del empleado"
              value={formState.employeeId}
              onChange={(e) => setFormState({ ...formState, employeeId: e.target.value })}
              onInput={fetchEmployeeData}
              required
            />
            <label>Nombre:</label>
            <span className={styles.dataLabel}>{displayData.firstName}</span>
            <label>Apellido:</label>
            <span className={styles.dataLabel}>{displayData.lastName}</span>
            <label>Monto:</label>
            <span className={styles.dataLabel}>{displayData.amount}</span>
            <label>Tipo de Nómina:</label>
            <span className={styles.dataLabel}>{displayData.payrollType}</span>
          </div>
          
          {/* Columna de Información del Cheque */}
          <div className={styles.formColumn}>
            <label htmlFor="checkFolio">Folio de Cheque:</label>
            <input
              type="number"
              id="checkFolio"
              placeholder="Ingrese el folio del cheque"
              value={formState.checkFolio}
              onChange={(e) => setFormState({ ...formState, checkFolio: e.target.value })}
              onInput={fetchCheckData}
              required
            />
            <label>Folio de Póliza:</label>
            <span className={styles.dataLabel}>{displayData.policyFolio}</span>
            <label>Quincena:</label>
            <span className={styles.dataLabel}>{displayData.fortnight}</span>
            <label>Año:</label>
            <span className={styles.dataLabel}>{displayData.year}</span>
          </div>
        </div>

        <label htmlFor="reason">Motivo de Reposición:</label>
        <textarea
          id="reason"
          placeholder="Describa el motivo de la reposición"
          value={formState.reason}
          onChange={(e) => setFormState({ ...formState, reason: e.target.value })}
          required
        />

        <label htmlFor="evidence">Subir Evidencia (Obligatorio):</label>
        <input
          type="file"
          id="evidence"
          onChange={(e) => setFormState({ ...formState, evidence: e.target.files[0] })}
          required
        />

        <div className={styles.buttonContainer}>
            <Link href="/Antonio">
          <button type="submit">Reponer Cheque</button>
          </Link>
          <button type="reset" className={styles.cancelar}>Cancelar</button>
        </div>
      </form>

      {successMessage && <div className={styles.successMessage}>¡Cheque repuesto exitosamente!</div>}
    </div>
  );
}
