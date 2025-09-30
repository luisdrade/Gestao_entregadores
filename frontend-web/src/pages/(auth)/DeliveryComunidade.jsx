import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Avatar
} from '@mui/material';
import {
  PostAdd as PostAddIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { api, ENDPOINTS, API_BASE_URL } from '../../services/apiClient';

const DeliveryComunidade = () => {
  const [postagens, setPostagens] = useState([]);
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [postData, setPostData] = useState({
    autor: "",
    titulo: "",
    conteudo: ""
  });

  const [anuncioData, setAnuncioData] = useState({
    modelo: "",
    ano: "",
    quilometragem: "",
    preco: "",
    localizacao: "",
    link_externo: "",
    foto: null,
  });

  useEffect(() => {
    fetchComunidadeData();
  }, []);

  const fetchComunidadeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [postagensResponse, anunciosResponse] = await Promise.all([
        api.get('/comunidade/api/postagens/'),
        api.get('/comunidade/api/anuncios/')
      ]);
      setPostagens(postagensResponse.data.postagens || []);
      setAnuncios(anunciosResponse.data.anuncios || []);
    } catch (err) {
      setError('Erro ao carregar dados da comunidade: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePostChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleAnuncioChange = (e) => {
    if (e.target.name === "foto") {
      setAnuncioData({ ...anuncioData, foto: e.target.files[0] });
    } else {
      setAnuncioData({ ...anuncioData, [e.target.name]: e.target.value });
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const formatHandle = (value) => {
        const raw = (value || '').toString().trim();
        if (!raw) return '@usuario';
        const noAt = raw.replace(/^@+/, '');
        const compact = noAt.replace(/\s+/g, '_');
        const safe = compact.replace(/[^a-zA-Z0-9_.-]/g, '');
        return `@${safe || 'usuario'}`;
      };

      const response = await api.post('/comunidade/api/postagens/', {
        autor: formatHandle(postData.autor),
        titulo: postData.titulo,
        conteudo: postData.conteudo
      }, {
        headers: { "Content-Type": "application/json" },
      });
      
      setPostagens([response.data.postagem, ...postagens]);
      setPostData({ autor: "", titulo: "", conteudo: "" });
    } catch (err) {
      setError('Erro ao criar postagem: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAnuncioSubmit = async (e) => {
    e.preventDefault();
    try {
      const formatHandle = (value) => {
        const raw = (value || '').toString().trim();
        if (!raw) return '@usuario';
        const noAt = raw.replace(/^@+/, '');
        const compact = noAt.replace(/\s+/g, '_');
        const safe = compact.replace(/[^a-zA-Z0-9_.-]/g, '');
        return `@${safe || 'usuario'}`;
      };

      const formData = new FormData();
      Object.entries(anuncioData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      // Normalizar vendedor se existir campo no formulário (opcional)
      if (formData.has('vendedor')) {
        formData.set('vendedor', formatHandle(formData.get('vendedor')));
      }

      const response = await api.post('/comunidade/api/anuncios/', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setAnuncios([response.data.anuncio, ...anuncios]);
      setAnuncioData({
        modelo: "",
        ano: "",
        quilometragem: "",
        preco: "",
        localizacao: "",
        link_externo: "",
        foto: null,
      });
    } catch (err) {
      setError('Erro ao criar anúncio: ' + (err.response?.data?.message || err.message));
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
        Comunidade de Entregadores
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Fórum */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PostAddIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Fórum - Compartilhe suas experiências
                </Typography>
              </Box>

              <Box component="form" onSubmit={handlePostSubmit} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Seu nome"
                  name="autor"
                  value={postData.autor}
                  onChange={handlePostChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Título do post"
                  name="titulo"
                  value={postData.titulo}
                  onChange={handlePostChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Conteúdo"
                  name="conteudo"
                  value={postData.conteudo}
                  onChange={handlePostChange}
                  multiline
                  rows={4}
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<PostAddIcon />}
                  sx={{ mt: 2 }}
                >
                  Publicar no fórum
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Postagens recentes
              </Typography>
              <List>
                {postagens.length > 0 ? (
                  postagens.map((post) => (
                    <ListItem key={post.id} component={Paper} sx={{ mb: 1, p: 2 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                            <PersonIcon />
                          </Avatar>
                          <Typography variant="h6" component="div">
                            {post.titulo}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            por {post.autor} em {new Date(post.data_criacao).toLocaleDateString('pt-BR')}
                          </Typography>
                          <Typography variant="body1">
                            {post.conteudo}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <Typography variant="body2" color="text.secondary">
                      Nenhuma postagem encontrada.
                    </Typography>
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Anúncios de Veículos */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Anúncios de Veículos
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleAnuncioSubmit} sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Modelo"
                      name="modelo"
                      value={anuncioData.modelo}
                      onChange={handleAnuncioChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Ano"
                      name="ano"
                      type="number"
                      value={anuncioData.ano}
                      onChange={handleAnuncioChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Quilometragem"
                      name="quilometragem"
                      type="number"
                      value={anuncioData.quilometragem}
                      onChange={handleAnuncioChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Preço"
                      name="preco"
                      type="number"
                      step="0.01"
                      value={anuncioData.preco}
                      onChange={handleAnuncioChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Localização"
                      name="localizacao"
                      value={anuncioData.localizacao}
                      onChange={handleAnuncioChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Link externo"
                      name="link_externo"
                      type="url"
                      value={anuncioData.link_externo}
                      onChange={handleAnuncioChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<CarIcon />}
                    >
                      Foto do veículo
                      <input
                        type="file"
                        name="foto"
                        onChange={handleAnuncioChange}
                        accept="image/*"
                        hidden
                      />
                    </Button>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<CarIcon />}
                  sx={{ mt: 2 }}
                >
                  Publicar anúncio
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Anúncios recentes
              </Typography>
              <List>
                {anuncios.length > 0 ? (
                  anuncios.map((anuncio) => (
                    <ListItem key={anuncio.id} component={Paper} sx={{ mb: 1, p: 2 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                          <Typography variant="h6" component="div">
                            {anuncio.modelo} - {anuncio.ano}
                          </Typography>
                          <Chip
                            label={`R$ ${anuncio.preco?.toFixed(2) || '0,00'}`}
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Km: {anuncio.quilometragem} | Localização: {anuncio.localizacao}
                          </Typography>
                          {anuncio.link_externo && (
                            <Button
                              size="small"
                              href={anuncio.link_externo}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ mt: 1 }}
                            >
                              Ver anúncio
                            </Button>
                          )}
                          {anuncio.foto && (
                            <Box sx={{ mt: 1 }}>
                              <img
                                src={`${API_BASE_URL}${anuncio.foto}`}
                                alt="Foto do veículo"
                                style={{
                                  width: '100%',
                                  maxWidth: 200,
                                  height: 'auto',
                                  borderRadius: 8
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <Typography variant="body2" color="text.secondary">
                      Nenhum anúncio encontrado.
                    </Typography>
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DeliveryComunidade;
