// src/components/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que los campos no estén vacíos
    if (!correo || !password) {
      Swal.fire(
        "Error",
        "El correo y la contraseña son obligatorios.",
        "error"
      );
      return;
    }

    try {
      // Iniciar sesión en Firebase
      await signInWithEmailAndPassword(auth, correo, password);

      // Mensaje de éxito
      Swal.fire("Sesión iniciada", "¡Bienvenido a EasyMeal!", "success");
      navigate("/nevera");
    } catch (error) {
      //console.error("Error en login:", error);

      // Manejo completo de errores de autenticación
      let mensajeError;

      switch (error.code) {
        case "auth/user-not-found":
          mensajeError =
            "El correo no está registrado. Verifica tu correo o regístrate.";
          break;
        case "auth/wrong-password":
          mensajeError = "La contraseña es incorrecta. Inténtalo de nuevo.";
          break;
        case "auth/invalid-email":
          mensajeError = "El formato del correo no es válido.";
          break;
        case "auth/user-disabled":
          mensajeError = "La cuenta ha sido desactivada. Contacta al soporte.";
          break;
        case "auth/too-many-requests":
          mensajeError = "Demasiados intentos fallidos. Inténtalo más tarde.";
          break;
        case "auth/network-request-failed":
          mensajeError = "Error de red. Verifica tu conexión a internet.";
          break;
        case "auth/invalid-credential":
          mensajeError = "Correo o contraseña incorrectos. Inténtalo de nuevo.";
          break;
        default:
          mensajeError = "Error al iniciar sesión. Inténtalo de nuevo.";
          break;
      }

      Swal.fire("Error", mensajeError, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="bg-white border border-gray-300 rounded-2xl px-8 py-10 w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage"
              required
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-center mt-2">
            <Link
              to="/recuperar"
              className="text-sage hover:underline cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </p>

          <button
            type="submit"
            className="w-full bg-sage text-white py-3 rounded-lg font-semibold hover:bg-mint hover:scale-105 duration-300 cursor-pointer"
          >
            Acceder
          </button>
        </form>
        <p className="text-center mt-6 hover:scale-105 duration-300">
          ¿No tienes cuenta?{" "}
          <Link to="/registrar" className="text-sage font-semibold">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
