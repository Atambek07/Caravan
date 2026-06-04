import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/store/themeStore';
import { notificationService } from '@/services/notificationService';
import { authService } from '@/services/authService';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { label: 'Дашборд', path: '/admin', icon: '📊' },
    { label: 'Заказы', path: '/admin/orders', icon: '📦' },
    { label: 'Товары', path: '/admin/products', icon: '🏷️' },
    { label: 'Категории', path: '/admin/categories', icon: '📁' },
    { label: 'Пользователи', path: '/admin/users', icon: '👥' },
    { label: 'Магазины', path: '/admin/stores', icon: '🏪' },
    { label: 'Статистика', path: '/admin/stats', icon: '📈' },
    { label: 'Настройки', path: '/admin/settings', icon: '⚙️' },
  ],
  PRODUCT_MANAGER: [
    { label: 'Дашборд', path: '/manager', icon: '📊' },
    { label: 'Товары', path: '/manager/products', icon: '🏷️' },
    { label: 'Категории', path: '/manager/categories', icon: '📁' },
  ],
  CUSTOMER: [
    { label: 'Дашборд', path: '/dashboard', icon: '📊' },
    { label: 'Каталог', path: '/catalog', icon: '🛒' },
    { label: 'Корзина', path: '/cart', icon: '🧺' },
    { label: 'Мои заказы', path: '/orders', icon: '📦' },
    { label: 'Уведомления', path: '/notifications', icon: '🔔' },
    { label: 'Профиль', path: '/profile', icon: '👤' },
  ],
};

const DRAWER_WIDTH = 260;

export const AppLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const { user, tokens, logout } = useAuth();
  const { mode, toggle } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await notificationService.getAll()).data,
    enabled: Boolean(user),
  });

  const unread = notifications?.results?.filter((n) => !n.is_read).length ?? 0;
  const navItems = user ? NAV_BY_ROLE[user.role] : [];

  const handleLogout = async () => {
    if (tokens?.refresh) {
      try {
        await authService.logout(tokens.refresh);
      } catch {
        /* ignore */
      }
    }
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" fontWeight={800} color="primary">
          Караван
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={() => isMobile && setOpen(false)}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box display="flex" minHeight="100vh">
      <AppBar
        position="fixed"
        sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary' }}
        elevation={1}
      >
        <Toolbar>
          <IconButton edge="start" onClick={() => setOpen(!open)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {navItems.find((n) => n.path === location.pathname)?.label || 'Караван'}
          </Typography>
          <IconButton component={Link} to={user?.role === 'CUSTOMER' ? '/notifications' : '/admin'}>
            <Badge badgeContent={unread} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={toggle}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <Avatar sx={{ ml: 1, bgcolor: 'primary.main', width: 32, height: 32 }}>
            {user?.first_name?.[0] || user?.username?.[0]}
          </Avatar>
          <IconButton onClick={handleLogout} color="inherit" sx={{ ml: 1 }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        flexGrow={1}
        p={3}
        sx={{
          mt: 8,
          ml: { md: open ? `${DRAWER_WIDTH}px` : 0 },
          transition: theme.transitions.create('margin'),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
