import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { DataTable } from '@/components/DataTable';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import type { UserRole } from '@/types';

export const AdminUsersPage = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    username: '', email: '', password: '', role: 'CUSTOMER' as UserRole,
    first_name: '', last_name: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await userService.getUsers()).data,
  });

  const createMutation = useMutation({
    mutationFn: () => userService.createUser(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setOpen(false); },
  });

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Админ', to: '/admin' }, { label: 'Пользователи' }]} />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={700}>Пользователи</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>Создать</Button>
      </Box>
      <DataTable
        loading={isLoading}
        keyField={(r) => r.id}
        rows={data?.results ?? []}
        columns={[
          { id: 'user', label: 'Логин', render: (r) => r.username },
          { id: 'name', label: 'Имя', render: (r) => `${r.first_name} ${r.last_name}`.trim() || '—' },
          { id: 'email', label: 'Email', render: (r) => r.email },
          { id: 'role', label: 'Роль', render: (r) => r.role_display },
          { id: 'active', label: 'Активен', render: (r) => (r.is_active ? 'Да' : 'Нет') },
        ]}
      />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Новый пользователь</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Логин" margin="dense" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <TextField fullWidth label="Email" margin="dense" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth label="Пароль" type="password" margin="dense" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <TextField select fullWidth label="Роль" margin="dense" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}>
            <MenuItem value="ADMIN">Администратор</MenuItem>
            <MenuItem value="PRODUCT_MANAGER">Менеджер товаров</MenuItem>
            <MenuItem value="CUSTOMER">Заказчик</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={() => createMutation.mutate()}>Создать</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
