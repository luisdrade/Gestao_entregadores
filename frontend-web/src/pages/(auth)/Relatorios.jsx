import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button
} from '@mui/material';
import {
  Assessment as ReportIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  DirectionsCar as CarIcon,
  Receipt as ReceiptIcon,
  Category as CategoryIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { RegistrosContext } from '../../context/RegistrosContext';
import { api, ENDPOINTS } from '../../services/apiClient';

const Relatorios = () => {
  const { registros, veiculos, despesas, loading: contextLoading, error: contextError } = useContext(RegistrosContext);
  const [relatoriosData, setRelatoriosData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  useEffect(() => {
    console.log('🔍 Relatorios - Registros do contexto:', registros);
    console.log('🔍 Relatorios - Veículos do contexto:', veiculos);
    fetchRelatoriosData();
  }, [registros]);

  const fetchRelatoriosData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Relatorios - Fazendo chamada para /api/relatorios/estatisticas/');
      const response = await api.get('/api/relatorios/estatisticas/');
      console.log('🔍 Relatorios - Resposta dos relatórios:', response.data);
      setRelatoriosData(response.data);
    } catch (err) {
      console.error('❌ Relatorios - Erro ao carregar dados dos relatórios:', err);
      setError('Erro ao carregar dados dos relatórios: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = () => {
    const totalGanho = registros.reduce((sum, reg) => sum + (reg.ganho || 0), 0);
    const totalDespesa = registros.reduce((sum, reg) => sum + (reg.valor_despesa || 0), 0);
    const lucroTotal = totalGanho - totalDespesa;
    const totalPacotes = registros.reduce((sum, reg) => sum + (reg.total_pacotes || 0), 0);
    const pacotesEntregues = registros.reduce((sum, reg) => sum + (reg.pacotes_entregues || 0), 0);
    const taxaEntrega = totalPacotes > 0 ? (pacotesEntregues / totalPacotes) * 100 : 0;

    return {
      totalGanho,
      totalDespesa,
      lucroTotal,
      totalPacotes,
      pacotesEntregues,
      taxaEntrega,
      totalRegistros: registros.length
    };
  };

  const calcularDespesasPorCategoria = () => {
    const despesasPorCategoria = {};
    
    despesas.forEach(despesa => {
      const categoria = despesa.categoria_despesa || despesa.tipo_despesa || 'Outros';
      if (!despesasPorCategoria[categoria]) {
        despesasPorCategoria[categoria] = {
          total: 0,
          quantidade: 0,
          registros: []
        };
      }
      despesasPorCategoria[categoria].total += despesa.valor_despesa || despesa.valor;
      despesasPorCategoria[categoria].quantidade += 1;
      despesasPorCategoria[categoria].registros.push(despesa);
    });

    return despesasPorCategoria;
  };

  const obterDespesasDetalhadas = () => {
    return despesas
      .filter(despesa => (despesa.valor_despesa || despesa.valor) > 0)
      .sort((a, b) => new Date(b.data) - new Date(a.data));
  };

  const filtrarRegistros = () => {
    let registrosFiltrados = [...registros];

    if (filtroTipo !== 'todos') {
      registrosFiltrados = registrosFiltrados.filter(reg => reg.tipo_rendimento === filtroTipo);
    }

    if (filtroPeriodo !== 'todos') {
      const hoje = new Date();
      const dataLimite = new Date();
      
      switch (filtroPeriodo) {
        case 'semana':
          dataLimite.setDate(hoje.getDate() - 7);
          break;
        case 'mes':
          dataLimite.setMonth(hoje.getMonth() - 1);
          break;
        case 'trimestre':
          dataLimite.setMonth(hoje.getMonth() - 3);
          break;
        default:
          break;
      }

      if (filtroPeriodo !== 'todos') {
        registrosFiltrados = registrosFiltrados.filter(reg => {
          const dataRegistro = new Date(reg.data.split('/').reverse().join('-'));
          return dataRegistro >= dataLimite;
        });
      }
    }

    return registrosFiltrados;
  };

  const estatisticas = calcularEstatisticas();
  const registrosFiltrados = filtrarRegistros();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Relatórios e Análises
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Período</InputLabel>
                <Select
                  value={filtroPeriodo}
                  onChange={(e) => setFiltroPeriodo(e.target.value)}
                  label="Período"
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="semana">Última semana</MenuItem>
                  <MenuItem value="mes">Último mês</MenuItem>
                  <MenuItem value="trimestre">Último trimestre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Rendimento</InputLabel>
                <Select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  label="Tipo de Rendimento"
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="unitario">Unitário</MenuItem>
                  <MenuItem value="diaria">Diária</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MoneyIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Ganhos
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    R$ {estatisticas.totalGanho.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MoneyIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Despesas
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    R$ {estatisticas.totalDespesa.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Lucro Total
                  </Typography>
                  <Typography variant="h4" color={estatisticas.lucroTotal >= 0 ? "info.main" : "error.main"}>
                    R$ {estatisticas.lucroTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CarIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Taxa de Entrega
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {estatisticas.taxaEntrega.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Estatísticas Detalhadas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estatísticas de Pacotes
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Total de Pacotes:</Typography>
                <Typography variant="h6">{estatisticas.totalPacotes}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Pacotes Entregues:</Typography>
                <Typography variant="h6" color="success.main">{estatisticas.pacotesEntregues}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Pacotes Não Entregues:</Typography>
                <Typography variant="h6" color="error.main">
                  {estatisticas.totalPacotes - estatisticas.pacotesEntregues}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Taxa de Entrega:</Typography>
                <Chip
                  label={`${estatisticas.taxaEntrega.toFixed(1)}%`}
                  color={estatisticas.taxaEntrega >= 90 ? "success" : estatisticas.taxaEntrega >= 70 ? "warning" : "error"}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo Financeiro
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Total de Registros:</Typography>
                <Typography variant="h6">{estatisticas.totalRegistros}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Ganho Médio por Registro:</Typography>
                <Typography variant="h6">
                  R$ {estatisticas.totalRegistros > 0 ? (estatisticas.totalGanho / estatisticas.totalRegistros).toFixed(2) : '0,00'}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Despesa Média por Registro:</Typography>
                <Typography variant="h6">
                  R$ {estatisticas.totalRegistros > 0 ? (estatisticas.totalDespesa / estatisticas.totalRegistros).toFixed(2) : '0,00'}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Lucro Médio por Registro:</Typography>
                <Typography variant="h6" color={estatisticas.lucroTotal >= 0 ? "success.main" : "error.main"}>
                  R$ {estatisticas.totalRegistros > 0 ? (estatisticas.lucroTotal / estatisticas.totalRegistros).toFixed(2) : '0,00'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Relatório Detalhado de Despesas */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <ReceiptIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" component="h2">
              Relatório Detalhado de Despesas
            </Typography>
          </Box>

          {/* Despesas por Categoria */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <CategoryIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Despesas por Categoria
                    </Typography>
                  </Box>
                  {Object.keys(calcularDespesasPorCategoria()).length > 0 ? (
                    Object.entries(calcularDespesasPorCategoria()).map(([categoria, dados]) => (
                      <Box key={categoria} display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">
                          {categoria} ({dados.quantidade} registros)
                        </Typography>
                        <Typography variant="body2" color="error.main" fontWeight="bold">
                          R$ {dados.total.toFixed(2)}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nenhuma despesa registrada
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TimelineIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Resumo de Despesas
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Total de Despesas:</Typography>
                    <Typography variant="h6" color="error.main">
                      R$ {estatisticas.totalDespesa.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Média por Registro:</Typography>
                    <Typography variant="h6">
                      R$ {estatisticas.totalRegistros > 0 ? (estatisticas.totalDespesa / estatisticas.totalRegistros).toFixed(2) : '0,00'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>% do Ganho Total:</Typography>
                    <Typography variant="h6" color="warning.main">
                      {estatisticas.totalGanho > 0 ? ((estatisticas.totalDespesa / estatisticas.totalGanho) * 100).toFixed(1) : '0,0'}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabela de Despesas Detalhadas */}
          <Typography variant="h6" gutterBottom>
            Histórico Detalhado de Despesas
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Tipo Rendimento</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {obterDespesasDetalhadas().length > 0 ? (
                  obterDespesasDetalhadas().map((despesa, index) => (
                    <TableRow key={index}>
                      <TableCell>{despesa.data}</TableCell>
                      <TableCell>
                        <Chip 
                          label={despesa.categoria_despesa || despesa.tipo_despesa || 'Outros'} 
                          size="small" 
                          color="secondary" 
                        />
                      </TableCell>
                      <TableCell>
                        {despesa.descricao || despesa.descricao_outros || 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="error.main" fontWeight="bold">
                          R$ {(despesa.valor_despesa || despesa.valor)?.toFixed(2) || '0,00'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label="Despesa" 
                          size="small" 
                          color="primary" 
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
      </Card>

      {/* Tabela de Registros Filtrados */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Registros Filtrados ({registrosFiltrados.length})
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Total Pacotes</TableCell>
                  <TableCell>Entregues</TableCell>
                  <TableCell>Ganho</TableCell>
                  <TableCell>Despesa</TableCell>
                  <TableCell>Lucro</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((registro, index) => (
                    <TableRow key={index}>
                      <TableCell>{registro.data}</TableCell>
                      <TableCell>
                        <Chip
                          label={registro.tipo_rendimento}
                          color={registro.tipo_rendimento === 'unitario' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{registro.total_pacotes}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {registro.pacotes_entregues}
                          <Chip
                            label={`${((registro.pacotes_entregues / registro.total_pacotes) * 100).toFixed(1)}%`}
                            color={registro.pacotes_entregues / registro.total_pacotes >= 0.9 ? "success" : "warning"}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>R$ {registro.ganho?.toFixed(2) || '0,00'}</TableCell>
                      <TableCell>R$ {registro.valor_despesa?.toFixed(2) || '0,00'}</TableCell>
                      <TableCell>
                        <Typography color={registro.lucro >= 0 ? "success.main" : "error.main"}>
                          R$ {registro.lucro?.toFixed(2) || '0,00'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Nenhum registro encontrado com os filtros aplicados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Relatorios;
