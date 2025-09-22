import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Container
} from '@mui/material';
import {
  Person as PersonIcon,
  PersonOff as PersonOffIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Forum as ForumIcon,
  DirectionsCar as CarIcon,
} from '@mui/icons-material';
import { api, ENDPOINTS } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [postagens, setPostagens] = useState([]);
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [actionLoading, setActionLoading] = useState({});
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersResponse, postagensResponse, anunciosResponse] = await Promise.all([
        api.get(ENDPOINTS.ADMIN.USERS),
        api.get('/comunidade/api/postagens/'),
        api.get('/comunidade/api/anuncios/')
      ]);
      
      // A API retorna { success: true, data: { entregadores: [...] } }
      const usersData = usersResponse.data.success ? usersResponse.data.data.entregadores : [];
      setUsers(usersData);
      
      // A API da comunidade retorna { success: true, postagens: [...], anuncios: [...] }
      setPostagens(postagensResponse.data.postagens || []);
      setAnuncios(anunciosResponse.data.anuncios || []);
    } catch (err) {
      setError('Erro ao carregar dados: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(ENDPOINTS.ADMIN.USERS);
      // A API retorna { success: true, data: { entregadores: [...] } }
      const usersData = response.data.success ? response.data.data.entregadores : [];
      setUsers(usersData);
    } catch (err) {
      setError('Erro ao carregar usuários: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      const endpoint = ENDPOINTS.ADMIN.USER_DETAIL(userId);
      
      await api.patch(endpoint, { is_active: !currentStatus });
      await fetchUsers(); // Recarrega a lista
    } catch (err) {
      setError('Erro ao alterar status do usuário: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteDialog.user) return;
    
    try {
      setActionLoading(prev => ({ ...prev, [deleteDialog.user.id]: true }));
      await api.delete(ENDPOINTS.ADMIN.USER_DETAIL(deleteDialog.user.id));
      setDeleteDialog({ open: false, user: null });
      await fetchUsers(); // Recarrega a lista
    } catch (err) {
      setError('Erro ao excluir usuário: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(prev => ({ ...prev, [deleteDialog.user.id]: false }));
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta postagem?')) return;
    
    try {
      setActionLoading(prev => ({ ...prev, [`post_${postId}`]: true }));
      await api.delete(`/comunidade/admin/api/postagens/${postId}/`);
      setPostagens(postagens.filter(p => p.id !== postId));
    } catch (err) {
      setError('Erro ao excluir postagem: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(prev => ({ ...prev, [`post_${postId}`]: false }));
    }
  };

  const handleDeleteAnuncio = async (anuncioId) => {
    if (!window.confirm('Tem certeza que deseja excluir este anúncio?')) return;
    
    try {
      setActionLoading(prev => ({ ...prev, [`anuncio_${anuncioId}`]: true }));
      
      // Verificar se há token antes de fazer a requisição
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }
      
      const response = await api.delete(`/comunidade/admin/api/anuncios/${anuncioId}/`);
      
      if (response.data.success) {
        setAnuncios(anuncios.filter(a => a.id !== anuncioId));
        setError(null); // Limpar erros anteriores
      } else {
        setError('Erro ao excluir anúncio: ' + (response.data.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error('Erro detalhado:', err);
      if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        // Redirecionar para login
        window.location.href = '/login';
      } else {
        setError('Erro ao excluir anúncio: ' + (err.response?.data?.error || err.message));
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [`anuncio_${anuncioId}`]: false }));
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusChip = (isActive) => (
    <Chip
      label={isActive ? 'Ativo' : 'Inativo'}
      color={isActive ? 'success' : 'error'}
      size="small"
    />
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="xl">
        {/* Navegação de abas para admin */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center', 
          p: 2, 
          backgroundColor: 'primary.main',
          color: 'white'
        }}>
          <Button
            color="inherit"
            startIcon={<PersonIcon />}
            onClick={() => setActiveTab('users')}
            sx={{ backgroundColor: activeTab === 'users' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
          >
            Usuários
          </Button>
          <Button
            color="inherit"
            startIcon={<ForumIcon />}
            onClick={() => setActiveTab('posts')}
            sx={{ backgroundColor: activeTab === 'posts' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
          >
            Posts
          </Button>
          <Button
            color="inherit"
            startIcon={<CarIcon />}
            onClick={() => setActiveTab('anuncios')}
            sx={{ backgroundColor: activeTab === 'anuncios' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
          >
            Anúncios
          </Button>
        </Box>

      <Box sx={{ mt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Conteúdo baseado na aba ativa */}
        {activeTab === 'users' && (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="h2">
                  Lista de Usuários ({filteredUsers.length})
                </Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    placeholder="Buscar por @username, nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    size="small"
                  />
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchUsers}
                    disabled={loading}
                  >
                    Atualizar
                  </Button>
                </Box>
              </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>@ Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Data de Cadastro</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                          @{user.username || user.email?.split('@')[0] || 'usuario'}
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getStatusChip(user.is_active)}</TableCell>
                      <TableCell>
                        {user.date_joined ? new Date(user.date_joined).toLocaleDateString('pt-BR') : '-'}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <IconButton
                            color={user.is_active ? "warning" : "success"}
                            onClick={() => handleToggleStatus(user.id, user.is_active)}
                            disabled={actionLoading[user.id]}
                            title={user.is_active ? 'Desativar usuário' : 'Ativar usuário'}
                          >
                            {user.is_active ? <PersonOffIcon /> : <PersonIcon />}
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, user })}
                            disabled={actionLoading[user.id]}
                            title="Excluir usuário"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

              {filteredUsers.length === 0 && !loading && (
                <Box textAlign="center" py={4}>
                  <Typography variant="h6" color="text.secondary">
                    Nenhum usuário encontrado
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Seção de Posts */}
        {activeTab === 'posts' && (
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Postagens da Comunidade ({postagens.length})
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Título</TableCell>
                      <TableCell>Autor</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Conteúdo</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {postagens.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>{post.titulo}</TableCell>
                        <TableCell>{post.autor}</TableCell>
                        <TableCell>{new Date(post.data_criacao).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {post.conteudo}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleDeletePost(post.id)}
                            disabled={actionLoading[`post_${post.id}`]}
                            title="Excluir postagem"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {postagens.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography variant="h6" color="text.secondary">
                    Nenhuma postagem encontrada
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Seção de Anúncios */}
        {activeTab === 'anuncios' && (
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Anúncios de Veículos ({anuncios.length})
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Modelo</TableCell>
                      <TableCell>Ano</TableCell>
                      <TableCell>Preço</TableCell>
                      <TableCell>Localização</TableCell>
                      <TableCell>Link</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {anuncios.map((anuncio) => (
                      <TableRow key={anuncio.id}>
                        <TableCell>{anuncio.modelo}</TableCell>
                        <TableCell>{anuncio.ano}</TableCell>
                        <TableCell>R$ {anuncio.preco?.toFixed(2) || '0,00'}</TableCell>
                        <TableCell>{anuncio.localizacao}</TableCell>
                        <TableCell>
                          {anuncio.link_externo ? (
                            <Button
                              variant="outlined"
                              size="small"
                              href={anuncio.link_externo}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ textTransform: 'none' }}
                            >
                              Ver Anúncio
                            </Button>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Sem link
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteAnuncio(anuncio.id)}
                            disabled={actionLoading[`anuncio_${anuncio.id}`]}
                            title="Excluir anúncio"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {anuncios.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography variant="h6" color="text.secondary">
                    Nenhum anúncio encontrado
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Dialog de confirmação de exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o usuário <strong>{deleteDialog.user?.name || deleteDialog.user?.email}</strong>?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteUser}
            color="error"
            variant="contained"
            disabled={actionLoading[deleteDialog.user?.id]}
          >
            {actionLoading[deleteDialog.user?.id] ? <CircularProgress size={20} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </>
  );
};

export default AdminDashboard;
