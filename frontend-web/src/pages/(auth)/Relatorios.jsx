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
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme
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
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

const Relatorios = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { veiculos, loading: contextLoading, error: contextError } = useContext(RegistrosContext);
  const [relatoriosData, setRelatoriosData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [diasTrabalhados, setDiasTrabalhados] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [periodo, setPeriodo] = useState('mes'); // 'semana', 'mes', 'ano'
  const [dadosGraficosReais, setDadosGraficosReais] = useState({
    performanceSemanal: [],
    distribuicaoDespesas: []
  });

  useEffect(() => {
    console.log('🔍 Relatorios - Veículos do contexto:', veiculos);
    console.log('🔍 Relatorios - Estado atual:', { periodo });
    fetchRelatoriosData();
  }, [periodo]);

  const fetchRelatoriosData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Relatorios - Fazendo chamada para /api/relatorios/estatisticas/');
      
      // Construir parâmetros de filtro
      const params = new URLSearchParams();
      if (periodo) params.append('periodo', periodo);
      
      console.log('🔍 Relatorios - Parâmetros:', { periodo });
      
      // Buscar dados de estatísticas
      const response = await api.get(`/api/relatorios/estatisticas/?${params.toString()}`);
      console.log('🔍 Relatorios - Resposta dos relatórios:', response.data);
      setRelatoriosData(response.data);
      
      let diasTrabalhadosData = [];
      let despesasData = [];
      
      // Buscar dados detalhados de dias trabalhados
      try {
        const diasResponse = await api.get(`/registro/api/registro-trabalho/?${params.toString()}`);
        console.log('🔍 Relatorios - Dias trabalhados:', diasResponse.data);
        diasTrabalhadosData = diasResponse.data.results || [];
        setDiasTrabalhados(diasTrabalhadosData);
      } catch (err) {
        console.warn('⚠️ Relatorios - Erro ao buscar dias trabalhados:', err);
        setDiasTrabalhados([]);
      }
      
      // Buscar dados de despesas
      try {
        const despesasResponse = await api.get(`/registro/api/registro-despesa/?${params.toString()}`);
        console.log('🔍 Relatorios - Despesas:', despesasResponse.data);
        despesasData = despesasResponse.data.results || [];
        setDespesas(despesasData);
      } catch (err) {
        console.warn('⚠️ Relatorios - Erro ao buscar despesas:', err);
        setDespesas([]);
      }
      
      // Processar dados para gráficos DEPOIS de carregar os dados
      processarDadosGraficos(diasTrabalhadosData, despesasData);
      
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

  // Função para processar dados dos gráficos
  const processarDadosGraficos = (diasTrabalhadosData = diasTrabalhados, despesasData = despesas) => {
    // Processar performance semanal
    const performanceSemanal = [];
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Mapear dias da semana (0 = Domingo, 1 = Segunda, etc.)
    diasSemana.forEach((diaNome, index) => {
      const diaDados = diasTrabalhadosData.filter(d => {
        try {
          const dataDia = new Date(d.data);
          const diaSemana = dataDia.getDay(); // 0 = Domingo, 1 = Segunda, etc.
          return diaSemana === index;
        } catch (e) {
          console.warn('Erro ao processar data:', d.data, e);
          return false;
        }
      });
      
      const entregas = diaDados.reduce((sum, d) => sum + (parseFloat(d.quantidade_entregues) || 0), 0);
      const ganho = diaDados.reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);
      
      const despesa = despesasData.filter(d => {
        try {
          const dataDespesa = new Date(d.data);
          const diaSemana = dataDespesa.getDay();
          return diaSemana === index;
        } catch (e) {
          console.warn('Erro ao processar data de despesa:', d.data, e);
          return false;
        }
      }).reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);
      
      performanceSemanal.push({
        dia: diaNome,
        entregas: Math.round(entregas),
        ganho: parseFloat(ganho.toFixed(2)),
        despesa: parseFloat(despesa.toFixed(2))
      });
    });

    // Processar distribuição de despesas
    const distribuicaoDespesas = [];
    const categorias = {};
    
    despesasData.forEach(despesa => {
      const categoria = despesa.tipo_despesa || 'Outros';
      const valor = parseFloat(despesa.valor) || 0;
      if (categorias[categoria]) {
        categorias[categoria] += valor;
      } else {
        categorias[categoria] = valor;
      }
    });

    const cores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff6b6b', '#4ecdc4', '#95e1d3', '#f38181', '#aa96da'];
    Object.entries(categorias).forEach(([categoria, valor], index) => {
      distribuicaoDespesas.push({
        name: categoria,
        value: parseFloat(valor.toFixed(2)),
        color: cores[index % cores.length]
      });
    });

    // Ordenar por valor (maior para menor)
    distribuicaoDespesas.sort((a, b) => b.value - a.value);

    setDadosGraficosReais({
      performanceSemanal,
      distribuicaoDespesas
    });
    
    console.log('📊 Dados processados para gráficos:', { performanceSemanal, distribuicaoDespesas });
  };

  // Dados para gráficos (usar dados reais ou fallback)
  const dadosGraficos = dadosGraficosReais.performanceSemanal.length > 0 && 
    dadosGraficosReais.performanceSemanal.some(d => d.entregas > 0 || d.ganho > 0 || d.despesa > 0)
    ? dadosGraficosReais 
    : {
        performanceSemanal: [
          { dia: 'Dom', entregas: 0, ganho: 0, despesa: 0 },
          { dia: 'Seg', entregas: 0, ganho: 0, despesa: 0 },
          { dia: 'Ter', entregas: 0, ganho: 0, despesa: 0 },
          { dia: 'Qua', entregas: 0, ganho: 0, despesa: 0 },
          { dia: 'Qui', entregas: 0, ganho: 0, despesa: 0 },
          { dia: 'Sex', entregas: 0, ganho: 0, despesa: 0 },
          { dia: 'Sáb', entregas: 0, ganho: 0, despesa: 0 }
        ],
        distribuicaoDespesas: despesas.length === 0 ? [
          { name: 'Nenhuma despesa', value: 1, color: '#cccccc' }
        ] : dadosGraficosReais.distribuicaoDespesas
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

  // Função para exportar para Excel
  const exportToExcel = () => {
    try {
      // Preparar dados para Excel
      const dadosExcel = {
        'Resumo Geral': [
          ['Métrica', 'Valor'],
          ['Ganho Total', `R$ ${analises.totalGanhos.toFixed(2)}`],
          ['Total de Despesas', `R$ ${analises.totalDespesas.toFixed(2)}`],
          ['Lucro Líquido', `R$ ${analises.lucroLiquido.toFixed(2)}`],
          ['Taxa de Sucesso', `${analises.taxaSucesso.toFixed(1)}%`],
          ['Dias Trabalhados', analises.diasComTrabalho],
          ['Total de Entregas', analises.totalEntregas],
          ['Ganho Médio/Dia', `R$ ${analises.ganhoMedioDia.toFixed(2)}`],
          ['Despesa Média/Dia', `R$ ${analises.despesaMediaDia.toFixed(2)}`]
        ],
        'Dias Trabalhados': [
          ['Data', 'Horário Início', 'Horário Fim', 'Entregas', 'Não Entregues', 'Tipo Pagamento', 'Valor', 'Status']
        ],
        'Despesas': [
          ['Data', 'Tipo', 'Descrição', 'Valor', 'Categoria']
        ]
      };

      // Adicionar dados de dias trabalhados
      diasTrabalhados.forEach(dia => {
        dadosExcel['Dias Trabalhados'].push([
          dia.data,
          dia.hora_inicio,
          dia.hora_fim,
          dia.quantidade_entregues,
          dia.quantidade_nao_entregues,
          dia.tipo_pagamento === 'por_entrega' ? 'Por Entrega' : 'Diária',
          dia.valor,
          'Concluído'
        ]);
      });

      // Adicionar dados de despesas
      despesas.forEach(despesa => {
        dadosExcel['Despesas'].push([
          despesa.data,
          despesa.tipo_despesa,
          despesa.descricao,
          despesa.valor,
          despesa.tipo_despesa
        ]);
      });

      // Criar workbook
      const wb = XLSX.utils.book_new();
      
      // Adicionar cada planilha
      Object.entries(dadosExcel).forEach(([nome, dados]) => {
        const ws = XLSX.utils.aoa_to_sheet(dados);
        XLSX.utils.book_append_sheet(wb, ws, nome);
      });

      // Salvar arquivo
      const nomeArquivo = `relatorios_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`;
      XLSX.writeFile(wb, nomeArquivo);
      
      console.log('✅ Excel exportado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao exportar Excel:', error);
      alert('Erro ao exportar para Excel. Tente novamente.');
    }
  };

  // Função para exportar para PDF
  const exportToPDF = async () => {
    try {
      const element = document.getElementById('relatorios-content');
      if (!element) {
        alert('Elemento não encontrado para exportação.');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const nomeArquivo = `relatorios_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.pdf`;
      pdf.save(nomeArquivo);
      
      console.log('✅ PDF exportado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao exportar PDF:', error);
      alert('Erro ao exportar para PDF. Tente novamente.');
    }
  };

  // Função para definir período automático
  const definirPeriodoAutomatico = (tipo) => {
    try {
      setPeriodo(tipo);
      console.log('🔍 Relatorios - Período definido:', { tipo });
    } catch (error) {
      console.error('❌ Erro ao definir período:', error);
      alert('Erro ao definir período. Tente novamente.');
    }
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
    <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 3 }, mb: 4, px: { xs: 1, sm: 2 } }} id="relatorios-content">
      {/* Header com ações */}
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        mb={{ xs: 2, sm: 4 }}
        gap={2}
      >
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <ReportIcon color="primary" sx={{ mr: { xs: 1, sm: 2 }, fontSize: { xs: 32, sm: 40 } }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              📊 Relatórios Detalhados
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Análise completa da sua performance e finanças
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Tooltip title="Exportar para Excel">
            <IconButton onClick={exportToExcel} color="success">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exportar para PDF">
            <IconButton onClick={exportToPDF} color="error">
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Imprimir Relatório">
            <IconButton onClick={handlePrint} color="primary">
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filtros de Período */}
      <Card sx={{ mb: { xs: 2, sm: 4 }, borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              🔍 Filtros de Período
            </Typography>
            {error && (
              <Alert severity="error" sx={{ maxWidth: 400 }}>
                {error}
              </Alert>
            )}
          </Box>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Período</InputLabel>
                <Select
                  value={periodo}
                  onChange={(e) => definirPeriodoAutomatico(e.target.value)}
                  label="Período"
                >
                  <MenuItem value="semana">Esta Semana</MenuItem>
                  <MenuItem value="mes">Este Mês</MenuItem>
                  <MenuItem value="ano">Este Ano</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={fetchRelatoriosData}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <FilterIcon />}
              >
                {loading ? 'Carregando...' : 'Aplicar Filtros'}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={7}>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => definirPeriodoAutomatico('semana')}
                >
                  Última Semana
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => definirPeriodoAutomatico('mes')}
                >
                  Último Mês
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => definirPeriodoAutomatico('ano')}
                >
                  Último Ano
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={() => {
                    setPeriodo('mes');
                    setError(null);
                  }}
                >
                  Limpar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Cards de Resumo Principal */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 4 } }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Ganho Total
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem' } }}>
                    R$ {analises.totalGanhos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: { xs: 36, sm: 48 }, opacity: 0.8 }} />
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
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Total de Despesas
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem' } }}>
                    R$ {analises.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <ReceiptIcon sx={{ fontSize: { xs: 36, sm: 48 }, opacity: 0.8 }} />
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
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Lucro Líquido
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem' } }}>
                    R$ {analises.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: { xs: 36, sm: 48 }, opacity: 0.8 }} />
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
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Taxa de Sucesso
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem' } }}>
                    {analises.taxaSucesso.toFixed(1)}%
                  </Typography>
                </Box>
                <StarIcon sx={{ fontSize: { xs: 36, sm: 48 }, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs para diferentes seções */}
      <Card sx={{ mb: { xs: 2, sm: 4 } }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', overflowX: 'auto' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="relatórios tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minWidth: { xs: 80, sm: 120 },
                padding: { xs: '8px 12px', sm: '12px 16px' }
              }
            }}
          >
            <Tab icon={<TimelineIcon />} iconPosition="start" label="Visão Geral" />
            <Tab icon={<CalendarIcon />} iconPosition="start" label="Dias Trabalhados" />
            <Tab icon={<ReceiptIcon />} iconPosition="start" label="Despesas" />
            <Tab icon={<BarChartIcon />} iconPosition="start" label="Gráficos" />
          </Tabs>
        </Box>

        {/* Tab 1: Visão Geral */}
        {activeTab === 0 && (
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {/* Métricas de Performance */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
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
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
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
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, mb: 2 }}>
              📅 Histórico de Dias Trabalhados
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Data</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Horário</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Entregas</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Não Entregues</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Tipo Pagamento</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Valor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {diasTrabalhados.length > 0 ? (
                    diasTrabalhados.map((dia, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{dia.data}</TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
                          {dia.hora_inicio} - {dia.hora_fim}
                        </TableCell>
                        <TableCell sx={{ color: 'success.main', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {dia.quantidade_entregues}
                        </TableCell>
                        <TableCell sx={{ color: 'error.main', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {dia.quantidade_nao_entregues}
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Chip 
                            label={dia.tipo_pagamento === 'por_entrega' ? 'Por Entrega' : 'Diária'}
                            color={dia.tipo_pagamento === 'por_entrega' ? 'primary' : 'secondary'}
                            size="small"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'success.main', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
                          R$ {dia.valor}
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Chip 
                            label="Concluído" 
                            color="success" 
                            size="small"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
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
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, mb: 2 }}>
              💸 Histórico de Despesas
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Data</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Descrição</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Valor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Categoria</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {despesas.length > 0 ? (
                    despesas.map((despesa, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{despesa.data}</TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Chip 
                            label={despesa.tipo_despesa}
                            color="warning"
                            size="small"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{despesa.descricao}</TableCell>
                        <TableCell sx={{ color: 'error.main', fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
                          R$ {despesa.valor}
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Chip 
                            label={despesa.tipo_despesa}
                            color="info"
                            size="small"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
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
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {/* Gráfico de Performance Semanal */}
              <Grid item xs={12} md={8}>
                <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: { xs: 320, sm: 450 } }}>
                  <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1.25rem' }, mb: { xs: 1, sm: 2 } }}>
                      📊 Performance Semanal
                    </Typography>
                    {dadosGraficos.performanceSemanal.some(d => d.entregas > 0 || d.ganho > 0 || d.despesa > 0) ? (
                      <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
                        <BarChart data={dadosGraficos.performanceSemanal} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis 
                            dataKey="dia" 
                            tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                            stroke="#666"
                          />
                          <YAxis 
                            yAxisId="left"
                            tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                            stroke="#666"
                          />
                          <YAxis 
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                            stroke="#666"
                            tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                          />
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                              border: '1px solid #ccc',
                              borderRadius: '8px',
                              fontSize: isMobile ? '11px' : '12px'
                            }}
                            formatter={(value, name) => {
                              if (name === 'Entregas') {
                                return [`${value} entregas`, name];
                              }
                              return [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name];
                            }}
                          />
                          <Legend 
                            wrapperStyle={{ fontSize: isMobile ? '10px' : '12px', paddingTop: '10px' }}
                            iconType="square"
                          />
                          <Bar 
                            yAxisId="left"
                            dataKey="entregas" 
                            fill="#8884d8" 
                            name="Entregas" 
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar 
                            yAxisId="right"
                            dataKey="ganho" 
                            fill="#82ca9d" 
                            name="Ganho (R$)" 
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar 
                            yAxisId="right"
                            dataKey="despesa" 
                            fill="#ffc658" 
                            name="Despesa (R$)" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="center" height={isMobile ? 250 : 350}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, textAlign: 'center', px: 2 }}>
                          Nenhum dado disponível para o período selecionado
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Gráfico de Distribuição de Despesas */}
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: { xs: 320, sm: 450 } }}>
                  <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1.25rem' }, mb: { xs: 1, sm: 2 } }}>
                      💰 Distribuição de Despesas
                    </Typography>
                    {dadosGraficos.distribuicaoDespesas.length > 0 && 
                     dadosGraficos.distribuicaoDespesas[0].name !== 'Nenhuma despesa' ? (
                      <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
                        <PieChart>
                          <Pie
                            data={dadosGraficos.distribuicaoDespesas}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent, value }) => {
                              if (isMobile) return '';
                              return `${name}: ${(percent * 100).toFixed(0)}%`;
                            }}
                            outerRadius={isMobile ? 70 : 100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                          >
                            {dadosGraficos.distribuicaoDespesas.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                              border: '1px solid #ccc',
                              borderRadius: '8px',
                              fontSize: isMobile ? '11px' : '12px'
                            }}
                            formatter={(value, name) => [
                              `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                              name
                            ]}
                          />
                          <Legend 
                            wrapperStyle={{ fontSize: isMobile ? '10px' : '12px', paddingTop: '10px' }}
                            iconType="circle"
                            formatter={(value) => value}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="center" height={isMobile ? 250 : 350}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, textAlign: 'center', px: 2 }}>
                          Nenhuma despesa registrada
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Gráfico de Evolução de Ganhos */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: { xs: 320, sm: 400 } }}>
                  <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1.25rem' }, mb: { xs: 1, sm: 2 } }}>
                      📈 Evolução de Ganhos e Despesas
                    </Typography>
                    {dadosGraficos.performanceSemanal.some(d => d.ganho > 0 || d.despesa > 0) ? (
                      <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                        <AreaChart data={dadosGraficos.performanceSemanal} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <defs>
                            <linearGradient id="colorGanho" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis 
                            dataKey="dia" 
                            tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                            stroke="#666"
                          />
                          <YAxis 
                            tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                            stroke="#666"
                            tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                          />
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                              border: '1px solid #ccc',
                              borderRadius: '8px',
                              fontSize: isMobile ? '11px' : '12px'
                            }}
                            formatter={(value) => [
                              `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                              ''
                            ]}
                          />
                          <Legend 
                            wrapperStyle={{ fontSize: isMobile ? '10px' : '12px', paddingTop: '10px' }}
                            iconType="square"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="ganho" 
                            stroke="#82ca9d" 
                            fillOpacity={1} 
                            fill="url(#colorGanho)" 
                            name="Ganho (R$)"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="despesa" 
                            stroke="#ffc658" 
                            fillOpacity={1} 
                            fill="url(#colorDespesa)" 
                            name="Despesa (R$)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="center" height={isMobile ? 250 : 300}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, textAlign: 'center', px: 2 }}>
                          Nenhum dado financeiro disponível
                        </Typography>
                      </Box>
                    )}
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