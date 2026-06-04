import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { AdminDashboardPage } from './AdminDashboardPage';

export const AdminStatsPage = () => {
  useQuery({ queryKey: ['dashboard-admin'], queryFn: async () => (await dashboardService.getAdmin()).data });
  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Админ', to: '/admin' }, { label: 'Статистика' }]} />
      <Typography variant="h5" fontWeight={700} gutterBottom>Статистика</Typography>
      <AdminDashboardPage />
    </>
  );
};
