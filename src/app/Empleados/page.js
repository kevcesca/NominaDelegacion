// src/app/Empleados/page.js

import React from 'react';
import styles from './page.module.css';
import TablaEmpleados from '../%Components/TablaEmpleados/TablaEmpleados';

export default function CargarDatos() {
    return (
        <main className={styles.main}>
            <h1 className={styles.h1}>Empleados</h1>
            <TablaEmpleados/>
        </main>
    );
}
