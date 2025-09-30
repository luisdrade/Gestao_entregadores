// Constantes de configuração do frontend
export const API_CONFIG = {
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const VEHICLE_CATEGORIES = [
  'Moto',
  'Carro', 
  'Bicicleta',
  'Caminhão',
  'Van'
];

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  AUTH_ERROR: 'Não autorizado. Faça login novamente.',
  SERVER_ERROR: 'Erro interno do servidor.',
  VALIDATION_ERROR: 'Dados inválidos.',
  UNKNOWN_ERROR: 'Erro desconhecido.',
};

export const SUCCESS_MESSAGES = {
  VEHICLE_CREATED: 'Veículo cadastrado com sucesso!',
  VEHICLE_UPDATED: 'Veículo atualizado com sucesso!',
  VEHICLE_DELETED: 'Veículo excluído com sucesso!',
};

