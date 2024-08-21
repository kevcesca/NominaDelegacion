'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import styles from './TablaUsuarios.module.css'; // Estilos propios

export default function TablaUsuarios() {
    const { data: session } = useSession();
    const [usuarios, setUsuarios] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            if (!session || !session.accessToken) {
                console.error('No se pudo obtener el token de acceso.', session);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el token de acceso.', life: 3000 });
                return;
            }

            try {
                console.log('Token de acceso:', session.accessToken); // Verificar el token
                const response = await axios.get('http://localhost:8081/realms/reino-NominaAzcapo/protocol/openid-connect/userinfo', {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}` // Usar el token de acceso de la sesión
                    }
                });

                setUsuarios([response.data]); // Guardar la respuesta en el estado usuarios
            } catch (error) {
                console.error('Error fetching users from Keycloak', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener los usuarios desde Keycloak', life: 3000 });
            }
        };

        fetchUsuarios();
    }, [session]);

    return (
        <div>
            <Toast ref={toast} />
            <div className={`card ${styles.card}`}>
                <DataTable value={usuarios} paginator rows={10}>
                    <Column field="preferred_username" header="Username" />
                    <Column field="email" header="Email" />
                    <Column field="given_name" header="First Name" />
                    <Column field="family_name" header="Last Name" />
                </DataTable>
            </div>
        </div>
    );
}
