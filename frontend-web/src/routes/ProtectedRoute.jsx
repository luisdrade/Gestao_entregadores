import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  
  console.log('🔍 ProtectedRoute - user:', user);
  console.log('🔍 ProtectedRoute - loading:', loading);
  console.log('🔍 ProtectedRoute - role:', role);
  
  if (loading) {
    console.log('🔍 ProtectedRoute - Loading, retornando null');
    return null;
  }
  
  if (!user) {
    console.log('🔍 ProtectedRoute - Sem usuário, redirecionando para login');
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    console.log('🔍 ProtectedRoute - Role não confere, redirecionando para /');
    return <Navigate to="/" replace />;
  }
  
  console.log('🔍 ProtectedRoute - Acesso permitido, renderizando children');
  return children;
}





