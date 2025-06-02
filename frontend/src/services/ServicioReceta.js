// ServicioReceta.js

import http from "./http-axios";

const generarReceta = async (ingredientes) => {
  try {
    const response = await http.post("/recetas", {
      ingredientes: ingredientes,
    });
    return response.data.receta; // Solo retorna la receta
  } catch (error) {
    console.error("Error al generar la receta:", error);

    // Devuelve solo el mensaje de error si está presente
    const errorMessage = error.response?.data?.error || "Error desconocido";
    throw new Error(errorMessage);
  }
};

export default {
  generarReceta,
};
