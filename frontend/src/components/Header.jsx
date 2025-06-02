import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu_lateral from "./Menu_lateral";
import Modal from "./Modal";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();
  const { usuario, setUsuario } = useAuth();

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const toggleModal = () => setModalAbierto(!modalAbierto);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUsuario(null);
      setMenuAbierto(false);
      setModalAbierto(false);
      localStorage.removeItem("ingredientesSeleccionados");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <header className="w-full flex bg-peach items-center justify-between p-4 shadow-lg">
        {/* Logo y nombre de la app */}
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/images/logo.ico"
            alt="EasyMeal Logo"
            className="w-16 md:w-20 lg:w-24 h-auto"
          />
          <span className="text-2xl md:text-3xl font-bold text-sage">
            EasyMeal
          </span>
        </div>

        {/* Foto de perfil y menú lateral */}
        <div className="flex items-center space-x-3">
          {usuario && (
            <img
              src={usuario.photoURL}
              alt="Foto de perfil"
              className="w-10 md:w-12 h-10 md:h-12 rounded-full border-2 border-white cursor-pointer"
              title={usuario.displayName || usuario.email}
              onClick={toggleModal}
            />
          )}
          <div
            className="w-10 md:w-12 pb-2 text-5xl cursor-pointer flex items-center justify-center"
            onClick={toggleMenu}
          >
            ≡
          </div>
        </div>
      </header>

      {/* Menú lateral */}
      <Menu_lateral Abierto={menuAbierto} Cerrado={toggleMenu} />

      {/* Modal para perfil */}
      {usuario && (
        <Modal
          isOpen={modalAbierto}
          onClose={toggleModal}
          usuario={usuario}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Header;
