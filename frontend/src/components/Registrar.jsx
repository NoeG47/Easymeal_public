import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import Swal from "sweetalert2";
import { crearPerfil } from "../services/ServicioUsuario";
import { Eye, EyeOff } from "lucide-react";
import Tooltip from "./Tooltip";

const Registrar = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [avatarSeleccionado, setAvatarSeleccionado] = useState(
    "/perfiles/perfil1.png"
  );
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const navigate = useNavigate();

  const avatares = [
    "/perfiles/perfil1.png",
    "/perfiles/perfil2.png",
    "/perfiles/perfil3.png",
    "/perfiles/perfil4.png",
    "/perfiles/perfil5.png",
  ];

  const validarPassword = (password) => {
    if (password.length < 8) return "Mínimo 8 caracteres.";
    if (!/[A-Z]/.test(password)) return "Debe tener al menos una mayúscula.";
    if (!/[a-z]/.test(password)) return "Debe tener al menos una minúscula.";
    if (!/\d/.test(password)) return "Debe tener al menos un número.";
    if (!/[@$!%*?&]/.test(password))
      return "Debe tener al menos un carácter especial.";
    return true;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const validationMessage = validarPassword(newPassword);
    if (validationMessage === true) {
      setPasswordError("");
      setTooltipVisible(false);
    } else {
      setPasswordError(validationMessage);
      setTooltipVisible(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError) {
      setTooltipVisible(true);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        correo,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: nombre,
        photoURL: avatarSeleccionado,
      });

      await crearPerfil(user.uid, nombre, correo);
      await signOut(auth);
      await Swal.fire("Registro exitoso", "¡Bienvenido a EasyMeal!", "success");
      navigate("/login");
    } catch (error) {
      //console.error("Error en registro:", error);

      let mensajeError;
      switch (error.code) {
        case "auth/email-already-in-use":
          mensajeError = "El correo ya está en uso.";
          break;
        case "auth/invalid-email":
          mensajeError = "El formato del correo no es válido.";
          break;
        case "auth/weak-password":
          mensajeError = "La contraseña es demasiado débil.";
          break;
        case "auth/network-request-failed":
          mensajeError = "Error de red. Verifica tu conexión.";
          break;
        default:
          mensajeError = "Error al registrar el usuario. Inténtalo de nuevo.";
          break;
      }

      Swal.fire("Error", mensajeError, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 py-8 sm:py-12">
      <div className="bg-white border border-gray-300 rounded-2xl px-6 py-8 w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          Regístrate en EasyMeal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              value={nombre}
              placeholder="Nombre de usuario"
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage"
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={correo}
              placeholder="Correo electrónico"
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage"
              required
            />
          </div>
          <div className="relative">
            <input
              type={mostrarPassword ? "text" : "password"}
              value={password}
              placeholder="Contraseña"
              onChange={handlePasswordChange}
              onFocus={() => setTooltipVisible(passwordError !== "")}
              onBlur={() => setTooltipVisible(false)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage"
              required
            />
            <Tooltip message={passwordError} visible={tooltipVisible} />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div>
            <p className="mb-2 font-medium text-gray-700">
              Selecciona un avatar:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {avatares.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className={`w-16 h-16 rounded-full border-4 cursor-pointer transition-transform ${
                    avatarSeleccionado === avatar
                      ? "border-sage"
                      : "border-gray-200 hover:scale-110 duration-300"
                  }`}
                  onClick={() => setAvatarSeleccionado(avatar)}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-sage text-white py-3 rounded-lg font-semibold hover:bg-mint hover:scale-105 duration-300"
          >
            Crear Cuenta
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registrar;
