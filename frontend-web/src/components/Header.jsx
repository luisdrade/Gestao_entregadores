import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container
} from '@mui/material';
import {
  Home as HomeIcon,
  Assessment as ReportIcon,
  Group as CommunityIcon,
  DirectionsCar as CarIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Determina se o usuário é admin
  const isAdmin = Boolean(user?.is_staff || user?.is_superuser || user?.user_type === 'admin');

  // Navegação para usuários autenticados
  const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { path: '/relatorios', label: 'Relatórios', icon: <ReportIcon /> },
    { path: '/cadastro-veiculo', label: 'Veículos', icon: <CarIcon /> },
    { path: '/comunidade', label: 'Comunidade', icon: <CommunityIcon /> }
  ];

  // Navegação para admin
  const adminNavItems = [
    { path: '/admin', label: 'Admin Dashboard', icon: <AdminIcon /> }
  ];

  // Navegação para usuários não autenticados
  const guestNavItems = [
    { path: '/login', label: 'Entrar', icon: <LoginIcon /> },
    { path: '/registrar', label: 'Cadastrar', icon: <RegisterIcon /> }
  ];

  const getNavItems = () => {
    if (!user) return guestNavItems;
    if (isAdmin) return adminNavItems;
    return userNavItems;
  };

  const getPageTitle = () => {
    if (!user) return 'Sistema de Gestão de Entregadores';
    if (isAdmin) return 'Painel Administrativo';
    return 'Sistema de Gestão de Entregadores';
  };

  return (
    <Box sx={{ backgroundColor: '#e5e5e5' }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'primary.main', borderRadius: 1, mt: 2, mx: { xs: 1, sm: 2 }, px: 1 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: 56 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                mr: 4,
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {getPageTitle()}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {getNavItems().map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    mx: 0.5,
                    borderRadius: 0,
                    borderBottom: isActive(item.path) ? '2px solid rgba(255,255,255,0.9)' : '2px solid transparent',
                    '&:hover': { backgroundColor: 'transparent', borderBottomColor: 'rgba(255,255,255,0.6)' },
                    display: { xs: 'none', sm: 'inline-flex' },
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {user && (
              <Box sx={{ ml: 2 }}>
                <IconButton onClick={handleMenuOpen} color="inherit" sx={{ p: 0 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {user?.name || user?.email}
                    </Typography>
                  </MenuItem>
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {isAdmin ? 'Administrador' : 'Entregador'}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Sair
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Header;
