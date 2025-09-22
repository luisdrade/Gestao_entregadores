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
  Paper
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as ReportIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { api, ENDPOINTS } from '../../services/apiClient';

const DeliveryDashboard = () => {
  const [dados, setDados] = useState({
    total_veiculos: 0,
    total_ganho: 0,
    total_despesa: 0,
    lucro: 0,
    ultimos_registros: []
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
      const transformedData = {
        total_veiculos: backendData.indicadores_performance?.veiculos_cadastrados || 0,
        total_ganho: backendData.indicadores_performance?.ganho_total || 0,
        total_despesa: backendData.indicadores_performance?.despesas_total || 0,
        lucro: backendData.indicadores_performance?.lucro_liquido || 0,
        ultimos_registros: backendData.ultimos_registros || []
      };
      
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

  return (
    <Container maxWidth="xl" sx={{ mt: 3, fontFamily: 'Arial, sans-serif' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ marginBottom: '10px' }}>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Resumo Rápido - Cards Coloridos */}
      <Box sx={{ marginBottom: '30px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Resumo Rápido
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              background: '#e0f7fa', 
              padding: '15px 25px', 
              borderRadius: '8px',
              border: 'none',
              boxShadow: 'none'
            }}>
              <CardContent sx={{ padding: '0 !important' }}>
                <Box display="flex" alignItems="center">
                  <CarIcon sx={{ mr: 1, color: '#00acc1' }} />
                  <Typography variant="body1">
                    Total de Veículos: <strong>{dados.total_veiculos}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              background: '#e0f2f1', 
              padding: '15px 25px', 
              borderRadius: '8px',
              border: 'none',
              boxShadow: 'none'
            }}>
              <CardContent sx={{ padding: '0 !important' }}>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon sx={{ mr: 1, color: '#4caf50' }} />
                  <Typography variant="body1">
                    Total de Ganhos: <strong>R$ {dados.total_ganho}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              background: '#ffebee', 
              padding: '15px 25px', 
              borderRadius: '8px',
              border: 'none',
              boxShadow: 'none'
            }}>
              <CardContent sx={{ padding: '0 !important' }}>
                <Box display="flex" alignItems="center">
                  <TrendingDownIcon sx={{ mr: 1, color: '#f44336' }} />
                  <Typography variant="body1">
                    Total de Despesas: <strong>R$ {dados.total_despesa}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              background: '#e8f5e9', 
              padding: '15px 25px', 
              borderRadius: '8px',
              border: 'none',
              boxShadow: 'none'
            }}>
              <CardContent sx={{ padding: '0 !important' }}>
                <Box display="flex" alignItems="center">
                  <MoneyIcon sx={{ mr: 1, color: '#4caf50' }} />
                  <Typography variant="body1">
                    Lucro: <strong>R$ {dados.lucro}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabela de Últimos Registros */}
      <Box sx={{ marginBottom: '30px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Últimos Registros
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead sx={{ background: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Data</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tipo</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Ganho</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Despesa</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Lucro</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dados.ultimos_registros && dados.ultimos_registros.length > 0 ? (
                dados.ultimos_registros.map((registro, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{registro.data}</TableCell>
                    <TableCell>{registro.tipo_rendimento}</TableCell>
                    <TableCell>R$ {registro.ganho}</TableCell>
                    <TableCell>R$ {registro.despesa}</TableCell>
                    <TableCell>R$ {registro.lucro}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum registro ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Botão para Relatórios */}
      <Box textAlign="center" sx={{ marginTop: '30px' }}>
        <Button
          component={Link}
          to="/relatorios"
          variant="contained"
          size="large"
          startIcon={<ReportIcon />}
          sx={{ 
            color: '#1976d2',
            textDecoration: 'none',
            fontWeight: 'bold',
            background: '#e3f2fd',
            padding: '10px 20px',
            borderRadius: '5px',
            transition: '0.3s',
            '&:hover': {
              background: '#bbdefb'
            }
          }}
        >
          Visualizar Relatório Detalhado
        </Button>
      </Box>
    </Container>
  );
};

export default DeliveryDashboard;
