import { Card, CardContent, CardMedia, Typography, Button, Chip, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { formatPrice, mediaUrl } from '@/utils/format';
import { useCartStore } from '@/store/cartStore';
import { useSnackbar } from 'notistack';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const addItem = useCartStore((s) => s.addItem);
  const { enqueueSnackbar } = useSnackbar();

  const handleAdd = () => {
    if (product.stock_quantity <= 0) {
      enqueueSnackbar('Товар отсутствует на складе', { variant: 'warning' });
      return;
    }
    addItem(product);
    enqueueSnackbar('Добавлено в корзину', { variant: 'success' });
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height={160}
        image={mediaUrl(product.image) || '/placeholder-product.svg'}
        alt={product.name}
        sx={{ objectFit: 'cover', bgcolor: 'action.hover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" color="text.secondary">
          {product.article}
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {product.name}
        </Typography>
        <Chip label={product.category_name} size="small" sx={{ mb: 1, alignSelf: 'flex-start' }} />
        <Typography variant="h6" color="primary" fontWeight={700}>
          {formatPrice(product.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Остаток: {product.stock_quantity}
        </Typography>
        <Box mt="auto" display="flex" gap={1}>
          <Button component={Link} to={`/catalog/${product.id}`} size="small" variant="outlined" fullWidth>
            Подробнее
          </Button>
          <Button size="small" variant="contained" startIcon={<ShoppingCartIcon />} onClick={handleAdd} fullWidth>
            В корзину
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
