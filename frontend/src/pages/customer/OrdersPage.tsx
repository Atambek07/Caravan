import { Chip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { DataTable } from '@/components/DataTable';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { formatDate, formatPrice } from '@/utils/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/utils/constants';

export const OrdersPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => (await orderService.getOrders()).data,
  });

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Мои заказы' }]} />
      <Typography variant="h5" fontWeight={700} gutterBottom>Мои заказы</Typography>
      <DataTable
        loading={isLoading}
        keyField={(r) => r.id}
        rows={data?.results ?? []}
        columns={[
          { id: 'id', label: '№', render: (r) => <Link to={`/orders/${r.id}`}>#{r.id}</Link> },
          { id: 'status', label: 'Статус', render: (r) => <Chip size="small" color={ORDER_STATUS_COLORS[r.status]} label={ORDER_STATUS_LABELS[r.status] || r.status_display} /> },
          { id: 'total', label: 'Сумма', render: (r) => formatPrice(r.total_amount) },
          { id: 'date', label: 'Дата', render: (r) => formatDate(r.created_at) },
        ]}
      />
    </>
  );
};
