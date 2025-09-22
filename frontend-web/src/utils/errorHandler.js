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
      message.includes('hmr')
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
      message.includes('hmr')
    ) {
      return; // Não exibe esses warnings
    }
    
    originalWarn.apply(console, args);
  };
};

// Função para limpar listeners órfãos
export const cleanupListeners = () => {
  // Remove event listeners órfãos que podem causar o erro
  if (typeof window !== 'undefined') {
    window.removeEventListener('message', () => {});
    window.removeEventListener('beforeunload', () => {});
  }
};
