import { useState } from 'react';
import { Box, Grid, TextField, MenuItem, Pagination, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { ProductCard } from '@/components/ProductCard';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { Skeleton } from '@mui/material';

export const CatalogPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [ordering, setOrdering] = useState('name');
  const [page, setPage] = useState(1);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await productService.getCategories()).data,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', search, category, ordering, page],
    queryFn: async () => {
      const params: Record<string, string | number> = { ordering, page };
      if (search) params.search = search;
      if (category) params.category = category;
      return (await productService.getProducts(params)).data;
    },
  });

  const totalPages = data ? Math.ceil(data.count / 20) : 1;

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Каталог' }]} />
      <Typography variant="h5" fontWeight={700} gutterBottom>Каталог товаров</Typography>
      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <TextField size="small" label="Поиск" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} sx={{ minWidth: 200 }} />
        <TextField select size="small" label="Категория" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} sx={{ minWidth: 180 }}>
          <MenuItem value="">Все</MenuItem>
          {categories?.results?.map((c) => (
            <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>
          ))}
        </TextField>
        <TextField select size="small" label="Сортировка" value={ordering} onChange={(e) => setOrdering(e.target.value)} sx={{ minWidth: 180 }}>
          <MenuItem value="name">По названию</MenuItem>
          <MenuItem value="price">Цена ↑</MenuItem>
          <MenuItem value="-price">Цена ↓</MenuItem>
          <MenuItem value="-created_at">Новинки</MenuItem>
        </TextField>
      </Box>
      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton variant="rounded" height={320} />
              </Grid>
            ))
          : data?.results?.map((p) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
                <ProductCard product={p} />
              </Grid>
            ))}
      </Grid>
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
        </Box>
      )}
    </>
  );
};
