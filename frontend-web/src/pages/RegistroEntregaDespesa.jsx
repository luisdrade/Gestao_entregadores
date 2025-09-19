import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { RegistrosContext } from '../context/RegistrosContext';

const RegistroEntregaDespesa = () => {
  const { registros, setRegistros } = useContext(RegistrosContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    tipo_rendimento: "",
    valor_unitario: 0,
    valor_diaria: 0,
    total_pacotes: 0,
    pacotes_entregues: 0,
    pacotes_nao_entregues: 0,
    categoria_despesa: "",
    descricao_outros: "",
    valor_despesa: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simula uma validação
      if (formData.tipo_rendimento === "") {
        throw new Error("Selecione o tipo de rendimento");
      }
      if (formData.total_pacotes === 0) {
        throw new Error("Total de pacotes deve ser maior que zero");
      }
      if (formData.pacotes_entregues + formData.pacotes_nao_entregues !== formData.total_pacotes) {
        throw new Error("A soma dos pacotes entregues e não entregues deve ser igual ao total de pacotes");
      }

      // Adiciona data atual
      const registroComData = {
        ...formData,
        data: new Date().toLocaleDateString('pt-BR'),
        ganho: formData.tipo_rendimento === "unitario" 
          ? formData.valor_unitario * formData.pacotes_entregues
          : formData.valor_diaria,
        lucro: (formData.tipo_rendimento === "unitario" 
          ? formData.valor_unitario * formData.pacotes_entregues
          : formData.valor_diaria) - formData.valor_despesa
      };

      setRegistros([...registros, registroComData]);
      
      // Limpa o formulário
      setFormData({
        tipo_rendimento: "",
        valor_unitario: 0,
        valor_diaria: 0,
        total_pacotes: 0,
        pacotes_entregues: 0,
        pacotes_nao_entregues: 0,
        categoria_despesa: "",
        descricao_outros: "",
        valor_despesa: 0
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Registro de Entregas e Despesas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
          Registro salvo com sucesso!
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Tipo de Rendimento */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Rendimento</InputLabel>
                  <Select
                    name="tipo_rendimento"
                    value={formData.tipo_rendimento}
                    onChange={handleChange}
                    label="Tipo de Rendimento"
                  >
                    <MenuItem value="unitario">Unitário</MenuItem>
                    <MenuItem value="diaria">Diária</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Valor Unitário */}
              {formData.tipo_rendimento === "unitario" && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Valor Unitário"
                    name="valor_unitario"
                    type="number"
                    value={formData.valor_unitario}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: 0.01 }}
                    required
                  />
                </Grid>
              )}

              {/* Valor Diária */}
              {formData.tipo_rendimento === "diaria" && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Valor Diária"
                    name="valor_diaria"
                    type="number"
                    value={formData.valor_diaria}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: 0.01 }}
                    required
                  />
                </Grid>
              )}

              {/* Total de Pacotes */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Total de Pacotes"
                  name="total_pacotes"
                  type="number"
                  value={formData.total_pacotes}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>

              {/* Pacotes Entregues */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Pacotes Entregues"
                  name="pacotes_entregues"
                  type="number"
                  value={formData.pacotes_entregues}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: formData.total_pacotes }}
                  required
                />
              </Grid>

              {/* Pacotes Não Entregues */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Pacotes Não Entregues"
                  name="pacotes_nao_entregues"
                  type="number"
                  value={formData.pacotes_nao_entregues}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: formData.total_pacotes }}
                  required
                />
              </Grid>

              {/* Categoria da Despesa */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Categoria da Despesa"
                  name="categoria_despesa"
                  value={formData.categoria_despesa}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Valor da Despesa */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Valor da Despesa"
                  name="valor_despesa"
                  type="number"
                  value={formData.valor_despesa}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                />
              </Grid>

              {/* Descrição Outros */}
              {formData.categoria_despesa.toLowerCase() === "outros" && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Descrição Outros"
                    name="descricao_outros"
                    value={formData.descricao_outros}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
              )}

              {/* Botão de Submit */}
              <Grid size={{ xs: 12 }}>
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {loading ? 'Salvando...' : 'Salvar Registro'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Resumo dos Últimos Registros */}
      {registros.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Últimos Registros
            </Typography>
            <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
              {registros.slice(-5).reverse().map((registro, index) => (
                <Box key={index} p={2} borderBottom="1px solid #eee">
                  <Typography variant="body2" color="text.secondary">
                    {registro.data} - {registro.tipo_rendimento}
                  </Typography>
                  <Typography variant="body1">
                    Ganho: R$ {registro.ganho?.toFixed(2) || '0,00'} | 
                    Despesa: R$ {registro.valor_despesa?.toFixed(2) || '0,00'} | 
                    Lucro: R$ {registro.lucro?.toFixed(2) || '0,00'}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default RegistroEntregaDespesa;
