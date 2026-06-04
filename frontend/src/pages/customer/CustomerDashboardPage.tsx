import { Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PaymentsIcon from '@mui/icons-material/Payments';
import { dashboardService } from '@/services/dashboardService';
import { StatCard } from '@/components/StatCard';
import { DataTable } from '@/components/DataTable';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { formatDate, formatPrice } from '@/utils/format';
import { ORDER_STATUS_LABELS } from '@/utils/constants';
import { Link } from 'react-router-dom';
import { Chip } from '@mui/material';

export const CustomerDashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-customer'],
    queryFn: async () => (await dashboardService.getCustomer()).data,
  });

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Дашборд' }]} />
      <Typography variant="h5" fontWeight={700} gutterBottom>Мой кабинет</Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Всего заказов" value={isLoading ? '…' : (data?.cards.orders_count ?? 0)} icon={<ShoppingBagIcon />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Активные" value={data?.cards.active_orders ?? '—'} icon={<PendingActionsIcon />} color="#F59E0B" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Сумма покупок" value={data ? formatPrice(data.cards.total_spent) : '—'} icon={<PaymentsIcon />} color="#22C55E" />
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom>Последние заказы</Typography>
      <DataTable
        loading={isLoading}
        keyField={(r) => r.id}
        rows={data?.recent_orders ?? []}
        columns={[
          { id: 'id', label: '№', render: (r) => <Link to={`/orders/${r.id}`}>#{r.id}</Link> },
          { id: 'store', label: 'Магазин', render: (r) => r.store__name },
          { id: 'status', label: 'Статус', render: (r) => <Chip size="small" label={ORDER_STATUS_LABELS[r.status] || r.status} /> },
          { id: 'total', label: 'Сумма', render: (r) => formatPrice(r.total_amount) },
          { id: 'date', label: 'Дата', render: (r) => formatDate(r.created_at) },
        ]}
      />
    </>
  );
};
