// src/app/Alertas/page.js

'use client';

import React, { useContext, useState } from 'react';
import AlertContext from '../../context/AlertContext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';  // o el tema que estés usando
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './page.module.css';

export default function Page() {
    const { alertDate, setAlertDate } = useContext(AlertContext);
    const [newDate, setNewDate] = useState(alertDate ? alertDate : null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setAlertDate(newDate);
    };

    return (
        <div className={styles.container}>
            <h1>Configurar Fecha de Alerta</h1>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="alertDate">Fecha de Alerta:</label>
                    <Calendar 
                        id="alertDate" 
                        value={newDate} 
                        onChange={(e) => setNewDate(e.value)} 
                        dateFormat="dd/mm/yy" 
                        showIcon 
                    />
                </div>
                <Button type="submit" label="Guardar Fecha" className="p-button-primary" />
            </form>
        </div>
    );
}
