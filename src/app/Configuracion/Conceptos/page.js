'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

const datosIniciales = [
    { id: '2203', nombre: 'APOYO SEGURO GASTOS FUNERARIOS CDMX' },
    { id: '2204', nombre: 'APOYO TRANSPORTE' },
    { id: '2205', nombre: 'SUBSIDIO PARA VIVIENDA' },
    { id: '2206', nombre: 'ASISTENCIA SOCIAL' },
    { id: '2207', nombre: 'APOYO ALIMENTARIO' },
    { id: '2208', nombre: 'BECAS PARA ESTUDIANTES' },
    { id: '2209', nombre: 'SEGURO MÉDICO' },
    { id: '2210', nombre: 'APOYO ECONÓMICO A ADULTOS MAYORES' }
];

const Conceptos = () => {
    const [datosConcepto, setDatosConcepto] = useState(datosIniciales);
    const [paginaActual, setPaginaActual] = useState(0);
    const filasPorPagina = 4;
    const [filtro, setFiltro] = useState('');
    const [datosFiltrados, setDatosFiltrados] = useState(datosIniciales);

    useEffect(() => {
        filtrarTabla();
    }, [filtro, datosConcepto]);

    const mostrarPagina = () => {
        const inicio = paginaActual * filasPorPagina;
        const fin = inicio + filasPorPagina;
        return datosFiltrados.slice(inicio, fin);
    };

    const cambiarPagina = (direccion) => {
        const nuevaPagina = paginaActual + direccion;
        if (nuevaPagina >= 0 && nuevaPagina * filasPorPagina < datosFiltrados.length) {
            setPaginaActual(nuevaPagina);
        }
    };

    const crearConcepto = () => {
        const nuevoConcepto = { id: '', nombre: '', isEditing: true };
        setDatosConcepto([nuevoConcepto, ...datosConcepto]); // Añadir al inicio
    };

    const guardarConcepto = (index) => {
        setDatosConcepto((prevDatos) =>
            prevDatos.map((dato, i) =>
                i === index ? { ...dato, isEditing: false } : dato
            )
        );
        setDatosFiltrados((prevDatos) =>
            prevDatos.map((dato, i) =>
                i === index ? { ...dato, isEditing: false } : dato
            )
        );
    };

    const actualizarConcepto = (index) => {
        setDatosConcepto((prevDatos) =>
            prevDatos.map((dato, i) =>
                i === index ? { ...dato, isEditing: true } : dato
            )
        );
    };

    const eliminarConcepto = (index) => {
        const nuevosDatos = datosConcepto.filter((_, i) => i !== index);
        setDatosConcepto(nuevosDatos);
        setDatosFiltrados(nuevosDatos);
    };

    const filtrarTabla = () => {
        const filtroActualizado = filtro.toLowerCase();
        setDatosFiltrados(
            datosConcepto.filter(dato =>
                dato.id.toLowerCase().includes(filtroActualizado) || dato.nombre.toLowerCase().includes(filtroActualizado)
            )
        );
        setPaginaActual(0); // Reinicia a la primera página después de filtrar
    };

    const handleInputChange = (index, field, value) => {
        setDatosConcepto((prevDatos) =>
            prevDatos.map((dato, i) =>
                i === index ? { ...dato, [field]: value } : dato
            )
        );
    };

    return (

        <div className={styles.body}>
            <div className={styles.container}>
            <div className={styles.subHeader}>Gestión de Conceptos</div>
            
            <div className={styles.searchBar}>
                <input
                    type="text"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Buscar en la tabla..."
                    className={styles.inputField}
                />
                <button onClick={crearConcepto} className={styles.styledButton}>Crear Concepto</button>
            </div>
            
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID del Concepto</th>
                        <th>Nombre del Concepto</th>
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
                                    <input
                                        type="text"
                                        value={dato.nombre}
                                        onChange={(e) => handleInputChange(index, 'nombre', e.target.value)}
                                        className={styles.inputField}
                                    />
                                ) : (
                                    dato.nombre
                                )}
                            </td>
                            <td>
                                {dato.isEditing ? (
                                    <span
                                        className={styles.iconButton}
                                        onClick={() => guardarConcepto(index)}
                                    >
                                        💾
                                    </span>
                                ) : (
                                    <span
                                        className={styles.iconButton}
                                        onClick={() => actualizarConcepto(index)}
                                    >
                                        ✏️
                                    </span>
                                )}
                                <span
                                    className={styles.iconButton}
                                    onClick={() => eliminarConcepto(index)}
                                >
                                    🗑️
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.pagination}>
                <button
                    onClick={() => cambiarPagina(-1)}
                    className={styles.styledButton}
                    disabled={paginaActual <= 0}
                >
                    Anterior
                </button>
                <button
                    onClick={() => cambiarPagina(1)}
                    className={styles.styledButton}
                    disabled={(paginaActual + 1) * filasPorPagina >= datosFiltrados.length}
                >
                    Siguiente
                </button>
            </div>
        </div>
    </div>
        
    );
};

export default Conceptos;
