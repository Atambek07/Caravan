import { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography, Alert } from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authService } from '@/services/authService';

export const PasswordResetConfirmPage = () => {
  const [params] = useSearchParams();
  const uid = params.get('uid') || '';
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      enqueueSnackbar('Пароли не совпадают', { variant: 'warning' });
      return;
    }
    setLoading(true);
    try {
      await authService.confirmPasswordReset({ uid, token, password, password_confirm: passwordConfirm });
      enqueueSnackbar('Пароль изменён', { variant: 'success' });
      navigate('/login');
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      enqueueSnackbar(detail || 'Ошибка сброса пароля', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!uid || !token) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Alert severity="error">Недействительная ссылка для сброса пароля.</Alert>
          <Button component={Link} to="/password-reset" sx={{ mt: 2 }} variant="contained">
            Запросить новую ссылку
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Новый пароль
        </Typography>
        <Box component="form" onSubmit={handleSubmit} mt={2}>
          <TextField
            fullWidth
            label="Новый пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            inputProps={{ minLength: 8 }}
          />
          <TextField
            fullWidth
            label="Подтверждение пароля"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            margin="normal"
            inputProps={{ minLength: 8 }}
          />
          <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 2 }} disabled={loading}>
            Сохранить пароль
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
