import React from 'react';
import styles from './CrudRoles.module.css';

const Toolbar = () => (
    <div className={styles.toolbar}>
        <button className={styles.button} onClick={() => console.log('Nuevo Rol')}>Nuevo Rol</button>
        <button className={`${styles.button} ${styles.buttonBlue}`} onClick={() => console.log('Exportar CSV')}>Exportar CSV</button>
        <button className={`${styles.button} ${styles.buttonGreen}`} onClick={() => console.log('Exportar Excel')}>Exportar Excel</button>
        <button className={`${styles.button} ${styles.buttonYellow}`} onClick={() => console.log('Exportar PDF')}>Exportar PDF</button>
    </div>
);

export default Toolbar;
