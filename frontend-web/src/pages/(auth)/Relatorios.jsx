import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
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
  Tabs,
  Tab,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Assessment as ReportIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  DirectionsCar as CarIcon,
  Schedule as ScheduleIcon,
  LocalShipping as DeliveryIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  MonetizationOn as MonetizationOnIcon,
  Receipt as ReceiptIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon
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
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { RegistrosContext } from '../../context/RegistrosContext';
import { api, ENDPOINTS } from '../../services/apiClient';

const Relatorios = () => {
  const { veiculos, loading: contextLoading, error: contextError } = useContext(RegistrosContext);
  const [relatoriosData, setRelatoriosData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [diasTrabalhados, setDiasTrabalhados] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [periodo, setPeriodo] = useState('mes'); // 'semana', 'mes', 'ano'

  useEffect(() => {
    console.log('🔍 Relatorios - Veículos do contexto:', veiculos);
    fetchRelatoriosData();
  }, []);

  const fetchRelatoriosData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Relatorios - Fazendo chamada para /api/relatorios/estatisticas/');
      
      // Buscar dados de estatísticas
      const response = await api.get('/api/relatorios/estatisticas/');
      console.log('🔍 Relatorios - Resposta dos relatórios:', response.data);
      setRelatoriosData(response.data);
      
      // Buscar dados detalhados de dias trabalhados
      try {
        const diasResponse = await api.get('/registro/api/registro-trabalho/');
        console.log('🔍 Relatorios - Dias trabalhados:', diasResponse.data);
        setDiasTrabalhados(diasResponse.data.results || []);
      } catch (err) {
        console.warn('⚠️ Relatorios - Erro ao buscar dias trabalhados:', err);
      }
      
      // Buscar dados de despesas
      try {
        const despesasResponse = await api.get('/registro/api/registro-despesa/');
        console.log('🔍 Relatorios - Despesas:', despesasResponse.data);
        setDespesas(despesasResponse.data.results || []);
      } catch (err) {
        console.warn('⚠️ Relatorios - Erro ao buscar despesas:', err);
      }
      
    } catch (err) {
      console.error('❌ Relatorios - Erro ao carregar dados dos relatórios:', err);
      setError('Erro ao carregar dados dos relatórios: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = () => {
    if (!relatoriosData) {
      return {
        totalGanho: 0,
        totalDespesa: 0,
        lucroTotal: 0,
        totalPacotes: 0,
        pacotesEntregues: 0,
        taxaEntrega: 0,
        totalRegistros: 0,
        veiculosCadastrados: 0,
        diasTrabalhados: 0,
        diasConectado: 0
      };
    }

    return {
      totalGanho: relatoriosData.totalGanhos || 0,
      totalDespesa: 0, // Não temos despesas separadas na API atual
      lucroTotal: relatoriosData.totalGanhos || 0,
      totalPacotes: relatoriosData.totalEntregas || 0,
      pacotesEntregues: relatoriosData.totalEntregas || 0,
      taxaEntrega: 100, // Se temos entregas, assumimos 100% de taxa
      totalRegistros: relatoriosData.diasTrabalhados || 0,
      veiculosCadastrados: relatoriosData.veiculosCadastrados || 0,
      diasTrabalhados: relatoriosData.diasTrabalhados || 0,
      diasConectado: relatoriosData.diasConectado || 0
    };
  };

  const estatisticas = calcularEstatisticas();

  // Funções para análises detalhadas
  const calcularAnalisesDetalhadas = () => {
    const totalDespesas = despesas.reduce((sum, despesa) => sum + (despesa.valor || 0), 0);
    const totalGanhos = diasTrabalhados.reduce((sum, dia) => sum + (dia.valor || 0), 0);
    const lucroLiquido = totalGanhos - totalDespesas;
    
    const diasComTrabalho = diasTrabalhados.length;
    const ganhoMedioDia = diasComTrabalho > 0 ? totalGanhos / diasComTrabalho : 0;
    const despesaMediaDia = diasComTrabalho > 0 ? totalDespesas / diasComTrabalho : 0;
    
    const totalEntregas = diasTrabalhados.reduce((sum, dia) => sum + (dia.quantidade_entregues || 0), 0);
    const totalNaoEntregas = diasTrabalhados.reduce((sum, dia) => sum + (dia.quantidade_nao_entregues || 0), 0);
    const taxaSucesso = (totalEntregas + totalNaoEntregas) > 0 ? (totalEntregas / (totalEntregas + totalNaoEntregas)) * 100 : 0;
    
    return {
      totalDespesas,
      totalGanhos,
      lucroLiquido,
      diasComTrabalho,
      ganhoMedioDia,
      despesaMediaDia,
      totalEntregas,
      totalNaoEntregas,
      taxaSucesso
    };
  };

  const analises = calcularAnalisesDetalhadas();

  // Dados para gráficos
  const dadosGraficos = {
    performanceSemanal: [
      { dia: 'Seg', entregas: 12, ganho: 240, despesa: 30 },
      { dia: 'Ter', entregas: 8, ganho: 160, despesa: 25 },
      { dia: 'Qua', entregas: 15, ganho: 300, despesa: 40 },
      { dia: 'Qui', entregas: 10, ganho: 200, despesa: 35 },
      { dia: 'Sex', entregas: 18, ganho: 360, despesa: 45 },
      { dia: 'Sáb', entregas: 6, ganho: 120, despesa: 20 },
      { dia: 'Dom', entregas: 4, ganho: 80, despesa: 15 }
    ],
    distribuicaoDespesas: [
      { name: 'Combustível', value: 45, color: '#8884d8' },
      { name: 'Manutenção', value: 25, color: '#82ca9d' },
      { name: 'Alimentação', value: 20, color: '#ffc658' },
      { name: 'Outros', value: 10, color: '#ff7300' }
    ]
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExport = () => {
    // Função para exportar relatórios
    console.log('Exportando relatórios...');
  };

  const handlePrint = () => {
    // Função para imprimir relatórios
    window.print();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Header com ações */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center">
          <ReportIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              📊 Relatórios Detalhados
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Análise completa da sua performance e finanças
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Tooltip title="Exportar Relatório">
            <IconButton onClick={handleExport} color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Imprimir Relatório">
            <IconButton onClick={handlePrint} color="primary">
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filtros">
            <IconButton color="primary">
              <FilterIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

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
                    Ganho Total
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    R$ {analises.totalGanhos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 48, opacity: 0.8 }} />
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
                    Total de Despesas
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    R$ {analises.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <ReceiptIcon sx={{ fontSize: 48, opacity: 0.8 }} />
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
                    R$ {analises.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                    Taxa de Sucesso
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {analises.taxaSucesso.toFixed(1)}%
                  </Typography>
                </Box>
                <StarIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs para diferentes seções */}
      <Card sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="relatórios tabs">
            <Tab icon={<TimelineIcon />} label="Visão Geral" />
            <Tab icon={<CalendarIcon />} label="Dias Trabalhados" />
            <Tab icon={<ReceiptIcon />} label="Despesas" />
            <Tab icon={<BarChartIcon />} label="Gráficos" />
          </Tabs>
        </Box>

        {/* Tab 1: Visão Geral */}
        {activeTab === 0 && (
          <CardContent>
            <Grid container spacing={3}>
              {/* Métricas de Performance */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📈 Métricas de Performance
                    </Typography>
                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Dias Trabalhados</Typography>
                        <Typography variant="h6" color="primary">{analises.diasComTrabalho}</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={75} sx={{ borderRadius: 2, height: 6 }} />
                    </Box>
                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Entregas Realizadas</Typography>
                        <Typography variant="h6" color="success.main">{analises.totalEntregas}</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={analises.taxaSucesso} sx={{ borderRadius: 2, height: 6 }} />
                    </Box>
                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Ganho Médio/Dia</Typography>
                        <Typography variant="h6" color="info.main">
                          R$ {analises.ganhoMedioDia.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Despesa Média/Dia</Typography>
                        <Typography variant="h6" color="error.main">
                          R$ {analises.despesaMediaDia.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Resumo Financeiro */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      💰 Resumo Financeiro
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography>Ganho Total:</Typography>
                      <Typography variant="h6" color="success.main">
                        R$ {analises.totalGanhos.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography>Despesas Total:</Typography>
                      <Typography variant="h6" color="error.main">
                        R$ {analises.totalDespesas.toFixed(2)}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="h6">Lucro Líquido:</Typography>
                      <Typography variant="h5" color={analises.lucroLiquido >= 0 ? 'success.main' : 'error.main'}>
                        R$ {analises.lucroLiquido.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Margem de Lucro:</Typography>
                      <Typography variant="h6" color={analises.lucroLiquido >= 0 ? 'success.main' : 'error.main'}>
                        {analises.totalGanhos > 0 ? ((analises.lucroLiquido / analises.totalGanhos) * 100).toFixed(1) : '0.0'}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Tab 2: Dias Trabalhados */}
        {activeTab === 1 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📅 Histórico de Dias Trabalhados
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Horário</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Entregas</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Não Entregues</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tipo Pagamento</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Valor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {diasTrabalhados.length > 0 ? (
                    diasTrabalhados.map((dia, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{dia.data}</TableCell>
                        <TableCell>
                          {dia.hora_inicio} - {dia.hora_fim}
                        </TableCell>
                        <TableCell sx={{ color: 'success.main', fontWeight: 'bold' }}>
                          {dia.quantidade_entregues}
                        </TableCell>
                        <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>
                          {dia.quantidade_nao_entregues}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={dia.tipo_pagamento === 'por_entrega' ? 'Por Entrega' : 'Diária'}
                            color={dia.tipo_pagamento === 'por_entrega' ? 'primary' : 'secondary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'success.main', fontWeight: 'bold' }}>
                          R$ {dia.valor}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="Concluído" 
                            color="success" 
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Nenhum dia trabalhado registrado
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}

        {/* Tab 3: Despesas */}
        {activeTab === 2 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💸 Histórico de Despesas
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Valor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {despesas.length > 0 ? (
                    despesas.map((despesa, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{despesa.data}</TableCell>
                        <TableCell>
                          <Chip 
                            label={despesa.tipo_despesa}
                            color="warning"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{despesa.descricao}</TableCell>
                        <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>
                          R$ {despesa.valor}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={despesa.tipo_despesa}
                            color="info"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Nenhuma despesa registrada
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}

        {/* Tab 4: Gráficos */}
        {activeTab === 3 && (
          <CardContent>
            <Grid container spacing={3}>
              {/* Gráfico de Performance Semanal */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 400 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📊 Performance Semanal
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dadosGraficos.performanceSemanal}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dia" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="entregas" fill="#8884d8" name="Entregas" />
                        <Bar dataKey="ganho" fill="#82ca9d" name="Ganho (R$)" />
                        <Bar dataKey="despesa" fill="#ffc658" name="Despesa (R$)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Gráfico de Distribuição de Despesas */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 400 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      💰 Distribuição de Despesas
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dadosGraficos.distribuicaoDespesas}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dadosGraficos.distribuicaoDespesas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>
    </Container>
  );
};

export default Relatorios;