import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children, persistencia = "local" }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const tipoPersistencia =
      persistencia === "session"
        ? browserSessionPersistence
        : browserLocalPersistence;
    let unsubscribe = () => {};
    // Configura persistencia y escucha cambios de sesión
    setPersistence(auth, tipoPersistencia)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUsuario(user);
          setCargando(false);
        });

        return unsubscribe;
      })
      .catch((error) => {
        console.error("Error al establecer persistencia:", error);
        setCargando(false);
      });
    return () => unsubscribe();
  }, [persistencia]);

  const refrescarUsuario = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      // Obtener el objeto actual
      const user = auth.currentUser;

      // forzar una nueva referencia usando Object.assign()
      const userConReferenciaNueva = Object.assign(
        Object.create(Object.getPrototypeOf(user)),
        user
      );

      // Guardar en el contexto
      setUsuario(userConReferenciaNueva);
    }
  };

  return (
    <AuthContext.Provider
      value={{ usuario, cargando, setUsuario, refrescarUsuario }}
    >
      {!cargando && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
