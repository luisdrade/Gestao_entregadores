import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, ENDPOINTS } from '../services/apiClient';
import '../styles/pages/Login.css';


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
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-input"
              placeholder="E-mail"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="form-input"
              placeholder="Senha"
              required
            />
          </div>
          <div className="forgot-password">
            <Link to="#">Esqueci a senha</Link>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'ENTRAR'}
          </button>
          <div className="divider"></div>
          <button 
            type="button" 
            className="register-button"
            onClick={() => navigate('/registrar')}
          >
            CADASTRAR-SE
          </button>
        </form>
      </div>
    </div>
  );
}


