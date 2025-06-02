// ServicioRecetaDB.js

import http from "./http-axios";

const guardarReceta = async (firebase_uid, titulo, contenido) => {
  return await http.post("/recetas/guardar", {
    firebase_uid,
    titulo,
    contenido,
  });
};

const obtenerRecetas = async (firebase_uid) => {
  const response = await http.get(
    `/recetas/listar?firebase_uid=${firebase_uid}`
  );
  return response.data;
};

// Eliminar receta por ID y UID del usuario
const eliminarReceta = async (idReceta, firebase_uid) => {
  return await http.delete(
    `/recetas/eliminar/${idReceta}?firebase_uid=${firebase_uid}`
  );
};
export default {
  guardarReceta,
  obtenerRecetas,
  eliminarReceta,
};
