import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, ENDPOINTS, setTokens, clearTokens, getAccessToken } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        setUser(null);
        return;
      }
      const { data } = await api.get(ENDPOINTS.AUTH.ME);
      // Backend retorna { success: true, user: {...} }
      setUser(data.user || data);
    } catch (e) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Sempre forçar logout na inicialização para ir para login
    clearTokens();
    setUser(null);
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
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
  }, [fetchMe]);

  const register = useCallback(async (payload) => {
    await api.post(ENDPOINTS.AUTH.REGISTER, payload);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, register }), [user, loading, login, logout, register]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


