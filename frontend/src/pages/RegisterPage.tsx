import { useState } from 'react';
import { Box, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

export const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '', email: '', password: '', password_confirm: '',
    first_name: '', last_name: '', phone: '',
    store_name: '', store_address: '', store_phone: '', store_email: '',
  });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user, tokens } = await authService.register(form);
      setAuth(user, tokens);
      enqueueSnackbar('Регистрация успешна!', { variant: 'success' });
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: Record<string, string[]> } })?.response?.data;
      const detail = msg ? Object.values(msg).flat().join(' ') : 'Ошибка регистрации';
      enqueueSnackbar(detail, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Регистрация магазина</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Логин" value={form.username} onChange={set('username')} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email" type="email" value={form.email} onChange={set('email')} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Пароль" type="password" value={form.password} onChange={set('password')} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Подтверждение пароля" type="password" value={form.password_confirm} onChange={set('password_confirm')} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Имя" value={form.first_name} onChange={set('first_name')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Фамилия" value={form.last_name} onChange={set('last_name')} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Телефон" value={form.phone} onChange={set('phone')} /></Grid>
            <Grid item xs={12}><Typography variant="subtitle1" fontWeight={600}>Данные магазина</Typography></Grid>
            <Grid item xs={12}><TextField fullWidth label="Название магазина" value={form.store_name} onChange={set('store_name')} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Адрес" value={form.store_address} onChange={set('store_address')} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Телефон магазина" value={form.store_phone} onChange={set('store_phone')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email магазина" value={form.store_email} onChange={set('store_email')} /></Grid>
          </Grid>
          <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>Зарегистрироваться</Button>
        </Box>
      </Paper>
    </Container>
  );
};
