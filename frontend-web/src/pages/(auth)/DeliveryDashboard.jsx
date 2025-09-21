import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
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
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';
import { api, ENDPOINTS } from '../../services/apiClient';
import { RegistrosContext } from '../../context/RegistrosContext';

const DeliveryDashboard = () => {
  const { registros, veiculos } = useContext(RegistrosContext);
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
      lucro_liquido: 0
    },
    periodo: 'mes',
    data_inicio: '',
    data_fim: ''
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
      setDados(response.data.data || response.data);
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

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard do Entregador
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CarIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Entregas Realizadas
                  </Typography>
                  <Typography variant="h4">
                    {dados.indicadores_performance?.entregas_realizadas || 0}
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
                <MoneyIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Ganho Total
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    R$ {dados.indicadores_performance?.ganho_total?.toFixed(2) || '0,00'}
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
                    Despesas Total
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    R$ {dados.indicadores_performance?.despesas_total?.toFixed(2) || '0,00'}
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
                    Lucro Líquido
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    R$ {dados.indicadores_performance?.lucro_liquido?.toFixed(2) || '0,00'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Indicadores de Performance do Período */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Dias Trabalhados
                  </Typography>
                  <Typography variant="h4">
                    {dados.indicadores_performance?.dias_trabalhados || 0}
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
                <CarIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Entregas Realizadas
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {dados.indicadores_performance?.entregas_realizadas || 0}
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
                    R$ {dados.indicadores_performance?.ganho_total?.toFixed(2) || '0,00'}
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
                <ReportIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Lucro Líquido
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    R$ {dados.indicadores_performance?.lucro_liquido?.toFixed(2) || '0,00'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Informações do Período */}
      {dados.periodo && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Período de Análise: {dados.periodo === 'mes' ? 'Último Mês' : 'Última Semana'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              De {dados.data_inicio} até {dados.data_fim}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Tabela de Últimos Registros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Últimos Registros ({registros.length})
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
                {registros.length > 0 ? (
                  registros.slice(0, 10).map((registro, index) => (
                    <TableRow key={index}>
                      <TableCell>{registro.data || 'N/A'}</TableCell>
                      <TableCell>{registro.tipo_rendimento || 'N/A'}</TableCell>
                      <TableCell>{registro.total_pacotes || 0}</TableCell>
                      <TableCell>{registro.pacotes_entregues || 0}</TableCell>
                      <TableCell>R$ {registro.ganho?.toFixed(2) || '0,00'}</TableCell>
                      <TableCell>R$ {registro.valor_despesa?.toFixed(2) || '0,00'}</TableCell>
                      <TableCell>R$ {registro.lucro?.toFixed(2) || '0,00'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Tabela de Veículos */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Meus Veículos ({veiculos.length})
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Modelo</TableCell>
                  <TableCell>Placa</TableCell>
                  <TableCell>Categoria</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {veiculos.length > 0 ? (
                  veiculos.map((veiculo, index) => (
                    <TableRow key={index}>
                      <TableCell>{veiculo.modelo || 'N/A'}</TableCell>
                      <TableCell>{veiculo.placa || 'N/A'}</TableCell>
                      <TableCell>{veiculo.categoria || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Nenhum veículo cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Botão para Relatórios */}
      <Box textAlign="center" sx={{ mt: 3 }}>
        <Button
          component={Link}
          to="/relatorios"
          variant="contained"
          size="large"
          startIcon={<ReportIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          Visualizar Relatório Detalhado
        </Button>
      </Box>
    </Container>
  );
};

export default DeliveryDashboard;
