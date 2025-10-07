import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// Interceptar e suprimir o erro específico de listener assíncrono
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  
  // Suprimir o erro específico de listener assíncrono
  if (typeof message === 'string' && 
      message.includes('A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received')) {
    console.warn('Erro de listener assíncrono suprimido:', message);
    return;
  }
  
  // Para outros erros, usar o console.error original
  originalConsoleError.apply(console, args);
};

// Suprimir rejeições não tratadas específicas originadas por extensões do navegador
window.addEventListener('unhandledrejection', (event) => {
  try {
    const reason = event.reason;
    const message = typeof reason === 'string' ? reason : (reason?.message || '');
    if (message.includes('A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received')) {
      console.warn('Aviso de listener assíncrono suprimido (unhandledrejection)');
      event.preventDefault();
    }
  } catch (_) { /* noop */ }
});

// Suprimir também via evento 'error' de janela
window.addEventListener('error', (event) => {
  try {
    const message = event?.message || '';
    if (typeof message === 'string' && message.includes('A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received')) {
      console.warn('Aviso de listener assíncrono suprimido (error)');
      event.preventDefault();
    }
  } catch (_) { /* noop */ }
});

const theme = createTheme({
  palette: {
    primary: { main: '#2B2860' }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
