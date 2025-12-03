import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { api } from '../../services/apiClient';
import '../../styles/pages/DeliveryDashboard.css';

const DeliveryDashboard = () => {
  const location = useLocation();
  const [periodo, setPeriodo] = useState('mes');
  const [dados, setDados] = useState({
    resumo_diario: {
      entregas_hoje: 0,
      nao_entregas_hoje: 0,
      ganhos_hoje: 0,
      despesas_hoje: 0,
      lucro_hoje: 0
    },
    indicadores_performance: {
      dias_trabalhados: 0,
      entregas_realizadas: 0,
      entregas_nao_realizadas: 0,
      ganho_total: 0,
      despesas_total: 0,
      lucro_liquido: 0,
      taxa_sucesso: 0,
      ganho_medio_dia: 0,
      veiculos_cadastrados: 0
    },
    entregas_por_dia: [],
    ganhos_por_semana: [],
    performance_mensal: [],
    distribuicao_veiculos: [],
    ultimos_registros: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Dashboard - Buscando dados para período:', periodo);
      
      const params = new URLSearchParams();
      params.append('periodo', periodo);
      // Adicionar timestamp para evitar cache
      params.append('_t', new Date().getTime().toString());
      
      console.log('🔍 Dashboard - Fazendo chamada para /registro/api/dashboard-data/');
      const response = await api.get(`/registro/api/dashboard-data/?${params.toString()}`);
      console.log('🔍 Dashboard - Resposta completa:', response.data);
      
      if (response.data.success && response.data.data) {
        const backendData = response.data.data;
        
        setDados({
          resumo_diario: backendData.resumo_diario || {
            entregas_hoje: 0,
            nao_entregas_hoje: 0,
            ganhos_hoje: 0,
            despesas_hoje: 0,
            lucro_hoje: 0
          },
          indicadores_performance: backendData.indicadores_performance || {
            dias_trabalhados: 0,
            entregas_realizadas: 0,
            entregas_nao_realizadas: 0,
            ganho_total: 0,
            despesas_total: 0,
            lucro_liquido: 0,
            taxa_sucesso: 0,
            ganho_medio_dia: 0,
            veiculos_cadastrados: 0
          },
          entregas_por_dia: backendData.entregas_por_dia || [],
          ganhos_por_semana: backendData.ganhos_por_semana || [],
          performance_mensal: backendData.performance_mensal || [],
          distribuicao_veiculos: backendData.distribuicao_veiculos || [],
          ultimos_registros: backendData.ultimos_registros || []
        });
        
        console.log('✅ Dashboard - Dados carregados com sucesso:', backendData.resumo_diario);
      } else {
        throw new Error(response.data.error || 'Resposta inválida do servidor');
      }
    } catch (err) {
      console.error('❌ Dashboard - Erro ao carregar dados:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Erro desconhecido';
      setError(`Erro ao carregar dados do dashboard: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Recarregar dados quando o usuário navega de volta para o dashboard
  useEffect(() => {
    // Só recarregar se estiver na rota do dashboard
    if (location.pathname === '/dashboard') {
      console.log('🔄 Dashboard - Navegação detectada, recarregando dados...');
      fetchDashboardData();
    }
  }, [location.pathname, location.key, fetchDashboardData]);

  // Atualização automática quando a página está visível
  useEffect(() => {
    if (location.pathname !== '/dashboard') return;

    // Atualizar quando a página volta a ficar visível
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Dashboard - Página ficou visível, recarregando dados...');
        fetchDashboardData();
      }
    };

    // Atualização automática a cada 30 segundos quando a página está visível
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        console.log('🔄 Dashboard - Atualização automática (30s)...');
        fetchDashboardData();
      }
    }, 30000); // 30 segundos

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, fetchDashboardData]);

  const handlePeriodoChange = (newPeriodo) => {
    setPeriodo(newPeriodo);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const progressValue = Math.min(
    (dados.indicadores_performance.dias_trabalhados / (periodo === 'semana' ? 7 : 30)) * 100, 
    100
  );

  const getSuccessRating = (taxa) => {
    if (taxa >= 90) return 'Excelente';
    if (taxa >= 70) return 'Bom';
    return 'Pode melhorar';
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">📊 Dashboard</h1>
          <p className="dashboard-subtitle">
            Performance e resultados {periodo === 'semana' ? 'da semana' : 'do mês'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2B2860',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: loading ? 0.6 : 1
            }}
            title="Atualizar dados"
          >
            {loading ? '⏳' : '🔄'} {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
          <div className="period-toggle">
            <button
              className={periodo === 'semana' ? 'active' : ''}
              onClick={() => handlePeriodoChange('semana')}
            >
              Semana
            </button>
            <button
              className={periodo === 'mes' ? 'active' : ''}
              onClick={() => handlePeriodoChange('mes')}
            >
              Mês
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Cards de Resumo Principal */}
      <div className="cards-grid">
        <div className="stat-card gradient-1">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <div className="stat-card-label">Total de Veículos</div>
              <div className="stat-card-value">
                {dados.indicadores_performance.veiculos_cadastrados || 0}
              </div>
            </div>
            <div className="stat-card-icon">🚗</div>
          </div>
        </div>

        <div className="stat-card gradient-2">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <div className="stat-card-label">Ganho de Hoje</div>
              <div className="stat-card-value">
                R$ {formatCurrency(dados.resumo_diario.ganhos_hoje)}
              </div>
            </div>
            <div className="stat-card-icon">📈</div>
          </div>
        </div>

        <div className="stat-card gradient-3">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <div className="stat-card-label">Despesas de Hoje</div>
              <div className="stat-card-value">
                R$ {formatCurrency(dados.resumo_diario.despesas_hoje)}
              </div>
            </div>
            <div className="stat-card-icon">📉</div>
          </div>
        </div>

        <div className="stat-card gradient-4">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <div className="stat-card-label">Lucro de Hoje</div>
              <div className="stat-card-value">
                R$ {formatCurrency(dados.resumo_diario.lucro_hoje)}
              </div>
            </div>
            <div className="stat-card-icon">💰</div>
          </div>
        </div>
      </div>

      {/* Métricas de Performance */}
      <div className="performance-grid">
        <div className="performance-card">
          <div className="performance-card-header">
            <span className="performance-card-icon">⏰</span>
            <h3 className="performance-card-title">Dias Trabalhados</h3>
          </div>
          <div className="performance-card-value">
            {dados.indicadores_performance.dias_trabalhados || 0}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
        </div>

        <div className="performance-card">
          <div className="performance-card-header">
            <span className="performance-card-icon" style={{ color: '#4caf50' }}>📦</span>
            <h3 className="performance-card-title">Entregas Realizadas</h3>
          </div>
          <div className="performance-card-value success">
            {dados.indicadores_performance.entregas_realizadas || 0}
          </div>
          <div className="chip">
            {dados.indicadores_performance.taxa_sucesso || 0}% sucesso
          </div>
        </div>

        <div className="performance-card">
          <div className="performance-card-header">
            <span className="performance-card-icon" style={{ color: '#ff9800' }}>⭐</span>
            <h3 className="performance-card-title">Taxa de Sucesso</h3>
          </div>
          <div className="performance-card-value warning">
            {dados.indicadores_performance.taxa_sucesso || 0}%
          </div>
          <div className="performance-card-footer">
            <span>⭐</span>
            <span>{getSuccessRating(dados.indicadores_performance.taxa_sucesso)}</span>
          </div>
        </div>

        <div className="performance-card">
          <div className="performance-card-header">
            <span className="performance-card-icon" style={{ color: '#2196f3' }}>⚡</span>
            <h3 className="performance-card-title">Ganho Médio/Dia</h3>
          </div>
          <div className="performance-card-value info">
            R$ {formatCurrency(dados.indicadores_performance.ganho_medio_dia)}
          </div>
          <div className="performance-card-footer">
            <span>Média do período</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        {/* Gráfico de Pizza - Distribuição de Veículos */}
        <div className="chart-card">
          <h3 className="chart-title">🚗 Distribuição de Veículos</h3>
          {dados.distribuicao_veiculos && dados.distribuicao_veiculos.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dados.distribuicao_veiculos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => !isMobile ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                    outerRadius={isMobile ? 60 : 80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dados.distribuicao_veiculos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-empty">
              {dados.indicadores_performance.veiculos_cadastrados === 0 
                ? 'Nenhum veículo cadastrado ainda' 
                : 'Dados de veículos não disponíveis'}
            </div>
          )}
        </div>

        {/* Gráfico de Linha - Performance Mensal */}
        <div className="chart-card">
          <h3 className="chart-title">📈 Performance Mensal</h3>
          {dados.performance_mensal && dados.performance_mensal.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dados.performance_mensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="entregas" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ganho" 
                    stackId="2" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-empty">
              Dados de performance não disponíveis
            </div>
          )}
        </div>

        {/* Gráfico de Barras - Ganhos vs Despesas */}
        <div className="chart-card">
          <h3 className="chart-title">💰 Ganhos vs Despesas</h3>
          {dados.ganhos_por_semana && dados.ganhos_por_semana.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dados.ganhos_por_semana}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                  <Bar dataKey="ganho" fill="#82ca9d" name="Ganhos" />
                  <Bar dataKey="despesa" fill="#ffc658" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-empty">
              Dados financeiros não disponíveis
            </div>
          )}
        </div>
      </div>

      {/* Tabela de Últimos Registros */}
      <div className="table-card">
        <h3 className="table-title">
          📋 Últimos Registros ({periodo === 'semana' ? 'Semana' : 'Mês'})
        </h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Entregas</th>
                <th>Ganho</th>
                <th>Despesa</th>
                <th>Lucro</th>
              </tr>
            </thead>
            <tbody>
              {dados.ultimos_registros && dados.ultimos_registros.length > 0 ? (
                dados.ultimos_registros.map((registro, index) => (
                  <tr key={index}>
                    <td>{registro.data || registro.dia || '-'}</td>
                    <td>{registro.entregas || registro.quantidade_entregues || 0}</td>
                    <td className="text-success">
                      R$ {formatCurrency(registro.ganho || registro.ganho_total)}
                    </td>
                    <td className="text-error">
                      R$ {formatCurrency(registro.despesa || registro.despesa_total)}
                    </td>
                    <td className={(registro.lucro || registro.lucro_liquido || 0) > 0 ? 'text-success' : 'text-error'}>
                      R$ {formatCurrency(registro.lucro || registro.lucro_liquido)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="table-empty">
                    Nenhum registro encontrado para este período
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="action-buttons">
        <Link to="/relatorios" className="btn btn-primary">
          <span>📊</span>
          Relatórios Detalhados
        </Link>
        <Link to="/cadastro-veiculo" className="btn btn-outline">
          <span>🚗</span>
          Gerenciar Veículos
        </Link>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
