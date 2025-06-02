import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
//La línea de abajo solo se usa para colores
import "../src/styles/index.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
