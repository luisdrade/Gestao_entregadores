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
    <div className="register-container">
      <Container maxWidth="sm">
        <Paper elevation={2} className="register-paper">
          <Typography variant="h5" className="register-title">Cadastro de Entregador</Typography>
          <Box component="form" onSubmit={onSubmit} className="register-form">
            <TextField 
              fullWidth 
              label="Nome" 
              name="nome" 
              value={form.nome} 
              onChange={handleChange} 
              className="register-field"
              required 
            />
            <TextField 
              fullWidth 
              label="E-mail" 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={handleChange} 
              className="register-field"
              required 
            />
            <TextField 
              fullWidth 
              label="Senha" 
              name="password" 
              type="password" 
              value={form.password} 
              onChange={handleChange} 
              className="register-field"
              required 
            />
            {error && <div className="register-error">{error}</div>}
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              className="register-button"
              disabled={loading}
            >
              {loading ? (
                <div className="register-loading">
                  <span>Cadastrando...</span>
                </div>
              ) : (
                'Cadastrar'
              )}
            </Button>
          </Box>
          <div className="register-link">
            <Typography variant="body2">
              Já tem conta? <Link to="/login">Entrar</Link>
            </Typography>
          </div>
        </Paper>
      </Container>
    </div>
  );
}