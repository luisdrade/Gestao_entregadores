import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  DirectionsCar as CarIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { RegistrosContext } from '../../context/RegistrosContext';
import { api, ENDPOINTS } from '../../services/apiClient';
import { handleApiError } from '../../utils/errorHandler';
import { SUCCESS_MESSAGES } from '../../config/constants';

const CadastroVeiculo = () => {
  const { veiculos, setVeiculos, fetchVeiculos } = useContext(RegistrosContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const [formData, setFormData] = useState({
    modelo: "",
    placa: "",
    categoria: ""
  });

  // Carregar veículos apenas quando o componente for montado
  useEffect(() => {
    if (initialLoad) {
      const loadVeiculos = async () => {
        try {
          await fetchVeiculos();
        } catch (err) {
          console.warn('Erro ao carregar veículos:', err);
        } finally {
          setInitialLoad(false);
        }
      };
      
      loadVeiculos();
    }
  }, [initialLoad, fetchVeiculos]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validações
      if (!formData.modelo.trim()) {
        throw new Error("Modelo é obrigatório");
      }
      if (!formData.placa.trim()) {
        throw new Error("Placa é obrigatória");
      }
      if (!formData.categoria.trim()) {
        throw new Error("Categoria é obrigatória");
      }

      // Verifica se a placa já existe
      const placaExists = veiculos.some((veiculo, index) => 
        veiculo.placa.toLowerCase() === formData.placa.toLowerCase() && 
        index !== editingIndex
      );

      if (placaExists) {
        throw new Error("Já existe um veículo cadastrado com esta placa");
      }

      console.log('🔍 CadastroVeiculo - Enviando dados:', formData);

      if (editingIndex !== null) {
        // Editando veículo existente
        const veiculoId = veiculos[editingIndex].id;
        const response = await api.put(ENDPOINTS.VEICULOS.UPDATE(veiculoId), formData);
        console.log('🔍 CadastroVeiculo - Veículo atualizado:', response.data);
        
        const novosVeiculos = [...veiculos];
        novosVeiculos[editingIndex] = { ...formData, id: veiculoId };
        setVeiculos(novosVeiculos);
        setEditingIndex(null);
        setSuccess(SUCCESS_MESSAGES.VEHICLE_UPDATED);
      } else {
        // Adicionando novo veículo
        const response = await api.post(ENDPOINTS.VEICULOS.CREATE, formData);
        console.log('🔍 CadastroVeiculo - Veículo criado:', response.data);
        
        setVeiculos([...veiculos, { ...formData, id: response.data.id }]);
        setSuccess(SUCCESS_MESSAGES.VEHICLE_CREATED);
      }

      // Limpa o formulário
      setFormData({ modelo: "", placa: "", categoria: "" });
    } catch (err) {
      console.error('❌ CadastroVeiculo - Erro ao salvar:', err);
      setError(handleApiError(err, 'Erro ao salvar veículo'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const veiculo = veiculos[index];
    setFormData({ ...veiculo });
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    if (window.confirm("Tem certeza que deseja excluir este veículo?")) {
      try {
        const veiculoId = veiculos[index].id;
        console.log('🔍 CadastroVeiculo - Excluindo veículo:', veiculoId);
        
        await api.delete(ENDPOINTS.VEICULOS.DELETE(veiculoId));
        console.log('🔍 CadastroVeiculo - Veículo excluído com sucesso');
        
        const novosVeiculos = veiculos.filter((_, i) => i !== index);
        setVeiculos(novosVeiculos);
        setSuccess(SUCCESS_MESSAGES.VEHICLE_DELETED);
      } catch (err) {
        console.error('❌ CadastroVeiculo - Erro ao excluir:', err);
        setError(handleApiError(err, 'Erro ao excluir veículo'));
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setFormData({ modelo: "", placa: "", categoria: "" });
  };

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
        Cadastro de Veículo
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
          {success}
        </Alert>
      )}

      {/* Formulário */}
      <Card sx={{ mb: { xs: 2, sm: 3 }, borderRadius: { xs: 2, sm: 3 } }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box display="flex" alignItems="center" mb={2}>
            <CarIcon color="primary" sx={{ mr: 1, fontSize: { xs: 20, sm: 24 } }} />
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {editingIndex !== null ? 'Editar Veículo' : 'Novo Veículo'}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Placa"
                  name="placa"
                  value={formData.placa}
                  onChange={handleChange}
                  required
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Moto, Carro, Bicicleta"
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                    sx={{ px: 4 }}
                  >
                    {loading ? 'Salvando...' : (editingIndex !== null ? 'Atualizar' : 'Salvar')}
                  </Button>
                  
                  {editingIndex !== null && (
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      sx={{ px: 4 }}
                    >
                      Cancelar
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Lista de Veículos */}
      <Card sx={{ borderRadius: { xs: 2, sm: 3 } }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Veículos Cadastrados ({veiculos.length})
          </Typography>

          {initialLoad ? (
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
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleEdit(index)}
                          color="primary"
                          title="Editar veículo"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(index)}
                          color="error"
                          title="Excluir veículo"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
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
