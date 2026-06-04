import { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authService } from '@/services/authService';

export const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
      enqueueSnackbar('Проверьте почту', { variant: 'success' });
    } catch {
      enqueueSnackbar('Ошибка отправки', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Восстановление пароля
        </Typography>
        {sent ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Если указанный email зарегистрирован, на него отправлена ссылка для сброса пароля.
            Проверьте почту (и папку «Спам»).
          </Alert>
        ) : (
          <>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              Введите email, указанный при регистрации. Мы отправим ссылку для установки нового пароля.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
              />
              <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 2 }} disabled={loading}>
                Отправить ссылку
              </Button>
            </Box>
          </>
        )}
        <Box mt={3}>
          <Button component={Link} to="/login" variant="outlined">
            Вернуться ко входу
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
