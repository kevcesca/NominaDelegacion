'use client';

import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from '../NuevaContrasena/NuevaContrasena.module.css'; // Usamos estilos adicionales si son necesarios
import { API_USERS_URL } from '../%Config/apiConfig'; // URL base de la API
import { useAuth } from '../context/AuthContext';  // Importamos el contexto de autenticación

export default function RecuperarContraseña() {
  const { user, logout } = useAuth();  // Recuperamos el usuario y la función logout desde el contexto
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const idEmpleado = user?.id_empleado; // Obtenemos el ID del empleado directamente desde el contexto

  // Asegurarnos de que el valor de idEmpleado esté disponible
  useEffect(() => {
    if (!idEmpleado) {
      setError('No se ha encontrado el ID del empleado en la sesión.');
    }
  }, [idEmpleado]);

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
    if (!idEmpleado) {
      alert('El ID del empleado es obligatorio.');
      return;
    }

    setLoading(true);
    setError(null);

    // Verificar que el idEmpleado se pase correctamente en la solicitud
    console.log("Enviando solicitud con ID:", idEmpleado);  // Debug

    // Solicitud para cambiar la contraseña
    try {
      const response = await fetch(`${API_USERS_URL}/users/${idEmpleado}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword,     // Nueva contraseña
          confirmPassword, // Confirmación de la nueva contraseña
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error al cambiar la contraseña.');
        setLoading(false);
        return;
      }

      alert(`La contraseña ha sido cambiada con éxito para el empleado con ID: ${idEmpleado}`);

      // Llamamos al logout después de cambiar la contraseña
      logout();  // Cerrar la sesión del usuario

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

          {/* El campo ID Empleado se elimina ya que se usa directamente desde el contexto */}

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
