// Configurações da API
export const API_CONFIG = {
  // Para desenvolvimento local (web)
  BASE_URL: 'http://192.168.56.1:8000',
  
  // Para quando estiver rodando no emulador Android
  // BASE_URL: 'http://10.0.2.2:8000',
  
  // Para quando estiver rodando no dispositivo físico (substitua pelo IP da sua máquina)
  // BASE_URL: 'http://192.168.1.100:8000',
  
  TIMEOUT: 10000,
};

// Endpoints da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    FORGOT_PASSWORD: '/api/auth/password/reset/',
    REFRESH_TOKEN: '/api/auth/token/refresh/',
  },
  VEHICLES: {
    LIST: '/veiculos/',
    CREATE: '/veiculos/',
    DETAIL: (id) => `/veiculos/${id}/`,
    UPDATE: (id) => `/veiculos/${id}/`,
    DELETE: (id) => `/veiculos/${id}/`,
  },
  DELIVERIES: {
    LIST: '/entregas/',
    CREATE: '/entregas/',
    DETAIL: (id) => `/entregas/${id}/`,
    UPDATE: (id) => `/entregas/${id}/`,
    DELETE: (id) => `/entregas/${id}/`,
  },
  EXPENSES: {
    LIST: '/despesas/',
    CREATE: '/despesas/',
    DETAIL: (id) => `/entregas/${id}/`,
    UPDATE: (id) => `/entregas/${id}/`,
    DELETE: (id) => `/entregas/${id}/`,
  },
  REPORTS: {
    DASHBOARD: '/relatorios/dashboard/',
    DELIVERIES: '/relatorios/entregas/',
    EXPENSES: '/relatorios/despesas/',
  },
  COMMUNITY: {
    POSTS: '/comunidade/posts/',
    CREATE_POST: '/comunidade/posts/',
    COMMENTS: (postId) => `/comunidade/posts/${postId}/comments/`,
  },
};
