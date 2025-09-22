import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, ENDPOINTS, setTokens, clearTokens, getAccessToken } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        console.log('🔍 AuthContext - Nenhum token encontrado');
        setUser(null);
        return;
      }
      
      console.log('🔍 AuthContext - Fazendo chamada para /api/auth/profile/');
      const { data } = await api.get(ENDPOINTS.AUTH.ME);
      console.log('🔍 AuthContext - Resposta recebida:', data);
      
      // Backend retorna { success: true, user: {...} }
      if (data.success && data.user) {
        console.log('🔍 AuthContext - Usuário definido:', data.user);
        setUser(data.user);
      } else {
        console.log('🔍 AuthContext - Resposta sem usuário válido');
        setUser(null);
      }
    } catch (e) {
      console.log('❌ AuthContext - Erro ao buscar usuário:', e.response?.status, e.response?.data);
      setUser(null);
      // Se for 401, limpar tokens
      if (e.response?.status === 401) {
        console.log('🔍 AuthContext - 401 detectado, limpando tokens');
        clearTokens();
      }
    }
  };

  useEffect(() => {
    // Verificar se há token válido na inicialização
    console.log('🔍 AuthContext - useEffect executado');
    fetchMe();
    setLoading(false);
    console.log('🔍 AuthContext - Loading definido como false');
  }, []); // Executar apenas uma vez na montagem

  const login = async (email, password) => {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    console.log('Resposta do login:', data);
    // Aceita formatos: {access, refresh, user} ou {tokens: {access, refresh}, user}
    const access = data?.access || data?.tokens?.access;
    const refresh = data?.refresh || data?.tokens?.refresh;
    if (access || refresh) {
      setTokens({ access, refresh });
      console.log('Tokens salvos:', { access: access?.substring(0, 20) + '...', refresh: refresh?.substring(0, 20) + '...' });
      await fetchMe();
    }
  };


  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const register = async (payload) => {
    await api.post(ENDPOINTS.AUTH.REGISTER, payload);
  };

  const value = { user, loading, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


