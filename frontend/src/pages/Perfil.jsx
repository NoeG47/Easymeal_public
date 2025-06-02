import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
} from "firebase/auth";
import { actualizarNombre } from "../services/ServicioUsuario";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Perfil = () => {
  const { usuario, refrescarUsuario } = useAuth();
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarContrasenaActual, setMostrarContrasenaActual] = useState(false);
  const [contrasenaActual, setContrasenaActual] = useState("");
  const navigate = useNavigate();
  const [fotoSeleccionada, setFotoSeleccionada] = useState("");
  const avatares = [
    "/perfiles/perfil1.png",
    "/perfiles/perfil2.png",
    "/perfiles/perfil3.png",
    "/perfiles/perfil4.png",
    "/perfiles/perfil5.png",
  ];
  useEffect(() => {
    if (!usuario) {
      navigate("/login");
    }
  }, [usuario, navigate]);
  useEffect(() => {
    if (usuario) {
      setFotoSeleccionada(usuario.photoURL || "/perfiles/perfil1.png");
    } else {
      navigate("/login");
    }
  }, [usuario, navigate]);
  const cambiarNombre = async () => {
    try {
      if (!nuevoNombre.trim()) {
        Swal.fire("El nombre no puede estar vacío", "", "warning");
        return;
      }

      await actualizarNombre(usuario, nuevoNombre);
      Swal.fire("¡Nombre actualizado con éxito!", "", "success");
      setNuevoNombre("");
    } catch (error) {
      console.error("Error al actualizar el nombre:", error);
      Swal.fire("Error al actualizar el nombre", error.message, "error");
    }
  };
  const cambiarFotoPerfil = async () => {
    try {
      await updateProfile(usuario, { photoURL: fotoSeleccionada });
      await refrescarUsuario();

      Swal.fire("¡Foto de perfil actualizada!", "", "success");
    } catch (error) {
      console.error("Error al actualizar la foto:", error);
      Swal.fire("Error al actualizar la foto", error.message, "error");
    }
  };
  const cambiarContrasena = async () => {
    try {
      if (nuevaContrasena.length < 8) {
        Swal.fire(
          "La contraseña debe tener al menos 8 caracteres",
          "",
          "warning"
        );
        return;
      }

      const credential = EmailAuthProvider.credential(
        usuario.email,
        contrasenaActual
      );

      await reauthenticateWithCredential(usuario, credential);
      await updatePassword(usuario, nuevaContrasena);
      setNuevaContrasena("");
      setContrasenaActual("");
      Swal.fire("¡Contraseña actualizada con éxito!", "", "success");
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      Swal.fire("Error al actualizar la contraseña", error.message, "error");
    }
  };

  if (!usuario) return null;

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center bg-white px-6 sm:px-12 md:px-20 py-8 overflow-x-hidden">
      <div className="bg-white border border-gray-300 rounded-2xl px-8 py-12 w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8">
          Perfil de Usuario
        </h2>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">
            Foto de Perfil
          </label>
          <div className="flex flex-wrap gap-4 justify-center">
            {avatares.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                onClick={() => setFotoSeleccionada(avatar)}
                className={`w-20 h-20 object-cover rounded-full border-4 cursor-pointer transition-transform ${
                  fotoSeleccionada === avatar
                    ? "border-mint scale-105"
                    : "border-transparent hover:scale-105"
                }`}
              />
            ))}
          </div>
          <button
            onClick={cambiarFotoPerfil}
            className="bg-sage text-white px-6 py-3 rounded-xl text-lg mt-4 hover:bg-mint transition-all w-full"
          >
            Guardar Foto de Perfil
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Nombre</label>
          <input
            type="text"
            value={nuevoNombre}
            placeholder={usuario.displayName || "Nombre no disponible"}
            onChange={(e) => setNuevoNombre(e.target.value)}
            className="text-lg border border-gray-300 rounded-xl px-4 py-3 w-full"
          />
          <button
            onClick={cambiarNombre}
            className="bg-sage text-white px-6 py-3 rounded-xl text-lg mt-4 hover:bg-mint transition-all w-full"
          >
            Actualizar Nombre
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Correo</label>
          <p className="text-lg border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
            {usuario.email}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">
            Contraseña Actual
          </label>
          <div className="relative">
            <input
              type={mostrarContrasenaActual ? "text" : "password"}
              value={contrasenaActual}
              placeholder="Introduce tu contraseña actual"
              onChange={(e) => setContrasenaActual(e.target.value)}
              className="text-lg border border-gray-300 rounded-xl px-4 py-3 w-full"
            />
            <button
              type="button"
              onClick={() =>
                setMostrarContrasenaActual(!mostrarContrasenaActual)
              }
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {mostrarContrasenaActual ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">
            Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={mostrarContrasena ? "text" : "password"}
              value={nuevaContrasena}
              placeholder="Nueva contraseña"
              onChange={(e) => setNuevaContrasena(e.target.value)}
              className="text-lg border border-gray-300 rounded-xl px-4 py-3 w-full"
            />
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            onClick={cambiarContrasena}
            className="bg-sage text-white px-6 py-3 rounded-xl text-lg mt-4 hover:bg-mint transition-all w-full"
          >
            Actualizar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
