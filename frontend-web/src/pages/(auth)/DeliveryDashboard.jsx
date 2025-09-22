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
  LinearProgress
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
  const [dados, setDados] = useState({
    total_veiculos: 0,
    total_ganho: 0,
    total_despesa: 0,
    lucro: 0,
    ultimos_registros: [],
    // Dados para gráficos
    entregas_por_dia: [],
    ganhos_por_semana: [],
    performance_mensal: [],
    distribuicao_veiculos: [],
    resumo_periodo: {
      dias_trabalhados: 0,
      entregas_realizadas: 0,
      taxa_sucesso: 0,
      ganho_medio_dia: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Dashboard - Fazendo chamada para /registro/api/dashboard-data/');
      const response = await api.get('/registro/api/dashboard-data/');
      console.log('🔍 Dashboard - Resposta completa:', response.data);
      console.log('🔍 Dashboard - Dados extraídos:', response.data.data || response.data);
      
      // Transformar dados do backend para o formato esperado pelo frontend
      const backendData = response.data.data || response.data;
      
      // Usar dados reais do backend
      const transformedData = {
        total_veiculos: backendData.indicadores_performance?.veiculos_cadastrados || 0,
        total_ganho: backendData.indicadores_performance?.ganho_total || 0,
        total_despesa: backendData.indicadores_performance?.despesas_total || 0,
        lucro: backendData.indicadores_performance?.lucro_liquido || 0,
        ultimos_registros: backendData.ultimos_registros || [],
        
        // Dados para gráficos baseados nos dados reais
        entregas_por_dia: backendData.entregas_por_dia || [],
        ganhos_por_semana: backendData.ganhos_por_semana || [],
        performance_mensal: backendData.performance_mensal || [],
        distribuicao_veiculos: backendData.distribuicao_veiculos || [],
        
        resumo_periodo: {
          dias_trabalhados: backendData.indicadores_performance?.dias_trabalhados || 0,
          entregas_realizadas: backendData.indicadores_performance?.entregas_realizadas || 0,
          taxa_sucesso: backendData.indicadores_performance?.taxa_sucesso || 0,
          ganho_medio_dia: backendData.indicadores_performance?.ganho_medio_dia || 0
        }
      };
      
      console.log('🔍 Frontend - Dados transformados:', transformedData);
      console.log('🔍 Frontend - Distribuição de veículos:', transformedData.distribuicao_veiculos);
      console.log('🔍 Frontend - Total de veículos:', transformedData.total_veiculos);
      
      setDados(transformedData);
    } catch (err) {
      console.error('❌ Dashboard - Erro ao carregar dados:', err.response?.data || err.message);
      setError('Erro ao carregar dados do dashboard: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
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
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📊 Dashboard do Entregador
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visão geral da sua performance e resultados
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Cards de Resumo Principal */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total de Veículos
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {dados.total_veiculos}
                  </Typography>
                </Box>
                <CarIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Ganho Total
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    R$ {dados.total_ganho.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Despesas
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    R$ {dados.total_despesa.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingDownIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Lucro Líquido
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    R$ {dados.lucro.toLocaleString()}
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Métricas de Performance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Dias Trabalhados</Typography>
              </Box>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {dados.resumo_periodo.dias_trabalhados}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                sx={{ mt: 1, borderRadius: 2, height: 6 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DeliveryIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Entregas Realizadas</Typography>
              </Box>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {dados.resumo_periodo.entregas_realizadas}
              </Typography>
              <Chip 
                label={`${dados.resumo_periodo.taxa_sucesso}% sucesso`} 
                color="success" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StarIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Taxa de Sucesso</Typography>
              </Box>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {dados.resumo_periodo.taxa_sucesso}%
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <StarIcon sx={{ color: '#ffc107', fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Excelente performance
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SpeedIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Ganho Médio/Dia</Typography>
              </Box>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                R$ {dados.resumo_periodo.ganho_medio_dia.toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Média dos últimos 30 dias
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Pizza - Distribuição de Veículos */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚗 Distribuição de Veículos
              </Typography>
              {dados.distribuicao_veiculos && dados.distribuicao_veiculos.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dados.distribuicao_veiculos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
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
                <Box display="flex" alignItems="center" justifyContent="center" height={300}>
                  <Typography variant="body1" color="text.secondary">
                    {dados.total_veiculos === 0 ? 'Nenhum veículo cadastrado ainda' : 'Dados de veículos não disponíveis'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Barras - Entregas por Dia */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📦 Entregas por Dia da Semana
              </Typography>
              {dados.entregas_por_dia && dados.entregas_por_dia.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dados.entregas_por_dia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="entregas" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height={300}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhuma entrega registrada ainda
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Linha - Performance Mensal */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Performance Mensal
              </Typography>
              {dados.performance_mensal && dados.performance_mensal.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dados.performance_mensal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
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
                <Box display="flex" alignItems="center" justifyContent="center" height={300}>
                  <Typography variant="body1" color="text.secondary">
                    Dados de performance não disponíveis
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Barras - Ganhos vs Despesas */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💰 Ganhos vs Despesas
              </Typography>
              {dados.ganhos_por_semana && dados.ganhos_por_semana.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dados.ganhos_por_semana}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semana" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ganho" fill="#82ca9d" name="Ganhos" />
                    <Bar dataKey="despesa" fill="#ffc658" name="Despesas" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height={300}>
                  <Typography variant="body1" color="text.secondary">
                    Dados financeiros não disponíveis
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de Últimos Registros */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Últimos Registros
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ganho</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Despesa</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Lucro</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dados.ultimos_registros && dados.ultimos_registros.length > 0 ? (
                  dados.ultimos_registros.map((registro, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{registro.data}</TableCell>
                      <TableCell>
                        <Chip 
                          label={registro.tipo_rendimento} 
                          color={registro.tipo_rendimento === 'unitario' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'success.main', fontWeight: 'bold' }}>
                        R$ {registro.ganho}
                      </TableCell>
                      <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>
                        R$ {registro.despesa}
                      </TableCell>
                      <TableCell sx={{ color: registro.lucro > 0 ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                        R$ {registro.lucro}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={registro.lucro > 0 ? 'Positivo' : 'Negativo'} 
                          color={registro.lucro > 0 ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Nenhum registro encontrado
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
      <Box display="flex" justifyContent="center" gap={2} sx={{ mt: 4 }}>
        <Button
          component={Link}
          to="/relatorios"
          variant="contained"
          size="large"
          startIcon={<ReportIcon />}
          sx={{ 
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            borderRadius: 3,
            px: 4,
            py: 1.5,
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
          startIcon={<CarIcon />}
          sx={{ 
            borderRadius: 3,
            px: 4,
            py: 1.5,
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
