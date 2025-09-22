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
    <AppBar position="static" color="primary" elevation={2}>
      <Container maxWidth="xl">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              mr: 4,
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            {getPageTitle()}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getNavItems().map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                startIcon={item.icon}
                sx={{
                  backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  },
                  display: { xs: 'none', sm: 'flex' }, // Esconde em telas pequenas
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Menu do usuário (apenas se estiver logado) */}
          {user && (
            <Box sx={{ ml: 2 }}>
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ p: 0 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
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
  );
};

export default Header;
