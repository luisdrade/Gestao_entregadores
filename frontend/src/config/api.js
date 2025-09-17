// Configurações da API
export const API_CONFIG = {
  //BASE_URL: 'http://entregasplus.ddns.net:8000',
  BASE_URL: 'http://192.168.0.115:8000',
  //BASE_URL: 'http://192.168.56.1:8000',
  
  TIMEOUT: 15000,
};

// Endpoints da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    GOOGLE_LOGIN: '/api/auth/google-login/',
    GOOGLE_REGISTER: '/api/auth/google-register/',  
    FORGOT_PASSWORD: '/api/auth/password/reset/',
    REFRESH_TOKEN: '/api/auth/token/refresh/',
  },
  USER: {
    PROFILE: '/api/entregadores/me/',
    STATISTICS: '/api/estatisticas/',
    UPDATE_PROFILE: '/api/entregadores/me/',
    CHANGE_PASSWORD: '/api/usuarios/change-password/',
    UPLOAD_PHOTO: '/api/usuarios/upload-foto/',
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
    DASHBOARD: '/registro/api/dashboard-data/',
    DELIVERIES: '/relatorios/entregas/',
    EXPENSES: '/relatorios/despesas/',
    TRABALHO: '/api/relatorios/trabalho/',
    DESPESAS: '/api/relatorios/despesas/',
  },
  COMMUNITY: {
    BASE: '/comunidade/',
    POSTS: '/comunidade/',
    CREATE_POST: '/comunidade/',
    VEHICLE_ADS: '/comunidade/',
    CREATE_VEHICLE_AD: '/comunidade/',
  },
};
