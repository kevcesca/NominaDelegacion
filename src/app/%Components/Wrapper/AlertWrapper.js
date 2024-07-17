'use client';
import React, { useState, useEffect, useContext } from 'react';
import { Toast } from 'primereact/toast';
import AlertContext from '../../context/AlertContext';
import { differenceInDays } from 'date-fns';

export default function AlertWrapper({ children }) {
    const { alertDate } = useContext(AlertContext);
    const [alertShown, setAlertShown] = useState(false);
    const toast = React.useRef(null);

    useEffect(() => {
        const today = new Date();
        if (alertDate && !alertShown) {
            const daysDifference = differenceInDays(alertDate, today);
            if (daysDifference <= 30 && daysDifference >= 0) {
                toast.current.show({ severity: 'warn', summary: 'Recordatorio', detail: `Faltan ${daysDifference} días para la fecha configurada.`, life: 10000 });
                setAlertShown(true);
            }
        }
    }, [alertDate, alertShown]);

    return (
        <>
            <Toast ref={toast} />
            {children}
        </>
    );
}
