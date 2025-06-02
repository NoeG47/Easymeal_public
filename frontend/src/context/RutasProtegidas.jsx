import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RutaProtegida = ({ children }) => {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/" />;
  
  return children;
};

export default RutaProtegida;
