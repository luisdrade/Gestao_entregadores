import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, TextField, Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { api, ENDPOINTS } from '../services/apiClient';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Busca o perfil para identificar se é admin ou usuário
      try {
        const { data } = await api.get(ENDPOINTS.AUTH.ME);
        const userData = data.user || data;
        const isAdmin = Boolean(userData?.is_staff || userData?.is_superuser || userData?.user_type === 'admin');
        const roleText = isAdmin ? 'admin' : 'usuário';
        window.alert(`Login bem-sucedido! Entrando como ${roleText}...`);
        
        // Redireciona baseado no tipo de usuário
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } catch {
        // Se não conseguir verificar o perfil, vai para a página inicial
        navigate('/login');
      }
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>Entrar</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <TextField fullWidth label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required />
          <TextField fullWidth label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
          {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>Entrar</Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Não tem conta? <Link to="/registrar">Cadastre-se</Link>
        </Typography>
        </Paper>
      </Container>
    </>
  );
}


