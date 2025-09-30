import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
