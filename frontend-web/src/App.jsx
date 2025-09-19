import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RegistrosProvider } from './context/RegistrosContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import DeliveryDashboard from './pages/DeliveryDashboard'
import DeliveryComunidade from './pages/DeliveryComunidade'
import RegistroEntregaDespesa from './pages/RegistroEntregaDespesa'
import CadastroVeiculo from './pages/CadastroVeiculo'
import Relatorios from './pages/Relatorios'
import DeliveryNavbar from './components/DeliveryNavbar'
import DeliveryLayout from './components/DeliveryLayout'
import { Button, Container, Typography, Box } from '@mui/material'

function Home() {
  const { user, logout } = useAuth();
  
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Bem-vindo ao Sistema de Gestão de Entregadores!
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Olá, {user?.name || user?.email}! Você está logado com sucesso.
        </Typography>
        <Typography variant="body1" paragraph>
          Esta é a área do usuário comum. Se você é um administrador, 
          faça logout e entre com uma conta de administrador para acessar o painel administrativo.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={logout}
          sx={{ mt: 2 }}
        >
          Fazer Logout
        </Button>
      </Box>
    </Container>
  )
}

function App() {
  return (
    <AuthProvider>
      <RegistrosProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Register />} />
            
            {/* Rotas do Admin */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            {/* Rotas do Entregador */}
            <Route path="/" element={
              <ProtectedRoute>
                <DeliveryLayout>
                  <DeliveryDashboard />
                </DeliveryLayout>
              </ProtectedRoute>
            } />
            <Route path="/relatorios" element={
              <ProtectedRoute>
                <DeliveryLayout>
                  <Relatorios />
                </DeliveryLayout>
              </ProtectedRoute>
            } />
            <Route path="/registro-entrega" element={
              <ProtectedRoute>
                <DeliveryLayout>
                  <RegistroEntregaDespesa />
                </DeliveryLayout>
              </ProtectedRoute>
            } />
            <Route path="/cadastro-veiculo" element={
              <ProtectedRoute>
                <DeliveryLayout>
                  <CadastroVeiculo />
                </DeliveryLayout>
              </ProtectedRoute>
            } />
            <Route path="/comunidade" element={
              <ProtectedRoute>
                <DeliveryLayout>
                  <DeliveryComunidade />
                </DeliveryLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </RegistrosProvider>
    </AuthProvider>
  )
}

export default App
