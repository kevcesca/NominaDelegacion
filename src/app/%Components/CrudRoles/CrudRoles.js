// src/app/roles/page.js

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Checkbox } from 'primereact/checkbox';
import styles from './CrudRoles.module.css';

const CrudRoles = () => {
    const emptyRole = { id: '', name: '', permissions: [] };
    const availablePermissions = [
        { name: 'Crear', code: 'CREATE' },
        { name: 'Leer', code: 'READ' },
        { name: 'Actualizar', code: 'UPDATE' },
        { name: 'Eliminar', code: 'DELETE' }
    ];

    const [roles, setRoles] = useState([]);
    const [roleDialog, setRoleDialog] = useState(false);
    const [deleteRoleDialog, setDeleteRoleDialog] = useState(false);
    const [role, setRole] = useState(emptyRole);
    const [selectedRoles, setSelectedRoles] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const hardcodedRoles = [
            { id: '1', name: 'Admin', permissions: ['CREATE', 'READ', 'UPDATE', 'DELETE'] },
            { id: '2', name: 'Editor', permissions: ['READ', 'UPDATE'] },
            { id: '3', name: 'Viewer', permissions: ['READ'] }
        ];
        setRoles(hardcodedRoles);
    }, []);

    const openNew = () => {
        setRole(emptyRole);
        setSubmitted(false);
        setRoleDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRoleDialog(false);
    };

    const hideDeleteRoleDialog = () => {
        setDeleteRoleDialog(false);
    };

    const saveRole = () => {
        setSubmitted(true);

        if (role.name.trim()) {
            let _roles = [...roles];
            let _role = { ...role };

            if (role.id) {
                const index = _roles.findIndex(r => r.id === role.id);
                _roles[index] = _role;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Role Updated', life: 3000 });
            } else {
                _role.id = String(_roles.length + 1);
                _roles.push(_role);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Role Created', life: 3000 });
            }

            setRoles(_roles);
            setRoleDialog(false);
            setRole(emptyRole);
        }
    };

    const editRole = (role) => {
        setRole({ ...role });
        setRoleDialog(true);
    };

    const confirmDeleteRole = (role) => {
        setRole(role);
        setDeleteRoleDialog(true);
    };

    const deleteRole = () => {
        let _roles = roles.filter(val => val.id !== role.id);
        setRoles(_roles);
        setDeleteRoleDialog(false);
        setRole(emptyRole);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Role Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _role = { ...role };
        _role[`${name}`] = val;
        setRole(_role);
    };

    const onPermissionChange = (e, permission) => {
        let _permissions = role.permissions ? [...role.permissions] : [];
        if (e.checked) _permissions.push(permission.code);
        else _permissions = _permissions.filter((perm) => perm !== permission.code);
        setRole({ ...role, permissions: _permissions });
    };

    const roleDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" outlined className={`${styles['button-teal']} ${styles['button-margin']}`} onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className={`${styles['button-gold']} ${styles['button-margin']}`} onClick={saveRole} />
        </>
    );

    const deleteRoleDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined className={`${styles['button-teal']} ${styles['button-margin']}`} onClick={hideDeleteRoleDialog} />
            <Button label="Yes" icon="pi pi-check" className={`${styles['button-red']} ${styles['button-margin']}`} onClick={deleteRole} />
        </>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded outlined className={`mr-2 ${styles['button-gold']} ${styles['button-margin']}`} onClick={() => editRole(rowData)} />
                <Button icon="pi pi-trash" rounded outlined className={`${styles['button-red']} ${styles['button-margin']}`} onClick={() => confirmDeleteRole(rowData)} />
            </>
        );
    };

    return (
        <div className={styles.pageContainer}>
            <Toast ref={toast} />
            <div className={styles.card}>
                <Toolbar className="mb-4" left={() => (
                    <Button label="New Role" icon="pi pi-plus" className={`${styles['button-gold']} ${styles['button-margin']}`} onClick={openNew} />
                )}></Toolbar>
                <DataTable ref={dt} value={roles} selection={selectedRoles} onSelectionChange={(e) => setSelectedRoles(e.value)}
                    dataKey="id" paginator rows={10} globalFilter={globalFilter}>
                    <Column field="id" header="ID" sortable></Column>
                    <Column field="name" header="Role Name" sortable></Column>
                    <Column body={actionBodyTemplate} />
                </DataTable>
            </div>

            <Dialog visible={roleDialog} style={{ width: '450px' }} header="Role Details" modal footer={roleDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name">Role Name</label>
                    <InputText id="name" value={role.name} onChange={(e) => onInputChange(e, 'name')} required />
                </div>
                <div className="field">
                    <label>Permissions</label>
                    {availablePermissions.map((permission) => (
                        <div key={permission.code} className="field-checkbox">
                            <Checkbox inputId={permission.code} checked={role.permissions.includes(permission.code)}
                                onChange={(e) => onPermissionChange(e, permission)} />
                            <label htmlFor={permission.code}>{permission.name}</label>
                        </div>
                    ))}
                </div>
            </Dialog>

            <Dialog visible={deleteRoleDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRoleDialogFooter} onHide={hideDeleteRoleDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {role && <span>Are you sure you want to delete <b>{role.name}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default CrudRoles;
