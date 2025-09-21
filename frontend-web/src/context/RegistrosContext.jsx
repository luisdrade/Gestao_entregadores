import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, ENDPOINTS } from '../services/apiClient';

const RegistrosContext = createContext(null);

export function RegistrosProvider({ children }) {
  const [registros, setRegistros] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRegistros = async () => {
    try {
      console.log('🔍 RegistrosContext - Carregando registros...');
      const response = await api.get(ENDPOINTS.REGISTROS.LIST);
      console.log('🔍 RegistrosContext - Registros carregados:', response.data);
      setRegistros(response.data.results || response.data || []);
    } catch (err) {
      console.error('❌ RegistrosContext - Erro ao carregar registros:', err);
      setError('Erro ao carregar registros: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchVeiculos = async () => {
    try {
      console.log('🔍 RegistrosContext - Carregando veículos...');
      const response = await api.get(ENDPOINTS.VEICULOS.LIST);
      console.log('🔍 RegistrosContext - Veículos carregados:', response.data);
      setVeiculos(response.data.results || response.data || []);
    } catch (err) {
      console.error('❌ RegistrosContext - Erro ao carregar veículos:', err);
      setError('Erro ao carregar veículos: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRegistros(), fetchVeiculos()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  const value = {
    registros,
    setRegistros,
    veiculos,
    setVeiculos,
    loading,
    error,
    fetchRegistros,
    fetchVeiculos
  };

  return (
    <RegistrosContext.Provider value={value}>
      {children}
    </RegistrosContext.Provider>
  );
}

export function useRegistros() {
  const context = useContext(RegistrosContext);
  if (!context) {
    throw new Error('useRegistros must be used within a RegistrosProvider');
  }
  return context;
}

export { RegistrosContext };
