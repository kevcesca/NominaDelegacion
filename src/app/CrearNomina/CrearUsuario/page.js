'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CrearUsuario.module.css';

export default function CrearUsuario() {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [fechaAlta, setFechaAlta] = useState('');
    const [activo, setActivo] = useState('SI');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí debes agregar la lógica para agregar el nuevo usuario a la tabla
        // Por ejemplo, puedes llamar a una API o actualizar el estado global
        console.log({ nombre, apellidos, email, fechaAlta, activo });
        router.push('/CrearNomina');
    };

    return (
        <main className={styles.main}>
            <h1>Crear Nuevo Usuario</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label>
                    Nombre:
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Apellidos:
                    <input
                        type="text"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Fecha Alta:
                    <input
                        type="date"
                        value={fechaAlta}
                        onChange={(e) => setFechaAlta(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Activo:
                    <select value={activo} onChange={(e) => setActivo(e.target.value)}>
                        <option value="SI">SI</option>
                        <option value="NO">NO</option>
                    </select>
                </label>
                <button className={styles.button} type="submit">Crear Usuario</button>
            </form>
        </main>
    );
}
