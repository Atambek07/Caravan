import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link, Outlet } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { useAuth } from '@/hooks/useAuth';

export const PublicLayout = () => {
  const { mode, toggle } = useThemeStore();
  const { isAuthenticated, user } = useAuth();

  const dashboardLink =
    user?.role === 'ADMIN'
      ? '/admin'
      : user?.role === 'PRODUCT_MANAGER'
        ? '/manager'
        : '/dashboard';

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <AppBar position="sticky" color="inherit" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            fontWeight={800}
            color="primary"
            sx={{ textDecoration: 'none', flexGrow: 1 }}
          >
            Караван
          </Typography>
          <Button component={Link} to="/about" color="inherit">
            О проекте
          </Button>
          {isAuthenticated ? (
            <Button component={Link} to={dashboardLink} variant="contained" sx={{ ml: 1 }}>
              Кабинет
            </Button>
          ) : (
            <>
              <Button component={Link} to="/login" color="inherit">
                Вход
              </Button>
              <Button component={Link} to="/register" variant="contained" sx={{ ml: 1 }}>
                Регистрация
              </Button>
            </>
          )}
          <IconButton onClick={toggle} sx={{ ml: 1 }}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" flexGrow={1}>
        <Outlet />
      </Box>
      <Box component="footer" py={3} textAlign="center" bgcolor="background.paper" mt="auto">
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Караван B2B. Все права защищены.
        </Typography>
      </Box>
    </Box>
  );
};
