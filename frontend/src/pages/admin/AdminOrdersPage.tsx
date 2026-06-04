import { MenuItem, Select, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { DataTable } from '@/components/DataTable';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { formatDate, formatPrice } from '@/utils/format';
import { ORDER_STATUS_LABELS } from '@/utils/constants';
import type { Order, OrderStatus } from '@/types';

const STATUSES: OrderStatus[] = ['NEW', 'CONFIRMED', 'PROCESSING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'CANCELED'];

export const AdminOrdersPage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => (await orderService.getOrders()).data,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Админ', to: '/admin' }, { label: 'Заказы' }]} />
      <Typography variant="h5" fontWeight={700} gutterBottom>Заказы</Typography>
      <DataTable
        loading={isLoading}
        keyField={(r) => r.id}
        rows={data?.results ?? []}
        columns={[
          { id: 'id', label: '№', render: (r) => <Link to={`/admin/orders/${r.id}`}>#{r.id}</Link> },
          { id: 'customer', label: 'Клиент', render: (r) => r.customer_name },
          { id: 'store', label: 'Магазин', render: (r) => r.store_name },
          { id: 'status', label: 'Статус', render: (r: Order) => (
            <Select size="small" value={r.status} onChange={(e) => updateStatus.mutate({ id: r.id, status: e.target.value as OrderStatus })}>
              {STATUSES.map((s) => <MenuItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</MenuItem>)}
            </Select>
          )},
          { id: 'total', label: 'Сумма', render: (r) => formatPrice(r.total_amount) },
          { id: 'date', label: 'Дата', render: (r) => formatDate(r.created_at) },
        ]}
      />
    </>
  );
};
