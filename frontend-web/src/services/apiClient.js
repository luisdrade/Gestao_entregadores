import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.0.115:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token enviado:', token.substring(0, 20) + '...');
  } else {
    console.log('Nenhum token encontrado');
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    // Log de sucesso apenas para debug
    if (res.config.url?.includes('/auth/profile/')) {
      console.log('✅ API - Profile carregado com sucesso');
    }
    return res;
  },
  async (error) => {
    // Log detalhado de erros
    if (error.response?.status === 401) {
      console.log('❌ API - Erro 401 (Unauthorized):', error.config?.url);
      console.log('❌ API - Token enviado:', error.config?.headers?.Authorization?.substring(0, 20) + '...');
    } else {
      console.log('❌ API - Erro na resposta:', error.response?.status, error.config?.url);
    }
    return Promise.reject(error);
  }
);

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    ME: '/api/auth/profile/',
  },
  ADMIN: {
    USERS: '/api/admin/users/',
    USER_DETAIL: (id) => `/api/admin/users/${id}/`,
    USER_ACTIVATE: (id) => `/api/admin/users/${id}/activate/`,
    USER_DEACTIVATE: (id) => `/api/admin/users/${id}/deactivate/`,
  },
  REGISTROS: {
    LIST: '/registro/api/registro-trabalho/',
    CREATE: '/registro/api/registro-trabalho/',
    UPDATE: (id) => `/registro/api/registro-trabalho/${id}/`,
    DELETE: (id) => `/registro/api/registro-trabalho/${id}/`,
  },
  DESPESAS: {
    LIST: '/registro/api/registro-despesa/',
    CREATE: '/registro/api/registro-despesa/',
    UPDATE: (id) => `/registro/api/registro-despesa/${id}/`,
    DELETE: (id) => `/registro/api/registro-despesa/${id}/`,
  },
  VEICULOS: {
    LIST: '/api/veiculos/',
    CREATE: '/api/veiculos/',
    UPDATE: (id) => `/api/veiculos/${id}/`,
    DELETE: (id) => `/api/veiculos/${id}/`,
  },
  RELATORIOS: {
    ESTATISTICAS: '/api/relatorios/estatisticas/',
  },
};
