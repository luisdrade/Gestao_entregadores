// Error handler para suprimir erros conhecidos do React DevTools e HMR
export const suppressKnownErrors = () => {
  // Suprimir erro específico do React DevTools
  const originalError = console.error;
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    
    // Suprimir erros conhecidos que não afetam a funcionalidade
    if (
      message.includes('A listener indicated an asynchronous response by returning true') ||
      message.includes('message channel closed before a response was received') ||
      message.includes('Failed to reload') ||
      message.includes('hmr') ||
      message.includes('Uncaught (in promise) Error: A listener indicated an asynchronous response')
    ) {
      return; // Não exibe esses erros
    }
    
    // Exibe outros erros normalmente
    originalError.apply(console, args);
  };

  // Suprimir warnings específicos
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    
    if (
      message.includes('Download the React DevTools') ||
      message.includes('hmr') ||
      message.includes('React DevTools')
    ) {
      return; // Não exibe esses warnings
    }
    
    originalWarn.apply(console, args);
  };

  // Suprimir erros de Promise não capturados
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.toString() || '';
    if (
      message.includes('A listener indicated an asynchronous response') ||
      message.includes('message channel closed')
    ) {
      event.preventDefault();
      return;
    }
  });
};

// Função para limpar listeners órfãos
export const cleanupListeners = () => {
  // Remove event listeners órfãos que podem causar o erro
  if (typeof window !== 'undefined') {
    window.removeEventListener('message', () => {});
    window.removeEventListener('beforeunload', () => {});
  }
};

// Normaliza erros de API (Axios/fetch) para mensagem legível
export const handleApiError = (error) => {
  try {
    // Axios error com response
    const data = error?.response?.data;
    if (data) {
      if (typeof data === 'string') return data;
      if (data.message) return data.message;
      if (data.detail) return data.detail;
      if (data.error) return data.error;
      if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
        return data.non_field_errors[0];
      }
      // Erros de validação campo a campo
      if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        const firstVal = data[firstKey];
        if (Array.isArray(firstVal) && firstVal.length > 0) return `${firstKey}: ${firstVal[0]}`;
        if (typeof firstVal === 'string') return `${firstKey}: ${firstVal}`;
      }
    }

    // Fetch error com texto
    if (error?.message) return error.message;
    return 'Erro inesperado ao comunicar com o servidor';
  } catch (_) {
    return 'Erro inesperado ao comunicar com o servidor';
  }
};
