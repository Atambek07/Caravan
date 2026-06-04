import { Alert, Paper, Typography } from '@mui/material';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';

export const AdminSettingsPage = () => (
  <>
    <BreadcrumbsNav items={[{ label: 'Админ', to: '/admin' }, { label: 'Настройки' }]} />
    <Typography variant="h5" fontWeight={700} gutterBottom>Настройки системы</Typography>
    <Paper sx={{ p: 3, maxWidth: 600 }}>
      <Alert severity="info">
        Системные настройки управляются через переменные окружения (.env) и Django Admin.
        Swagger API: <a href="/api/docs/" target="_blank" rel="noreferrer">/api/docs/</a>
      </Alert>
    </Paper>
  </>
);
