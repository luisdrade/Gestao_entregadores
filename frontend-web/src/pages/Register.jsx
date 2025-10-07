import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Register.css';

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
      <div className="register-card">
        <h1 className="register-title">Cadastro</h1>
        <form onSubmit={onSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input 
              type="text" 
              name="nome" 
              value={form.nome} 
              onChange={handleChange} 
              className="form-input"
              placeholder="Nome completo"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              className="form-input"
              placeholder="E-mail"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              className="form-input"
              placeholder="Senha"
              required 
            />
          </div>
          {error && <div className="register-error">{error}</div>}
          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'CADASTRAR'}
          </button>
          <div className="divider"></div>
          <Link 
            to="/login" 
            className="login-link-button"
          >
            JÁ TENHO CONTA
          </Link>
        </form>
      </div>
    </div>
  );
}