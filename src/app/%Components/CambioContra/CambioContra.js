// components/NuevaContrasenaModal.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function NuevaContrasenaModal({ isOpen, onClose }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const setNewPasswordHandler = (event) => {
        event.preventDefault();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        if (newPassword !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden.');
        } else if (!passwordRegex.test(newPassword)) {
            setPasswordError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.');
        } else {
            setPasswordError('');
            alert('Contraseña cambiada con éxito');
            router.push('/GestionUsuarios');
            onClose(); // Cierra el modal después de cambiar la contraseña
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <h2>Establecer Nueva Contraseña</h2>
                <form onSubmit={setNewPasswordHandler}>
                    <div className={styles.passwordField}>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nueva Contraseña"
                            required
                            className={styles.inputField}
                        />
                        <span
                            className={styles.eyeIcon}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? '👁️' : '👁️'}
                        </span>
                    </div>

                    <div className={styles.passwordField}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmar Contraseña"
                            required
                            className={styles.inputField}
                        />
                        <span
                            className={styles.eyeIcon}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? '👁️' : '👁️'}
                        </span>
                    </div>
                    <button type="submit" className={styles.button}>Guardar Contraseña</button>
                </form>
                {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
            </div>
        </div>
    );
}
