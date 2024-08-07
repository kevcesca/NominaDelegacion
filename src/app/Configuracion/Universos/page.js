'use client';
import React from 'react';
import CrudUniversos from '../../%Components/CrudUniversos/CrudUniversos';
import styles from './page.module.css'


const Page = () => {
    return (
        <main className={styles.main}>
            <h1>Gestión de Universos</h1>
            <CrudUniversos />
        </main>
    );
};

export default Page;
