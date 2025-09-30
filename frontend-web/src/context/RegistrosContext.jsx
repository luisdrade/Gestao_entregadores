import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, ENDPOINTS } from '../services/apiClient';
import { handleApiError } from '../utils/errorHandler';

const RegistrosContext = createContext(null);

export function RegistrosProvider({ children }) {
  const [registros, setRegistros] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [despesas, setDespesas] = useState([]);
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
      // Não definir erro global para veículos, apenas log
      console.warn('Aviso: Não foi possível carregar veículos. Continuando sem eles.');
      console.warn('Detalhes do erro:', handleApiError(err));
      setVeiculos([]); // Garantir que o array está vazio
    }
  };

  const fetchDespesas = async () => {
    try {
      console.log('🔍 RegistrosContext - Carregando despesas...');
      const response = await api.get(ENDPOINTS.DESPESAS.LIST);
      console.log('🔍 RegistrosContext - Despesas carregadas:', response.data);
      setDespesas(response.data.results || response.data || []);
    } catch (err) {
      console.error('❌ RegistrosContext - Erro ao carregar despesas:', err);
      setError('Erro ao carregar despesas: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Carregar apenas registros e despesas automaticamente
        // Veículos serão carregados sob demanda
        const promises = [
          fetchRegistros().catch(err => console.warn('Erro ao carregar registros:', err)),
          fetchDespesas().catch(err => console.warn('Erro ao carregar despesas:', err))
        ];
        
        await Promise.allSettled(promises);
      } catch (err) {
        console.error('Erro geral ao carregar dados:', err);
        setError('Erro ao carregar dados iniciais');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const value = {
    registros,
    setRegistros,
    veiculos,
    setVeiculos,
    despesas,
    setDespesas,
    loading,
    error,
    fetchRegistros,
    fetchVeiculos,
    fetchDespesas
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
