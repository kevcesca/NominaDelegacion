'use client';

import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from '../NuevaContrasena/NuevaContrasena.module.css'; // Usamos estilos adicionales si son necesarios
import { API_USERS_URL } from '../%Config/apiConfig'; // URL base de la API
import { useAuth } from '../context/AuthContext';  // Importamos el contexto de autenticación

export default function RecuperarContraseña() {
  const { user } = useAuth();  // Recuperamos el usuario desde el contexto
  const [idEmpleado, setIdEmpleado] = useState(user?.id_empleado || '');  // Inicializamos el ID con el valor del contexto (si existe)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Si el ID de empleado no está disponible en el contexto, podemos mostrar un mensaje de error o realizar alguna acción.
  useEffect(() => {
    if (!user?.id_empleado) {
      setError('No se ha encontrado el ID del empleado en la sesión.');
    }
  }, [user]);

  // Función para validar la seguridad de la contraseña
  const validarSeguridadContraseña = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  // Función para cambiar la contraseña
  const changePassword = async () => {
    // Validación de la seguridad de la nueva contraseña
    if (!validarSeguridadContraseña(newPassword)) {
      alert(
        'La contraseña debe tener al menos 8 caracteres, incluir una combinación de letras mayúsculas, minúsculas, números y símbolos.'
      );
      return;
    }

    // Validación de la confirmación de la contraseña
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
      return;
    }

    // Validación del ID del empleado
    if (!idEmpleado.trim()) {
      alert('El ID del empleado es obligatorio.');
      return;
    }

    setLoading(true);
    setError(null);

    // Solicitud para cambiar la contraseña
    try {
      const response = await fetch(`${API_USERS_URL}/users/${idEmpleado}/change-password`, {
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
        const errorData = await response.json();
        setError(errorData.message || 'Error al cambiar la contraseña.');
        setLoading(false);
        return;
      }

      alert(`La contraseña ha sido cambiada con éxito para el empleado con ID: ${idEmpleado}`);
    } catch (err) {
      setError('Ocurrió un error al intentar cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1>Recuperación de Contraseña</h1>

        <div className={styles.section}>
          <h2 className={styles.h2}>Cambiar Contraseña</h2>

          {/* Campo para ID Empleado */}
          <TextField
            fullWidth
            label="ID Empleado"
            variant="outlined"
            value={idEmpleado}
            onChange={(e) => setIdEmpleado(e.target.value)}
            margin="normal"
            required
            disabled
          />

          {/* Campo para Nueva Contraseña */}
          <TextField
            fullWidth
            label="Nueva Contraseña"
            type={showNewPassword ? 'text' : 'password'}
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          {/* Campo para Confirmar Contraseña */}
          <TextField
            fullWidth
            label="Confirmar Contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          {/* Botón de Cambiar Contraseña */}
          <Button
            variant="contained"
            color="primary"
            onClick={changePassword}
            disabled={loading}
            fullWidth
            style={{ marginTop: '16px' }}
          >
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </Button>

          {/* Muestra errores si los hay */}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
