// Configurações da API
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  
  TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS || 15000),
};

// Endpoints da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    REGISTER_VERIFY: '/api/auth/register/verify/',
    REGISTER_RESEND: '/api/auth/register/resend/',
    FORGOT_PASSWORD: '/api/auth/password/reset/',
    REFRESH_TOKEN: '/api/auth/token/refresh/',
    // 2FA endpoints
    TWO_FA_SETUP: '/api/auth/2fa/setup/',
    TWO_FA_VERIFY: '/api/auth/2fa/verify/',
    TWO_FA_LOGIN: '/api/auth/login/2fa/',
    TWO_FA_DISABLE: '/api/auth/2fa/disable/',
    TWO_FA_STATUS: '/api/auth/2fa/status/',
    TWO_FA_RESEND: '/api/auth/2fa/resend/',
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
