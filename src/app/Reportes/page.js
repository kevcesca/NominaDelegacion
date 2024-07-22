'use client'
import React from 'react';
import styles from './page.module.css';
import DynamicForm from '../%Components/DynamicForm/DynamicForm';

export default function CargarDatos() {
    return (
        <main >
            <h1 className={styles.h1}>Reportes</h1>
            
            <div className={styles.main}>
                <DynamicForm />
            </div>
        </main>
    );
}
