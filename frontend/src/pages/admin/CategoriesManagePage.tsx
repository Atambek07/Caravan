import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { DataTable } from '@/components/DataTable';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import type { Category } from '@/types';

interface Props {
  basePath: string;
  title: string;
}

export const CategoriesManagePage = ({ basePath, title }: Props) => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => (await productService.getCategories()).data,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      if (edit) return productService.updateCategory(edit.id, fd);
      return productService.createCategory(fd);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); setOpen(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productService.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-categories'] }),
  });

  return (
    <>
      <BreadcrumbsNav items={[{ label: title, to: basePath }, { label: 'Категории' }]} />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={700}>Категории</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => { setEdit(null); setForm({ name: '', description: '' }); setOpen(true); }}>Добавить</Button>
      </Box>
      <DataTable
        loading={isLoading}
        keyField={(r) => r.id}
        rows={data?.results ?? []}
        columns={[
          { id: 'name', label: 'Название', render: (r) => r.name },
          { id: 'desc', label: 'Описание', render: (r) => r.description },
          { id: 'count', label: 'Товаров', render: (r) => r.products_count },
          { id: 'actions', label: '', render: (r) => (
            <>
              <IconButton size="small" onClick={() => { setEdit(r); setForm({ name: r.name, description: r.description }); setOpen(true); }}><EditIcon /></IconButton>
              <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(r.id)}><DeleteIcon /></IconButton>
            </>
          )},
        ]}
      />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{edit ? 'Редактировать' : 'Новая категория'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Название" margin="dense" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="Описание" margin="dense" multiline value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={() => saveMutation.mutate()}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
