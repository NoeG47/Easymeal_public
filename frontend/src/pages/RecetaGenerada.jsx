import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaDownload, FaHeart } from "react-icons/fa";
import jsPDF from "jspdf";
import { useAuth } from "../context/AuthContext";
import ServicioRecetaDB from "../services/ServicioRecetaDB";
import Swal from "sweetalert2";

const RecetaGenerada = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receta = location.state?.receta;
  const { usuario } = useAuth();
  const [guardado, setGuardado] = useState(false);
  if (!receta) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">No se pudo cargar la receta</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-burnt-orange text-white px-6 py-2 rounded-md mb-4 hover:bg-mint hover:scale-105 transform transition duration-300 text-center"
        >
          <FaArrowLeft className="inline mr-2" />
          Volver a la Nevera
        </button>
      </div>
    );
  }

  const descargarPDF = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const margin = 40;
    const pageHeight = doc.internal.pageSize.getHeight() - margin;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;


    const logo = new Image();
    logo.src = "/images/logo.png"; // asegúrate de que exista
    await new Promise((resolve) => (logo.onload = resolve));
    doc.addImage(logo, "PNG", margin, 20, 50, 50);

    // 🖋️ Título y datos del usuario
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Receta personalizada", margin + 60, 50);

    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    const fecha = new Date().toLocaleDateString();
    const autor = usuario?.displayName || usuario?.email || "Usuario";
    doc.text(`Generado por: ${autor}`, margin + 60, 70);
    doc.text(`Fecha: ${fecha}`, margin + 60, 85);

    // 📄 Contenido de la receta
    const textoDividido = doc.splitTextToSize(receta, pageWidth);
    let y = 120;

    textoDividido.forEach((linea) => {
      if (y > pageHeight) {
        doc.addPage();
        y = margin;
      }
      doc.text(linea, margin, y);
      y += 18;
    });

    doc.save("receta.pdf");
  };

  const guardarReceta = async () => {
    const titulo = "Receta personalizada";
    try {
      await ServicioRecetaDB.guardarReceta(usuario.uid, titulo, receta);
      setGuardado(true);
      Swal.fire({
        icon: "success",
        title: "Receta guardada",
        text: "Se ha añadido a tus favoritas 🍽️",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la receta.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Receta Generada</h1>

      <div className="relative bg-yellow-300 w-full max-w-4xl p-10 rounded-lg shadow-lg text-gray-800 mb-10 font-sans">
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-red-600 w-10 h-10 rounded-full shadow-md"></div>
        <pre className="whitespace-pre-wrap text-lg font-sans">{receta}</pre>
      </div>

      {/* Botones responsivos */}
      <div className="flex flex-wrap gap-4 justify-center  w-full">
        <button
          onClick={() => navigate("/nevera")}
          className="w-full sm:w-auto bg-burnt-orange text-white px-6 py-2 rounded-md hover:bg-mint hover:scale-105 transform transition duration-300"
        >
          <FaArrowLeft className="inline mr-2" />
          Volver a la Nevera
        </button>

        <button
          onClick={descargarPDF}
          className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 hover:scale-105 transform transition duration-300"
        >
          <FaDownload className="inline mr-2" />
          Descargar PDF
        </button>

        <button
          onClick={guardarReceta}
          disabled={guardado}
          className={`w-full sm:w-auto px-6 py-2 rounded-md transform transition duration-300 ${
            guardado
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-peach text-red-600 hover:bg-peach hover:scale-105"
          }`}
        >
          <FaHeart className="inline mr-2" />
          {guardado ? "Guardado" : "Guardar"}
        </button>
      </div>
    </div>
  );
};

export default RecetaGenerada;
