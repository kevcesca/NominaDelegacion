import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { fetchUsersFromKeycloak } from './UserService'; // Importa el servicio de usuario

export default function TablaUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const data = await fetchUsersFromKeycloak();
                setUsuarios(data);
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error fetching users from Keycloak', life: 3000 });
            }
        };

        fetchUsuarios();
    }, []);

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <DataTable value={usuarios} paginator rows={10}>
                    <Column field="username" header="Username" />
                    <Column field="email" header="Email" />
                    <Column field="firstName" header="First Name" />
                    <Column field="lastName" header="Last Name" />
                </DataTable>
            </div>
        </div>
    );
}
