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
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider
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
  PersonAdd as RegisterIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleNavClick = (path) => {
    handleMobileMenuClose();
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
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'primary.main', borderRadius: 1, mt: { xs: 1, sm: 2 }, mx: { xs: 0.5, sm: 2 }, px: { xs: 0.5, sm: 1 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
          <Toolbar sx={{ minHeight: { xs: 48, sm: 56 }, px: { xs: 0, sm: 2 } }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                mr: { xs: 1, sm: 4 },
                fontWeight: 700,
                fontSize: { xs: '0.875rem', sm: '1.25rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {getPageTitle()}
            </Typography>

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0 }}>
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
                    fontSize: '0.9rem'
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {user && (
              <Box sx={{ ml: { xs: 0.5, sm: 2 } }}>
                <IconButton onClick={handleMenuOpen} color="inherit" sx={{ p: 0 }}>
                  <Avatar sx={{ width: { xs: 24, sm: 28 }, height: { xs: 24, sm: 28 }, bgcolor: 'rgba(255,255,255,0.2)' }}>
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

      {/* Drawer para mobile */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: 'background.paper'
          }
        }}
      >
        <Box sx={{ width: 280, pt: 2 }}>
          {user && (
            <>
              <Box sx={{ px: 2, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {user?.name || user?.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isAdmin ? 'Administrador' : 'Entregador'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider />
            </>
          )}
          
          <List>
            {getNavItems().map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={handleNavClick}
                  selected={isActive(item.path)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive(item.path) ? 'inherit' : 'text.secondary', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {user && (
            <>
              <Divider />
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sair" />
                  </ListItemButton>
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
