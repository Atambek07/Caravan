import { Grid, Typography, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { dashboardService } from '@/services/dashboardService';
import { StatCard } from '@/components/StatCard';
import { DataTable } from '@/components/DataTable';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { formatDate, formatPrice } from '@/utils/format';
import { Link } from 'react-router-dom';
import { Chip } from '@mui/material';
import { ORDER_STATUS_LABELS } from '@/utils/constants';

export const AdminDashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-admin'],
    queryFn: async () => (await dashboardService.getAdmin()).data,
  });

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Админ', to: '/admin' }, { label: 'Дашборд' }]} />
      <Typography variant="h5" fontWeight={700} gutterBottom>Панель администратора</Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Заказы" value={data?.cards.orders_count ?? '…'} icon={<ShoppingCartIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Клиенты" value={data?.cards.customers_count ?? '…'} icon={<PeopleIcon />} color="#22C55E" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Товары" value={data?.cards.products_count ?? '…'} icon={<InventoryIcon />} color="#F59E0B" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Выручка" value={data ? formatPrice(data.cards.total_revenue) : '…'} icon={<AttachMoneyIcon />} color="#1E293B" /></Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Продажи по дням</Typography>
          <Box height={260}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.charts.sales_by_day ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Заказы по месяцам</Typography>
          <Box height={260}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.charts.orders_by_month ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom>Последние заказы</Typography>
      <DataTable
        loading={isLoading}
        keyField={(r) => r.id}
        rows={data?.recent_orders ?? []}
        columns={[
          { id: 'id', label: '№', render: (r) => <Link to={`/admin/orders/${r.id}`}>#{r.id}</Link> },
          { id: 'customer', label: 'Клиент', render: (r) => r.customer_name },
          { id: 'store', label: 'Магазин', render: (r) => r.store_name },
          { id: 'status', label: 'Статус', render: (r) => <Chip size="small" label={ORDER_STATUS_LABELS[r.status] || r.status} /> },
          { id: 'total', label: 'Сумма', render: (r) => formatPrice(r.total_amount) },
          { id: 'date', label: 'Дата', render: (r) => formatDate(r.created_at) },
        ]}
      />
    </>
  );
};
