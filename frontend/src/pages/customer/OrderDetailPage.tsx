import { Box, Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { formatDate, formatPrice } from '@/utils/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/utils/constants';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => (await orderService.getOrder(Number(id))).data,
    enabled: Boolean(id),
  });

  if (isLoading || !order) return <Typography>Загрузка...</Typography>;

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Заказы', to: '/orders' }, { label: `Заказ #${order.id}` }]} />
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography variant="h5" fontWeight={700}>Заказ #{order.id}</Typography>
        <Chip color={ORDER_STATUS_COLORS[order.status]} label={ORDER_STATUS_LABELS[order.status] || order.status_display} />
      </Box>
      <Typography color="text.secondary" gutterBottom>{formatDate(order.created_at)} · {order.store_name}</Typography>
      {order.comment && <Typography sx={{ mb: 2 }}>Комментарий: {order.comment}</Typography>}
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Товар</TableCell>
              <TableCell>Артикул</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Кол-во</TableCell>
              <TableCell>Сумма</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((i) => (
              <TableRow key={i.id}>
                <TableCell>{i.product_name}</TableCell>
                <TableCell>{i.product_article}</TableCell>
                <TableCell>{formatPrice(i.price)}</TableCell>
                <TableCell>{i.quantity}</TableCell>
                <TableCell>{formatPrice(i.subtotal)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Typography variant="h6" sx={{ mt: 2 }}>Итого: {formatPrice(order.total_amount)}</Typography>
    </>
  );
};
