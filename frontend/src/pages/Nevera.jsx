import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServicioIngrediente from "../services/ServicioIngrediente";
import ServicioReceta from "../services/ServicioReceta";
import Swal from "sweetalert2";
import { FaSearch, FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  capitalizar,
  manejarPaginaAnterior,
  manejarPaginaSiguiente,
  manejarClickBusqueda,
  SeleccionIngredientes,
} from "../herramientas/funcionesIngredientes";

const Nevera = () => {
  const navigate = useNavigate();
  const [ingredientes, setIngredientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaInput, setBusquedaInput] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const ingredientesPorPagina = 12;
  const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
  const [letraSeleccionada, setLetraSeleccionada] = useState("");
  const [cargando, setCargando] = useState(false);
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState(
    () => {
      const guardados = localStorage.getItem("ingredientesSeleccionados");
      return guardados ? JSON.parse(guardados) : [];
    }
  );

  useEffect(() => {
    const cargarIngredientes = async () => {
      try {
        const data = await ServicioIngrediente.obtenerIngredientes();
        setIngredientes(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los ingredientes.",
        });
      }
    };
    cargarIngredientes();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ingredientesSeleccionados",
      JSON.stringify(ingredientesSeleccionados)
    );
  }, [ingredientesSeleccionados]);

  const ingredientesFiltrados = ingredientes.filter((ingrediente) => {
    const nombre = ingrediente.nombre.toLowerCase();
    const cumpleBusqueda = nombre.includes(busqueda.toLowerCase());
    const cumpleLetra = letraSeleccionada
      ? nombre.startsWith(letraSeleccionada.toLowerCase())
      : true;
    return cumpleBusqueda && cumpleLetra;
  });

  const indiceUltimoIngrediente = paginaActual * ingredientesPorPagina;
  const indicePrimerIngrediente =
    indiceUltimoIngrediente - ingredientesPorPagina;
  const ingredientesActuales = ingredientesFiltrados.slice(
    indicePrimerIngrediente,
    indiceUltimoIngrediente
  );

  const totalPaginas = Math.ceil(
    ingredientesFiltrados.length / ingredientesPorPagina
  );

  const ingredientesSeleccionadosDetalles = ingredientes.filter((ing) =>
    ingredientesSeleccionados.includes(ing.id)
  );

  const limpiarBusqueda = () => {
    setBusquedaInput("");
    setBusqueda("");
  };

  const limpiarFiltroLetra = () => {
    setLetraSeleccionada("");
    setPaginaActual(1);
  };

  const generarReceta = async () => {
    if (ingredientesSeleccionadosDetalles.length < 3) {
      Swal.fire({
        icon: "warning",
        title: "Ingredientes insuficientes",
        text: "Debes seleccionar al menos 3 ingredientes.",
      });
      return;
    }

    try {
      setCargando(true);

      const nombresIngredientes = ingredientesSeleccionadosDetalles
        .map((ing) => ing.nombre)
        .join(", ");

      const receta = await ServicioReceta.generarReceta(nombresIngredientes);

      setIngredientesSeleccionados([]);
      localStorage.removeItem("ingredientesSeleccionados");

      navigate("/receta-generada", { state: { receta } });
    } catch (error) {
      console.error("Error al generar la receta:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo generar la receta.",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {cargando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40 pointer-events-none"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-sm m-3 text-center">
            <h2 className="text-xl font-bold mb-4">
              🍽️ Tu receta se está cocinando...
            </h2>
            <div className="text-3xl flex justify-center gap-2 animate-bounce">
              <span role="img" aria-label="tomate">
                🍅
              </span>
              <span role="img" aria-label="zanahoria">
                🥕
              </span>
              <span role="img" aria-label="huevo">
                🍳
              </span>
              <span role="img" aria-label="carne">
                🥩
              </span>
              <span role="img" aria-label="fuego">
                🔥
              </span>
            </div>
            <p className="text-sm mt-4 text-gray-600">
              Esto puede tardar unos segundos...
            </p>
          </div>
        </div>
      )}

      <div className="flex-grow flex flex-col justify-start py-10 px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* Columna izquierda */}
          <div className="col-span-2">
            <h1 className="font-bold text-2xl md:text-3xl my-2">Mi nevera</h1>
            <h2 className="text-base md:text-2xl my-4">
              ¿Qué ingredientes quieres que tenga la receta?
            </h2>

            {/* Búsqueda */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6 px-3 sm:px-3">
              <input
                type="text"
                placeholder="Buscar"
                value={busquedaInput}
                onChange={(e) => setBusquedaInput(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-row gap-2">
                <button
                  onClick={() =>
                    manejarClickBusqueda(
                      busquedaInput,
                      setBusqueda,
                      setPaginaActual,
                      ingredientes
                    )
                  }
                  className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg"
                >
                  <FaSearch />
                </button>
                {busquedaInput && (
                  <button
                    onClick={limpiarBusqueda}
                    className="text-gray-500 hover:text-gray-700 p-2"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Filtro por letra */}
            <div className="flex flex-wrap gap-2 mb-4 px-3 sm:px-3">
              {abecedario.map((letra) => (
                <button
                  key={letra}
                  onClick={() => {
                    setLetraSeleccionada((prev) =>
                      prev === letra ? "" : letra
                    );
                    setPaginaActual(1);
                  }}
                  className={`border border-gray-300 px-3 py-1 rounded ${
                    letraSeleccionada === letra
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  } hover:bg-blue-300`}
                >
                  {letra}
                </button>
              ))}
              {letraSeleccionada && (
                <button
                  onClick={limpiarFiltroLetra}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Quitar filtro
                </button>
              )}
            </div>

            {/* Lista de ingredientes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3">
              {ingredientesActuales.map((ingrediente) => {
                const seleccionado = ingredientesSeleccionados.includes(
                  ingrediente.id
                );
                return (
                  <div
                    key={ingrediente.id}
                    onClick={() =>
                      SeleccionIngredientes(
                        ingrediente.id,
                        ingredientesSeleccionados,
                        setIngredientesSeleccionados
                      )
                    }
                    className={`border border-gray-300 rounded-lg p-3 min-w-[100px] text-center shadow-md cursor-pointer hover:scale-105 transform transition duration-300 ${
                      seleccionado ? "bg-mint" : "border-gray-300"
                    }`}
                  >
                    {capitalizar(ingrediente.nombre)}
                  </div>
                );
              })}
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center gap-4 m-6 p-4">
              <button
                onClick={() =>
                  manejarPaginaAnterior(paginaActual, setPaginaActual)
                }
                disabled={paginaActual === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:scale-125 transform transition duration-200"
              >
                <FaArrowLeft />
              </button>
              <p className="text-base md:text-lg text-center">
                Página {paginaActual} de {totalPaginas}
              </p>
              <button
                onClick={() =>
                  manejarPaginaSiguiente(
                    paginaActual,
                    totalPaginas,
                    setPaginaActual
                  )
                }
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:scale-125 transform transition duration-300"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>

          {/* Ingredientes seleccionados */}
          <div className="border rounded-lg bg-white border-gray-300 p-4 w-full md:w-auto h-fit">
            {ingredientesSeleccionadosDetalles.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">
                    Ingredientes seleccionados:
                  </h3>
                  <button
                    onClick={() => {
                      setIngredientesSeleccionados([]);
                      localStorage.removeItem("ingredientesSeleccionados");
                    }}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Limpiar ingredientes"
                  >
                    <FaTimes />
                  </button>
                </div>
                <ul className="list-disc pl-5">
                  {ingredientesSeleccionadosDetalles.map((ing) => (
                    <li key={ing.id}>{capitalizar(ing.nombre)}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400 italic">
                Sin ingredientes seleccionados
              </p>
            )}
          </div>
        </div>

        {/* Botón para crear receta */}
        <div className="flex flex-col items-center px-4 py-10">
          <button
            onClick={generarReceta}
            disabled={cargando}
            className={`w-fit text-white px-6 py-2 rounded-md mb-4 text-center text-2xl transition duration-300 transform ${
              cargando
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-burnt-orange hover:bg-mint hover:scale-105"
            }`}
          >
            {cargando ? "Cocinando..." : "Crear receta"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Nevera;
