import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Swal from "sweetalert2";

const OlvidarContrasena = () => {
  const [correo, setCorreo] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!correo) {
      Swal.fire("Error", "Introduce tu correo electrónico.", "error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, correo);
      Swal.fire(
        "Correo enviado",
        "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        "success"
      );
    } catch (error) {
      let mensajeError;

      switch (error.code) {
        case "auth/user-not-found":
          mensajeError = "Este correo no está registrado.";
          break;
        case "auth/invalid-email":
          mensajeError = "El correo no es válido.";
          break;
        default:
          mensajeError =
            "Ocurrió un error al intentar enviar el correo. Inténtalo más tarde.";
          break;
      }

      Swal.fire("Error", mensajeError, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="bg-white border border-gray-300 rounded-2xl px-8 py-10 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          Restablecer Contraseña
        </h2>
        <form onSubmit={handleResetPassword} className="space-y-5">
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Introduce tu correo"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage"
            required
          />
          <button
            type="submit"
            className="w-full bg-sage text-white py-3 rounded-lg font-semibold hover:bg-mint hover:scale-105 duration-300 cursor-pointer"
          >
            Enviar enlace
          </button>
        </form>
        <p className="text-center mt-6">
          <Link to="/login" className="text-sage font-semibold hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OlvidarContrasena;
