import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '' });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (user) setForm({ first_name: user.first_name, last_name: user.last_name, email: user.email, phone: user.phone });
  }, [user]);

  const handleSave = async () => {
    try {
      const { data } = await authService.updateProfile(form);
      setUser(data);
      enqueueSnackbar('Профиль сохранён', { variant: 'success' });
    } catch {
      enqueueSnackbar('Ошибка сохранения', { variant: 'error' });
    }
  };

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Профиль' }]} />
      <Paper sx={{ p: 4, maxWidth: 500 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Профиль</Typography>
        <Typography color="text.secondary" gutterBottom>Логин: {user?.username} · Магазин: {user?.store_name}</Typography>
        <TextField fullWidth label="Имя" margin="normal" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        <TextField fullWidth label="Фамилия" margin="normal" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        <TextField fullWidth label="Email" margin="normal" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <TextField fullWidth label="Телефон" margin="normal" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Box mt={2}><Button variant="contained" onClick={handleSave}>Сохранить</Button></Box>
      </Paper>
    </>
  );
};
