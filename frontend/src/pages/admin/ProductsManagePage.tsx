import { useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, TextField, Typography, MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { DataTable } from '@/components/DataTable';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { formatPrice } from '@/utils/format';
import type { Product } from '@/types';

interface Props {
  basePath: string;
  title: string;
}

export const ProductsManagePage = ({ basePath, title }: Props) => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '', article: '', description: '', price: '', stock_quantity: '', category: '', is_active: 'true',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => (await productService.getProducts({ page_size: 100 })).data,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await productService.getCategories()).data,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (edit) return productService.updateProduct(edit.id, fd);
      return productService.createProduct(fd);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); setOpen(false); setEdit(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const openCreate = () => {
    setEdit(null);
    setForm({ name: '', article: '', description: '', price: '', stock_quantity: '0', category: String(categories?.results?.[0]?.id || ''), is_active: 'true' });
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEdit(p);
    setForm({
      name: p.name, article: p.article, description: p.description,
      price: p.price, stock_quantity: String(p.stock_quantity),
      category: String(p.category), is_active: String(p.is_active),
    });
    setOpen(true);
  };

  return (
    <>
      <BreadcrumbsNav items={[{ label: title.split(' ')[0] || 'Панель', to: basePath }, { label: 'Товары' }]} />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={700}>{title}</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}>Добавить</Button>
      </Box>
      <DataTable
        loading={isLoading}
        keyField={(r) => r.id}
        rows={data?.results ?? []}
        columns={[
          { id: 'name', label: 'Название', render: (r) => r.name },
          { id: 'article', label: 'Артикул', render: (r) => r.article },
          { id: 'cat', label: 'Категория', render: (r) => r.category_name },
          { id: 'price', label: 'Цена', render: (r) => formatPrice(r.price) },
          { id: 'stock', label: 'Остаток', render: (r) => r.stock_quantity },
          { id: 'actions', label: '', render: (r) => (
            <>
              <IconButton size="small" onClick={() => openEdit(r)}><EditIcon /></IconButton>
              <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(r.id)}><DeleteIcon /></IconButton>
            </>
          )},
        ]}
      />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{edit ? 'Редактировать' : 'Новый товар'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Название" margin="dense" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="Артикул" margin="dense" value={form.article} onChange={(e) => setForm({ ...form, article: e.target.value })} />
          <TextField fullWidth label="Описание" margin="dense" multiline value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField fullWidth label="Цена" margin="dense" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <TextField fullWidth label="Остаток" margin="dense" type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
          <TextField select fullWidth label="Категория" margin="dense" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories?.results?.map((c) => <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={() => saveMutation.mutate()}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
