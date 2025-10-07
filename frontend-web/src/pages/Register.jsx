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
            <div className="input-container">
              <input 
                type="text" 
                name="nome" 
                value={form.nome} 
                onChange={handleChange} 
                className="form-input"
                required 
              />
              <label className={`form-label ${form.nome ? 'floating' : ''}`}>Nome</label>
            </div>
          </div>
          <div className="form-group">
            <div className="input-container">
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                className="form-input"
                required 
              />
              <label className={`form-label ${form.email ? 'floating' : ''}`}>E-mail</label>
            </div>
          </div>
          <div className="form-group">
            <div className="input-container">
              <input 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                className="form-input"
                required 
              />
              <label className={`form-label ${form.password ? 'floating' : ''}`}>Senha</label>
            </div>
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