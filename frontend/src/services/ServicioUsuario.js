// src/services/ServicioUsuario.js
import axios from "axios";
import { updateProfile } from "firebase/auth";

const API_URL = "http://localhost:8080/api/usuarios";

// Crear perfil de usuario en MySQL
export const crearPerfil = async (firebaseUid, nombre, correo) => {
  try {
    const response = await axios.post(`${API_URL}/crear`, {
      firebaseUid,
      nombre,
      correo,
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el perfil del usuario:", error);
    throw error;
  }
};

// Actualizar nombre de usuario en MySQL y Firebase
export const actualizarNombre = async (firebaseUser, nuevoNombre) => {
  try {
    // 1. Actualizar en Firebase
    await updateProfile(firebaseUser, {
      displayName: nuevoNombre,
    });

    // 2. Actualizar en MySQL
    const response = await axios.put(`${API_URL}/${firebaseUser.uid}/nombre`, {
      nombre: nuevoNombre,
    });

    return response.data;
  } catch (error) {
    console.error("Error al actualizar el nombre del usuario:", error);
    throw error;
  }
};
