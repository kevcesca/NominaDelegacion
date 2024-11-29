import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { API_USERS_URL } from '../../%Config/apiConfig';

const ChangePasswordModal = ({ isOpen, onClose, userId, onPasswordChanged }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch(`${API_USERS_URL}/users/${userId}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword,
                    confirmPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al cambiar la contraseña');
            }

            onPasswordChanged();
            onClose(); // Cerrar el modal al completar
        } catch (error) {
            console.error(error);
            setError('Hubo un problema al cambiar la contraseña');
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogContent>
                <TextField
                    label="Nueva Contraseña"
                    type="password"
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Confirmar Contraseña"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                />
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleChangePassword} color="primary">
                    Cambiar Contraseña
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePasswordModal;
