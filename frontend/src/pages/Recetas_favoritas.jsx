import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { useAuth } from "../context/AuthContext";
import ServicioRecetaDB from "../services/ServicioRecetaDB";
import Swal from "sweetalert2";

const Recetas_favoritas = () => {
  const { usuario } = useAuth();
  const [recetas, setRecetas] = useState([]);

  const [mostrarTodo, setMostrarTodo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const data = await ServicioRecetaDB.obtenerRecetas(usuario.uid);
        setRecetas(data);
      } catch (error) {
        console.error("Error al cargar recetas guardadas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (usuario?.uid) {
      fetchRecetas();
    }
  }, [usuario]);

  const toggleMostrar = (index) => {
    setMostrarTodo((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const descargarPDF = async (recetaObj, index) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const margin = 40;
    const pageHeight = doc.internal.pageSize.getHeight() - margin;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;

    const logo = new Image();
    logo.src = "/images/logo.png";
    await new Promise((resolve) => (logo.onload = resolve));
    doc.addImage(logo, "PNG", margin, 20, 50, 50);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text(
      recetaObj.titulo || `Receta favorita #${index + 1}`,
      margin + 60,
      50
    );

    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    const fecha = new Date().toLocaleDateString();
    const autor = usuario?.displayName || usuario?.email || "Usuario";
    doc.text(`Generado por: ${autor}`, margin + 60, 70);
    doc.text(`Fecha: ${fecha}`, margin + 60, 85);

    const textoDividido = doc.splitTextToSize(recetaObj.contenido, pageWidth); // ✅ ahora es un string
    let y = 120;

    textoDividido.forEach((linea) => {
      if (y > pageHeight) {
        doc.addPage();
        y = margin;
      }
      doc.text(linea, margin, y);
      y += 18;
    });

    doc.save(`${recetaObj.titulo || `receta_${index + 1}`}.pdf`);
  };

  const eliminarReceta = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta receta se eliminará permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await ServicioRecetaDB.eliminarReceta(id, usuario.uid);
        setRecetas((prev) => prev.filter((r) => r.id !== id));
        Swal.fire(
          "¡Eliminada!",
          "La receta fue eliminada con éxito",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar la receta:", error);
        Swal.fire("Error", "No se pudo eliminar la receta", "error");
      }
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">
          Cargando tus recetas favoritas...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-3xl space-y-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Recetas guardadas
        </h1>

        {recetas.length > 0 ? (
          recetas.map((receta, index) => (
            <div key={receta.id} className="bg-peach p-6 rounded-2xl shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <h2 className="text-lg font-semibold">
                  {receta.titulo || `Receta favorita #${index + 1}`}
                </h2>
                <button
                  onClick={() => descargarPDF(receta, index)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
                >
                  Descargar PDF
                </button>
                <button
                  onClick={() => eliminarReceta(receta.id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
                >
                  Eliminar
                </button>
              </div>

              <p className="text-gray-800 text-sm mb-4 whitespace-pre-line">
                {mostrarTodo[index]
                  ? receta.contenido
                  : receta.contenido.slice(0, 150) +
                    (receta.contenido.length > 200 ? "..." : "")}
              </p>

              {receta.contenido.length > 200 && (
                <div className="flex justify-end">
                  <button
                    onClick={() => toggleMostrar(index)}
                    className="bg-burnt-orange hover:bg-orange-600 transition-colors text-white text-sm px-4 py-2 rounded"
                  >
                    {mostrarTodo[index] ? "Leer menos" : "Leer más"}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-black">
            No hay recetas favoritas guardadas.
          </p>
        )}
      </div>
    </div>
  );
};

export default Recetas_favoritas;
