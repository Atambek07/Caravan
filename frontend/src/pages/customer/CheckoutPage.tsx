import { Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { useCartStore } from '@/store/cartStore';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { formatPrice } from '@/utils/format';

export const CheckoutPage = () => {
  const { items, comment, clear, total } = useCartStore();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: () =>
      orderService.createOrder(
        items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        comment,
      ),
    onSuccess: (res) => {
      clear();
      enqueueSnackbar('Заказ оформлен!', { variant: 'success' });
      navigate(`/orders/${res.data.id}`);
    },
    onError: (err: unknown) => {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      enqueueSnackbar(detail || 'Ошибка оформления', { variant: 'error' });
    },
  });

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Корзина', to: '/cart' }, { label: 'Оформление' }]} />
      <Paper sx={{ p: 4, maxWidth: 500 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Подтверждение заказа</Typography>
        <Typography sx={{ mb: 2 }}>Позиций: {items.length}</Typography>
        <Typography variant="h6" gutterBottom>Сумма: {formatPrice(total())}</Typography>
        {comment && <Typography color="text.secondary" sx={{ mb: 2 }}>Комментарий: {comment}</Typography>}
        <Button variant="contained" size="large" onClick={() => mutation.mutate()} disabled={mutation.isPending || !items.length}>
          Подтвердить заказ
        </Button>
      </Paper>
    </>
  );
};
