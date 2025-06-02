import { Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Login from "./components/Login";
import Registrar from "./components/Registrar";
import Pagina404 from "./pages/Pagina404";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Perfil from "./pages/Perfil";
import Nevera from "./pages/Nevera";
import RecetaGenerada from "./pages/RecetaGenerada";
import { AuthProvider } from "./context/AuthContext";
import RutaProtegida from "./context/RutasProtegidas";
import Recetas_favoritas from "./pages/Recetas_favoritas";
import OlvidarContrasena from "./pages/OlvidarContrasena";

function App() {
  return (
    <AuthProvider persistencia="session">
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow bg-white">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route path="/recuperar" element={<OlvidarContrasena />} />
            <Route path="*" element={<Pagina404 />} />
            <Route
              path="/perfil"
              element={
                <RutaProtegida>
                  <Perfil />
                </RutaProtegida>
              }
            />
            <Route
              path="/nevera"
              element={
                <RutaProtegida>
                  <Nevera />
                </RutaProtegida>
              }
            />
            <Route
              path="/receta-generada"
              element={
                <RutaProtegida>
                  <RecetaGenerada />
                </RutaProtegida>
              }
            />
            <Route
              path="/recetas-favoritas"
              element={
                <RutaProtegida>
                  <Recetas_favoritas />
                </RutaProtegida>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}
export default App;
