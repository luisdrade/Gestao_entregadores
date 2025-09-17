import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, TextField, Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError('Falha no cadastro. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>Cadastro de Entregador</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <TextField fullWidth label="Nome" name="nome" value={form.nome} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Senha" name="password" type="password" value={form.password} onChange={handleChange} margin="normal" required />
          {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>Cadastrar</Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </Typography>
      </Paper>
    </Container>
  );
}


