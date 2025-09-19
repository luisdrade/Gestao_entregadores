import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se o usuário é admin
  if (!user.is_staff && !user.is_superuser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
