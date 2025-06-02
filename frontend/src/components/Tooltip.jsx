// src/components/Tooltip.jsx
import React from "react";

const Tooltip = ({ message, visible }) => {
  return (
    <div
      className={`absolute left-0 -bottom-12 bg-red-600 text-white text-sm rounded-lg py-2 px-4 shadow-lg whitespace-nowrap z-10 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
};

export default Tooltip;
