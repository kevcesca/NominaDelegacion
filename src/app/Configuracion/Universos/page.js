'use client';
// pages/universos.js
import React, { useState } from 'react';
import ProtectedView from "../../%Components/ProtectedView/ProtectedView"; // Ajusta esta ruta según tu estructura
import styles from './page.module.css';

const opcionesNomina = ["BASE", "ESTRUCTURA", "NOMINA 8", "HONORARIOS", "OTRO"];

const datosIniciales = [
    { id: 'A', nombre: 'BASE' },
    { id: 'CJ', nombre: 'ESTRUCTURA' },
    { id: 'PR', nombre: 'NOMINA 8' },
    { id: 'H', nombre: 'HONORARIOS' },
    { id: 'G', nombre: 'BASE' },
    { id: 'K', nombre: 'ESTRUCTURA' },
    { id: 'PR2', nombre: 'NOMINA 8' },
    { id: 'H2', nombre: 'HONORARIOS' },
    { id: 'O', nombre: 'BASE' },
    { id: 'L', nombre: 'ESTRUCTURA' },
    { id: 'PR3', nombre: 'NOMINA 8' },
    { id: 'H3', nombre: 'HONORARIOS' },
];

const Universos = () => {
    const [datosUniverso, setDatosUniverso] = useState(datosIniciales);
    const [paginaActual, setPaginaActual] = useState(0);
    const filasPorPagina = 4;
    const [filtro, setFiltro] = useState('');

    const mostrarPagina = () => {
        const inicio = paginaActual * filasPorPagina;
        const fin = inicio + filasPorPagina;
        return datosUniverso
            .filter(dato => dato.id.toLowerCase().includes(filtro) || dato.nombre.toLowerCase().includes(filtro))
            .slice(inicio, fin);
    };

    const cambiarPagina = (direccion) => {
        setPaginaActual((prev) => prev + direccion);
    };

    const filtrarTabla = (e) => {
        setFiltro(e.target.value.toLowerCase());
        setPaginaActual(0);
    };

    const crearUniverso = () => {
        const nuevoUniverso = { id: '', nombre: 'BASE', isEditing: true, isOther: false };
        setDatosUniverso((prevDatos) => [nuevoUniverso, ...prevDatos]);
    };

    const actualizarUniverso = (id) => {
        setDatosUniverso((prevDatos) =>
            prevDatos.map((dato) =>
                dato.id === id ? { ...dato, isEditing: true } : dato
            )
        );
    };

    const guardarUniverso = (index) => {
        setDatosUniverso((prevDatos) =>
            prevDatos.map((dato, i) =>
                i === index ? { ...dato, isEditing: false, isOther: false } : dato
            )
        );
    };

    const eliminarUniverso = (index) => {
        setDatosUniverso((prevDatos) => prevDatos.filter((_, i) => i !== index));
    };

    const handleNominaChange = (index, value) => {
        setDatosUniverso((prevDatos) =>
            prevDatos.map((dato, i) =>
                i === index ? { ...dato, nombre: value, isOther: value === "OTRO" } : dato
            )
        );
    };

    const handleInputChange = (index, field, value) => {
        setDatosUniverso((prevDatos) =>
            prevDatos.map((dato, i) =>
                i === index ? { ...dato, [field]: value } : dato
            )
        );
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <div className={styles.subHeader}>Gestión de Universos</div>
                <div className={styles.buttons}>
                    <input
                        type="text"
                        onChange={filtrarTabla}
                        placeholder="Buscar en la tabla..."
                        className={styles.inputField}
                    />
                    <button onClick={crearUniverso} className={styles.styledButton}>Crear Universo</button>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Identificador Universo</th>
                            <th>Nombre Nómina</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mostrarPagina().map((dato, index) => (
                            <tr key={index}>
                                <td>
                                    {dato.isEditing ? (
                                        <input
                                            type="text"
                                            value={dato.id}
                                            onChange={(e) => handleInputChange(index, 'id', e.target.value)}
                                            className={styles.inputField}
                                        />
                                    ) : (
                                        dato.id
                                    )}
                                </td>
                                <td>
                                    {dato.isEditing ? (
                                        <>
                                            <select
                                                value={dato.isOther ? "OTRO" : dato.nombre}
                                                onChange={(e) => handleNominaChange(index, e.target.value)}
                                                className={styles.selectField}
                                            >
                                                {opcionesNomina.map((opcion) => (
                                                    <option key={opcion} value={opcion}>
                                                        {opcion}
                                                    </option>
                                                ))}
                                            </select>
                                            {dato.isOther && (
                                                <input
                                                    type="text"
                                                    placeholder="Especificar Otro"
                                                    value={dato.nombre === "OTRO" ? '' : dato.nombre}
                                                    onChange={(e) => handleInputChange(index, 'nombre', e.target.value)}
                                                    className={styles.inputField}
                                                    style={{ marginTop: "5px" }}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        dato.nombre
                                    )}
                                </td>
                                <td>
                                    {dato.isEditing ? (
                                        <span
                                            className={styles.iconButton}
                                            onClick={() => guardarUniverso(index)}
                                        >
                                            💾
                                        </span>
                                    ) : (
                                        <span
                                            className={styles.iconButton}
                                            onClick={() => actualizarUniverso(dato.id)}
                                        >
                                            ✏️
                                        </span>
                                    )}
                                    <span className={styles.iconButton} onClick={() => eliminarUniverso(index)}>🗑️</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <button
                        onClick={() => cambiarPagina(-1)}
                        disabled={paginaActual <= 0}
                        className={styles.styledButton}
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => cambiarPagina(1)}
                        disabled={(paginaActual + 1) * filasPorPagina >= datosUniverso.length}
                        className={styles.styledButton}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProtectedUniversos = () => (
    <ProtectedView requiredPermissions={["Universos", "Acceso_total"]}>
        <Universos />
    </ProtectedView>
);

export default ProtectedUniversos;
