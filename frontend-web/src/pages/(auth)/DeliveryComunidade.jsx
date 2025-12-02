import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Container,
  Paper,
  List,
  ListItem,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Avatar
} from '@mui/material';
import {
  PostAdd as PostAddIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { api, API_BASE_URL } from '../../services/apiClient';

const DeliveryComunidade = () => {
  const [postagens, setPostagens] = useState([]);
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <Card sx={{ borderRadius: 3, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PostAddIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Fórum - Compartilhe suas experiências
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Veja as últimas conversas da comunidade de entregadores. Esta área é somente leitura, 
                ideal para acompanhar dicas, histórias e experiências.
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Postagens recentes
              </Typography>
              <List sx={{ mt: 1 }}>
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
          <Card sx={{ borderRadius: 3, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Anúncios de Veículos
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Explore anúncios de veículos feitos por outros entregadores. 
                Use esses exemplos como referência para o seu próximo negócio.
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Anúncios recentes
              </Typography>
              <List sx={{ mt: 1 }}>
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
