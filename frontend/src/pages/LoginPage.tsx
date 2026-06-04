import { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { tokens, user } = await authService.login(username, password);
      setAuth(user, tokens);
      enqueueSnackbar('Добро пожаловать!', { variant: 'success' });
      const path =
        user.role === 'ADMIN' ? '/admin' : user.role === 'PRODUCT_MANAGER' ? '/manager' : '/dashboard';
      navigate(path);
    } catch {
      enqueueSnackbar('Неверный логин или пароль', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Вход в систему</Typography>
        <Box component="form" onSubmit={handleSubmit} mt={3}>
          <TextField fullWidth label="Логин" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <TextField fullWidth label="Пароль" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
            Войти
          </Button>
        </Box>
        <Box mt={2} textAlign="center">
          <MuiLink component={Link} to="/password-reset">Забыли пароль?</MuiLink>
        </Box>
        <Box mt={1} textAlign="center">
          <MuiLink component={Link} to="/register">Регистрация магазина</MuiLink>
        </Box>
      </Paper>
    </Container>
  );
};
