import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { suppressKnownErrors, cleanupListeners } from './utils/errorHandler.js'

// Suprimir erros conhecidos do React DevTools e HMR
suppressKnownErrors();
cleanupListeners();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
