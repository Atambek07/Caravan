import { Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { StatCard } from '@/components/StatCard';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import WarningIcon from '@mui/icons-material/Warning';

export const ManagerDashboardPage = () => {
  const { data } = useQuery({
    queryKey: ['dashboard-manager'],
    queryFn: async () => (await dashboardService.getManager()).data,
  });

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Дашборд' }]} />
      <Typography variant="h5" fontWeight={700} gutterBottom>Менеджер товаров</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}><StatCard title="Всего товаров" value={data?.cards.products_count ?? 0} icon={<InventoryIcon />} /></Grid>
        <Grid item xs={12} sm={4}><StatCard title="Активных" value={data?.cards.active_products ?? 0} icon={<CategoryIcon />} color="#22C55E" /></Grid>
        <Grid item xs={12} sm={4}><StatCard title="Мало на складе" value={data?.cards.low_stock ?? 0} icon={<WarningIcon />} color="#F59E0B" /></Grid>
      </Grid>
    </>
  );
};
