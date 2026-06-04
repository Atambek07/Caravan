import { Box, Button, Chip, Grid, Skeleton, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { productService } from '@/services/productService';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { formatPrice, mediaUrl } from '@/utils/format';
import { useCartStore } from '@/store/cartStore';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { enqueueSnackbar } = useSnackbar();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => (await productService.getProduct(Number(id))).data,
    enabled: Boolean(id),
  });

  if (isLoading) return <Skeleton variant="rounded" height={400} />;
  if (!product) return <Typography>Товар не найден</Typography>;

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Каталог', to: '/catalog' }, { label: product.name }]} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src={mediaUrl(product.image) || '/placeholder-product.svg'}
            alt={product.name}
            sx={{ width: '100%', borderRadius: 2, bgcolor: 'action.hover' }}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography variant="caption" color="text.secondary">{product.article}</Typography>
          <Typography variant="h4" fontWeight={700}>{product.name}</Typography>
          <Chip label={product.category_name} sx={{ my: 1 }} />
          <Typography variant="h5" color="primary" fontWeight={700}>{formatPrice(product.price)}</Typography>
          <Typography color="text.secondary" sx={{ my: 2 }}>Остаток: {product.stock_quantity}</Typography>
          <Typography paragraph>{product.description}</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField type="number" size="small" label="Кол-во" value={qty} onChange={(e) => setQty(Number(e.target.value))} inputProps={{ min: 1, max: product.stock_quantity }} sx={{ width: 100 }} />
            <Button variant="contained" onClick={() => { addItem(product, qty); enqueueSnackbar('В корзине', { variant: 'success' }); }}>В корзину</Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
