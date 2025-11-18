import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as ReportIcon,
  TrendingDown as TrendingDownIcon,
  LocalShipping as DeliveryIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
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
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { api, ENDPOINTS } from '../../services/apiClient';

const DeliveryDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [periodo, setPeriodo] = useState('mes'); // 'semana' ou 'mes'
  const [dados, setDados] = useState({
    // Resumo diário (hoje)
    resumo_diario: {
      entregas_hoje: 0,
      nao_entregas_hoje: 0,
      ganhos_hoje: 0,
      despesas_hoje: 0,
      lucro_hoje: 0
    },
    // Indicadores de performance (período)
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
    // Dados para gráficos
    entregas_por_dia: [],
    ganhos_por_semana: [],
    performance_mensal: [],
    distribuicao_veiculos: [],
    ultimos_registros: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [periodo]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Dashboard - Buscando dados para período:', periodo);
      
      // Buscar dados do período selecionado
      const params = new URLSearchParams();
      params.append('periodo', periodo);
      
      console.log('🔍 Dashboard - Fazendo chamada para /registro/api/dashboard-data/');
      const response = await api.get(`/registro/api/dashboard-data/?${params.toString()}`);
      console.log('🔍 Dashboard - Resposta completa:', response.data);
      
      if (response.data.success && response.data.data) {
        const backendData = response.data.data;
        
        // Mapear dados diretamente do backend
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
        
        console.log('✅ Dashboard - Dados carregados com sucesso');
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
  };

  const handlePeriodoChange = (event, newPeriodo) => {
    if (newPeriodo !== null) {
      setPeriodo(newPeriodo);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 1, sm: 3 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ 
        mb: { xs: 2, sm: 4 }, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            📊 Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Performance e resultados {periodo === 'semana' ? 'da semana' : 'do mês'}
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={periodo}
          exclusive
          onChange={handlePeriodoChange}
          aria-label="período"
          size="small"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <ToggleButton value="semana" aria-label="semana" sx={{ flex: { xs: 1, sm: 'none' } }}>
            Semana
          </ToggleButton>
          <ToggleButton value="mes" aria-label="mês" sx={{ flex: { xs: 1, sm: 'none' } }}>
            Mês
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Cards de Resumo Principal - Hoje */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 4 } }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection={{ xs: 'row', sm: 'row' }} gap={1}>
                <Box flex={1} minWidth={0}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '1rem' }, mb: { xs: 0.5, sm: 1 } }}>
                    Total de Veículos
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem' }, lineHeight: 1.2 }}>
                    {dados.indicadores_performance.veiculos_cadastrados || 0}
                  </Typography>
                </Box>
                <CarIcon sx={{ fontSize: { xs: 28, sm: 48 }, opacity: 0.8, flexShrink: 0 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection={{ xs: 'row', sm: 'row' }} gap={1}>
                <Box flex={1} minWidth={0}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '1rem' }, mb: { xs: 0.5, sm: 1 } }}>
                    Ganho de Hoje
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '2.5rem' }, lineHeight: 1.2, wordBreak: 'break-word' }}>
                    R$ {Number(dados.resumo_diario.ganhos_hoje || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: { xs: 28, sm: 48 }, opacity: 0.8, flexShrink: 0 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection={{ xs: 'row', sm: 'row' }} gap={1}>
                <Box flex={1} minWidth={0}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '1rem' }, mb: { xs: 0.5, sm: 1 } }}>
                    Despesas de Hoje
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '2.5rem' }, lineHeight: 1.2, wordBreak: 'break-word' }}>
                    R$ {Number(dados.resumo_diario.despesas_hoje || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <TrendingDownIcon sx={{ fontSize: { xs: 28, sm: 48 }, opacity: 0.8, flexShrink: 0 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection={{ xs: 'row', sm: 'row' }} gap={1}>
                <Box flex={1} minWidth={0}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '1rem' }, mb: { xs: 0.5, sm: 1 } }}>
                    Lucro de Hoje
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '2.5rem' }, lineHeight: 1.2, wordBreak: 'break-word' }}>
                    R$ {Number(dados.resumo_diario.lucro_hoje || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: { xs: 28, sm: 48 }, opacity: 0.8, flexShrink: 0 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Métricas de Performance */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 4 } }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 2 }}>
                <ScheduleIcon color="primary" sx={{ mr: 1, fontSize: { xs: 18, sm: 24 } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>Dias Trabalhados</Typography>
              </Box>
              <Typography variant="h4" color="primary" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '2rem' }, mb: { xs: 0.5, sm: 1 } }}>
                {dados.indicadores_performance.dias_trabalhados || 0}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((dados.indicadores_performance.dias_trabalhados / (periodo === 'semana' ? 7 : 30)) * 100, 100)} 
                sx={{ mt: 1, borderRadius: 2, height: 6 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 2 }}>
                <DeliveryIcon color="success" sx={{ mr: 1, fontSize: { xs: 18, sm: 24 } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>Entregas Realizadas</Typography>
              </Box>
              <Typography variant="h4" color="success.main" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '2rem' }, mb: { xs: 0.5, sm: 1 } }}>
                {dados.indicadores_performance.entregas_realizadas || 0}
              </Typography>
              <Chip 
                label={`${dados.indicadores_performance.taxa_sucesso || 0}% sucesso`} 
                color="success" 
                size="small" 
                sx={{ mt: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 2 }}>
                <StarIcon color="warning" sx={{ mr: 1, fontSize: { xs: 18, sm: 24 } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>Taxa de Sucesso</Typography>
              </Box>
              <Typography variant="h4" color="warning.main" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '2rem' }, mb: { xs: 0.5, sm: 1 } }}>
                {dados.indicadores_performance.taxa_sucesso || 0}%
              </Typography>
              <Box display="flex" alignItems="center" mt={{ xs: 0.5, sm: 1 }}>
                <StarIcon sx={{ color: '#ffc107', fontSize: { xs: 12, sm: 16 }, mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' } }}>
                  {dados.indicadores_performance.taxa_sucesso >= 90 ? 'Excelente' : dados.indicadores_performance.taxa_sucesso >= 70 ? 'Bom' : 'Pode melhorar'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 2 }}>
                <SpeedIcon color="info" sx={{ mr: 1, fontSize: { xs: 18, sm: 24 } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>Ganho Médio/Dia</Typography>
              </Box>
              <Typography variant="h4" color="info.main" fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '2rem' }, mb: { xs: 0.5, sm: 1 }, wordBreak: 'break-word' }}>
                R$ {Number(dados.indicadores_performance.ganho_medio_dia || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.65rem', sm: '0.875rem' } }}>
                Média do período
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 4 } }}>
        {/* Gráfico de Pizza - Distribuição de Veículos */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: { xs: 280, sm: 400 } }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1.25rem' }, mb: { xs: 1, sm: 2 } }}>
                🚗 Distribuição de Veículos
              </Typography>
              {dados.distribuicao_veiculos && dados.distribuicao_veiculos.length > 0 ? (
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
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
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height={{ xs: 200, sm: 300 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, textAlign: 'center', px: 2 }}>
                    {dados.indicadores_performance.veiculos_cadastrados === 0 ? 'Nenhum veículo cadastrado ainda' : 'Dados de veículos não disponíveis'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Barras - Entregas por Dia */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: { xs: 280, sm: 400 } }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1.25rem' }, mb: { xs: 1, sm: 2 } }}>
                📦 Entregas por Dia da Semana
              </Typography>
              {dados.entregas_por_dia && dados.entregas_por_dia.length > 0 ? (
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                  <BarChart data={dados.entregas_por_dia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <Tooltip />
                    <Bar dataKey="entregas" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height={{ xs: 200, sm: 300 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, textAlign: 'center', px: 2 }}>
                    Nenhuma entrega registrada ainda
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Linha - Performance Mensal */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: { xs: 280, sm: 400 } }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1.25rem' }, mb: { xs: 1, sm: 2 } }}>
                📈 Performance Mensal
              </Typography>
              {dados.performance_mensal && dados.performance_mensal.length > 0 ? (
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
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
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height={{ xs: 200, sm: 300 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, textAlign: 'center', px: 2 }}>
                    Dados de performance não disponíveis
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Barras - Ganhos vs Despesas */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: { xs: 280, sm: 400 } }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1.25rem' }, mb: { xs: 1, sm: 2 } }}>
                💰 Ganhos vs Despesas
              </Typography>
              {dados.ganhos_por_semana && dados.ganhos_por_semana.length > 0 ? (
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
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
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height={{ xs: 200, sm: 300 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, textAlign: 'center', px: 2 }}>
                    Dados financeiros não disponíveis
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de Últimos Registros */}
      <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: { xs: 2, sm: 4 } }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1.25rem' }, mb: { xs: 1.5, sm: 2 } }}>
            📋 Últimos Registros ({periodo === 'semana' ? 'Semana' : 'Mês'})
          </Typography>
          <TableContainer sx={{ overflowX: 'auto', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
            <Table sx={{ minWidth: { xs: 500, sm: 600 } }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Entregas</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Ganho</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Despesa</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Lucro</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dados.ultimos_registros && dados.ultimos_registros.length > 0 ? (
                  dados.ultimos_registros.map((registro, index) => (
                    <TableRow key={index} hover>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{registro.data || registro.dia || '-'}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {registro.entregas || registro.quantidade_entregues || 0}
                      </TableCell>
                      <TableCell sx={{ color: 'success.main', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
                        R$ {Number(registro.ganho || registro.ganho_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell sx={{ color: 'error.main', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
                        R$ {Number(registro.despesa || registro.despesa_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell sx={{ color: (registro.lucro || registro.lucro_liquido || 0) > 0 ? 'success.main' : 'error.main', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
                        R$ {Number(registro.lucro || registro.lucro_liquido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        Nenhum registro encontrado para este período
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="center" 
        gap={2} 
        sx={{ mt: { xs: 2, sm: 4 } }}
      >
        <Button
          component={Link}
          to="/relatorios"
          variant="contained"
          size="large"
          fullWidth={isMobile}
          startIcon={<ReportIcon />}
          sx={{ 
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            borderRadius: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 4 },
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #1976d2)',
              boxShadow: '0 6px 25px rgba(25, 118, 210, 0.4)',
            }
          }}
        >
          📊 Relatórios Detalhados
        </Button>
        <Button
          component={Link}
          to="/cadastro-veiculo"
          variant="outlined"
          size="large"
          fullWidth={isMobile}
          startIcon={<CarIcon />}
          sx={{ 
            borderRadius: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 4 },
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            borderColor: '#1976d2',
            color: '#1976d2',
            '&:hover': {
              borderColor: '#1565c0',
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            }
          }}
        >
          🚗 Gerenciar Veículos
        </Button>
      </Box>
    </Container>
  );
};

export default DeliveryDashboard;
