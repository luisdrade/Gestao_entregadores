import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
} from '@mui/icons-material';
import { RegistrosContext } from '../../context/RegistrosContext';

const CadastroVeiculo = () => {
  const { veiculos, fetchVeiculos } = useContext(RegistrosContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Carregar veículos apenas quando o componente for montado
  useEffect(() => {
    if (initialLoad) {
      const loadVeiculos = async () => {
        try {
          setLoading(true);
          await fetchVeiculos();
        } catch (err) {
          console.warn('Erro ao carregar veículos:', err);
          setError('Erro ao carregar veículos. Tente novamente mais tarde.');
        } finally {
          setLoading(false);
          setInitialLoad(false);
        }
      };
      
      loadVeiculos();
    }
  }, [initialLoad, fetchVeiculos]);

  const getCategoriaColor = (categoria) => {
    const cores = {
      'moto': 'primary',
      'carro': 'secondary',
      'bicicleta': 'success',
      'caminhão': 'warning',
      'van': 'info'
    };
    return cores[categoria.toLowerCase()] || 'default';
  };

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 3 }, mb: 4, px: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        Meus Veículos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Lista de Veículos */}
      <Card sx={{ borderRadius: { xs: 3, sm: 4 }, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Veículos cadastrados ({veiculos.length})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Visualize todos os veículos vinculados à sua conta. Esta tela é somente leitura.
          </Typography>

          {initialLoad || loading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Carregando veículos...
              </Typography>
            </Box>
          ) : veiculos.length > 0 ? (
            <Paper>
              <List>
                {veiculos.map((veiculo, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <CarIcon color="action" />
                            <Typography variant="h6">
                              {veiculo.modelo}
                            </Typography>
                            <Chip
                              label={veiculo.placa}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                            <Chip
                              label={veiculo.categoria}
                              color={getCategoriaColor(veiculo.categoria)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            Categoria: {veiculo.categoria}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < veiculos.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          ) : (
            <Box textAlign="center" py={4}>
              <CarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Nenhum veículo cadastrado ainda
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use o formulário acima para cadastrar seu primeiro veículo
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default CadastroVeiculo;
