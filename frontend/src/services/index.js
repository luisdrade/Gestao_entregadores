// Ponto único de import para serviços do app mobile

// Cliente HTTP e funções relacionadas
export {
  httpClient as api,
  httpClient,
  registroTrabalho,
  registroDespesa,
  atualizarRegistroTrabalho,
  excluirRegistroTrabalho,
  atualizarDespesa,
  excluirDespesa,
  listarCategoriasDespesas,
  criarCategoriaDespesa,
  atualizarCategoriaDespesa,
  excluirCategoriaDespesa,
} from './clientConfig';

// Configs e endpoints
export { API_CONFIG, API_ENDPOINTS } from '../config/api';
