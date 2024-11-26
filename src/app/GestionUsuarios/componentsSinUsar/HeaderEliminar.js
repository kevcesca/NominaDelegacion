// src/pages/components/Header.js
import React from 'react';
import styles from '../page.module.css';

export default function Header({ searchTerm, handleSearchInput }) {
    return (
        <div>
            <h1>Gestión de Usuarios</h1>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Buscar en todas las columnas"
                    value={searchTerm}
                    onChange={handleSearchInput}
                />
            </div>
        </div>
    );
}
