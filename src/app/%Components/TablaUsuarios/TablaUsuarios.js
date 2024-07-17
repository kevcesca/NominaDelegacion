'use client'
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { UserService } from './UserService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';  // o el tema que estés usando
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from './TablaUsuarios.module.css'; // Importa tu archivo CSS personalizado

export default function TablaUsuarios() {
    let emptyUser = {
        id: null,
        fechaAlta: null,
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        role: 'user',
        activo: false
    };

    const [usuarios, setUsuarios] = useState([]);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const roles = [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' }
    ];

    useEffect(() => {
        UserService.getUsuarios().then(data => {
            // Convertir las fechas de los usuarios a objetos Date
            const usuariosConFecha = data.map(user => {
                return { ...user, fechaAlta: new Date(user.fechaAlta) };
            });
            setUsuarios(usuariosConFecha);
        });
    }, []);

    const openNew = () => {
        const newUser = {
            ...emptyUser,
            password: generatePassword()
        };
        setUser(newUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const saveUser = () => {
        setSubmitted(true);

        if (user.nombre.trim() && user.apellidos.trim()) {
            let _usuarios = [...usuarios];
            let _user = { ...user };

            if (user.id) {
                const index = findIndexById(user.id);
                _usuarios[index] = _user;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
            } else {
                _user.id = createId();
                _usuarios.push(_user);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
            }

            setUsuarios(_usuarios);
            setUserDialog(false);
            setUser(emptyUser);
        }
    };

    const editUser = (user) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = () => {
        let _usuarios = usuarios.filter(val => val.id !== user.id);
        setUsuarios(_usuarios);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const generatePassword = () => {
        let password = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Crear" icon="pi pi-plus" className={`${styles['button-gold']} ${styles['button-margin']}`} onClick={openNew} />
                <Button label="Eliminar" icon="pi pi-trash" className={`${styles['button-red']} ${styles['button-margin']}`} onClick={confirmDeleteUser} disabled={!selectedUsers || !selectedUsers.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className={`${styles['button-teal']} ${styles['button-margin']}`} onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className={`mr-2 ${styles['button-gold']} ${styles['button-margin']}`} onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded outlined className={`${styles['button-red']} ${styles['button-margin']}`} onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Users</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined className={`${styles['button-teal']} ${styles['button-margin']}`} onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className={`${styles['button-gold']} ${styles['button-margin']}`} onClick={saveUser} />
        </React.Fragment>
    );

    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined className={`${styles['button-teal']} ${styles['button-margin']}`} onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" className={`${styles['button-red']} ${styles['button-margin']}`} onClick={deleteUser} />
        </React.Fragment>
    );

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;
        setUser(_user);
    };

    const onCheckboxChange = (e, name) => {
        let _user = { ...user };
        _user[`${name}`] = e.checked ? "SI" : "NO";
        setUser(_user);
    };

    const onDateChange = (e, name) => {
        let _user = { ...user };
        _user[`${name}`] = e.value;
        setUser(_user);
    };

    const formatDate = (value) => {
        return value.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={usuarios} selection={selectedUsers} onSelectionChange={(e) => setSelectedUsers(e.value)} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} globalFilter={globalFilter} header={header} className="p-datatable-customers">
                    <Column selectionMode="multiple" exportable={false} style={{ minWidth: '50px' }}></Column>
                    <Column field="id" header="ID" sortable style={{ minWidth: '50px' }}></Column>
                    <Column field="fechaAlta" header="Fecha Alta" body={(rowData) => formatDate(rowData.fechaAlta)} sortable style={{ minWidth: '100px' }}></Column>
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="apellidos" header="Apellidos" sortable style={{ minWidth: '150px' }}></Column>
                    <Column field="email" header="Email" sortable style={{ minWidth: '200px' }}></Column>
                    <Column field="role" header="Role" sortable style={{ minWidth: '100px' }}></Column>
                    <Column field="activo" header="Activo" body={(rowData) => <Checkbox checked={rowData.activo === "SI"} disabled />} sortable style={{ minWidth: '80px' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '100px' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="fechaAlta">Fecha Alta</label>
                    <Calendar id="fechaAlta" value={user.fechaAlta} onChange={(e) => onDateChange(e, 'fechaAlta')} dateFormat="dd/mm/yy" showIcon />
                </div>
                <div className="field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText id="nombre" value={user.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.nombre })} />
                    {submitted && !user.nombre && <small className="p-error">Nombre is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="apellidos">Apellidos</label>
                    <InputText id="apellidos" value={user.apellidos} onChange={(e) => onInputChange(e, 'apellidos')} required className={classNames({ 'p-invalid': submitted && !user.apellidos })} />
                    {submitted && !user.apellidos && <small className="p-error">Apellidos is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !user.email })} />
                    {submitted && !user.email && <small className="p-error">Email is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <InputText id="password" value={user.password} onChange={(e) => onInputChange(e, 'password')} required className={classNames({ 'p-invalid': submitted && !user.password })} />
                    {submitted && !user.password && <small className="p-error">Password is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="role">Role</label>
                    <Dropdown id="role" value={user.role} options={roles} onChange={(e) => onInputChange(e, 'role')} placeholder="Select a Role" />
                </div>
                <div className="field-checkbox">
                    <Checkbox inputId="activo" checked={user.activo === "SI"} onChange={(e) => onCheckboxChange(e, 'activo')} />
                    <label htmlFor="activo">Activo</label>
                </div>
            </Dialog>

            <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {user && <span>Are you sure you want to delete <b>{user.nombre}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
}
