import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { storeService } from '@/services/userService';
import { DataTable } from '@/components/DataTable';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { formatDate } from '@/utils/format';

export const AdminStoresPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => (await storeService.getStores()).data,
  });

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Админ', to: '/admin' }, { label: 'Магазины' }]} />
      <Typography variant="h5" fontWeight={700} gutterBottom>Магазины</Typography>
      <DataTable
        loading={isLoading}
        keyField={(r) => r.id}
        rows={data?.results ?? []}
        columns={[
          { id: 'name', label: 'Название', render: (r) => r.name },
          { id: 'address', label: 'Адрес', render: (r) => r.address },
          { id: 'phone', label: 'Телефон', render: (r) => r.phone || '—' },
          { id: 'owner', label: 'Владелец', render: (r) => r.owner_username || '—' },
          { id: 'customers', label: 'Клиентов', render: (r) => r.customers_count },
          { id: 'date', label: 'Создан', render: (r) => formatDate(r.created_at) },
        ]}
      />
    </>
  );
};
