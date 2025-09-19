import React, { useEffect, useState } from "react";
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

const DeliveryDashboard = () => {
  const [dados, setDados] = useState({
    total_veiculos: 0,
    total_ganho: 0,
    total_despesa: 0,
    lucro: 0,
    ultimos_registros: [],
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
      const response = await api.get('/api/dashboard-data/');
      setDados(response.data.data || response.data);
    } catch (err) {
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
                    Total de Veículos
                  </Typography>
                  <Typography variant="h4">
                    {dados.total_veiculos}
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
                    Total de Ganhos
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    R$ {dados.total_ganho?.toFixed(2) || '0,00'}
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
                    R$ {dados.total_despesa?.toFixed(2) || '0,00'}
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
                    Lucro
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    R$ {dados.lucro?.toFixed(2) || '0,00'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de Últimos Registros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Últimos Registros
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Ganho</TableCell>
                  <TableCell>Despesa</TableCell>
                  <TableCell>Lucro</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dados.ultimos_registros?.length > 0 ? (
                  dados.ultimos_registros.map((registro, index) => (
                    <TableRow key={index}>
                      <TableCell>{registro.data}</TableCell>
                      <TableCell>{registro.tipo_rendimento}</TableCell>
                      <TableCell>R$ {registro.ganho?.toFixed(2) || '0,00'}</TableCell>
                      <TableCell>R$ {registro.despesa?.toFixed(2) || '0,00'}</TableCell>
                      <TableCell>R$ {registro.lucro?.toFixed(2) || '0,00'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Nenhum registro encontrado
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
