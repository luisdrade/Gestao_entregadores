import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Assessment as ReportIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  DirectionsCar as CarIcon
} from '@mui/icons-material';
import { RegistrosContext } from '../../context/RegistrosContext';
import { api, ENDPOINTS } from '../../services/apiClient';

const Relatorios = () => {
  const { veiculos, loading: contextLoading, error: contextError } = useContext(RegistrosContext);
  const [relatoriosData, setRelatoriosData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 Relatorios - Veículos do contexto:', veiculos);
    fetchRelatoriosData();
  }, []);

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <ReportIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
        <Typography variant="h4" component="h1">
          Relatórios
        </Typography>
      </Box>

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CarIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Pacotes
                  </Typography>
                  <Typography variant="h4">
                    {estatisticas.totalPacotes}
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
                <TrendingUpIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pacotes Entregues
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {estatisticas.pacotesEntregues}
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
                <MoneyIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Ganho Total
                  </Typography>
                  <Typography variant="h4" color="info.main">
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
                <TrendingDownIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Taxa de Entrega
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {estatisticas.taxaEntrega.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Informações do Usuário */}
      {relatoriosData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Suas Estatísticas
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Dias Trabalhados
                </Typography>
                <Typography variant="h6">
                  {estatisticas.diasTrabalhados}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Dias Conectado
                </Typography>
                <Typography variant="h6">
                  {estatisticas.diasConectado}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Veículos Cadastrados
                </Typography>
                <Typography variant="h6">
                  {estatisticas.veiculosCadastrados}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Total de Entregas
                </Typography>
                <Typography variant="h6">
                  {estatisticas.totalPacotes}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Resumo Financeiro */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo Financeiro
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Total de Dias Trabalhados:</Typography>
                <Typography variant="h6">{estatisticas.diasTrabalhados}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Ganho Total:</Typography>
                <Typography variant="h6" color="success.main">
                  R$ {estatisticas.totalGanho.toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Ganho Médio por Dia:</Typography>
                <Typography variant="h6">
                  R$ {estatisticas.diasTrabalhados > 0 ? (estatisticas.totalGanho / estatisticas.diasTrabalhados).toFixed(2) : '0,00'}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Entregas por Dia:</Typography>
                <Typography variant="h6" color="info.main">
                  {estatisticas.diasTrabalhados > 0 ? (estatisticas.totalPacotes / estatisticas.diasTrabalhados).toFixed(1) : '0,0'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meus Veículos ({veiculos.length})
              </Typography>
              {veiculos.length > 0 ? (
                veiculos.map((veiculo, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      {veiculo.modelo} - {veiculo.placa}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {veiculo.categoria}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhum veículo cadastrado
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Relatorios;