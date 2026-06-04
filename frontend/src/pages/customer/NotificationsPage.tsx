import { Box, Button, List, ListItem, ListItemText, Typography, Chip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import { BreadcrumbsNav } from '@/components/BreadcrumbsNav';
import { formatDate } from '@/utils/format';

export const NotificationsPage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await notificationService.getAll()).data,
  });

  const markAll = useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <>
      <BreadcrumbsNav items={[{ label: 'Уведомления' }]} />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={700}>Уведомления</Typography>
        <Button size="small" onClick={() => markAll.mutate()}>Прочитать все</Button>
      </Box>
      {isLoading ? <Typography>Загрузка...</Typography> : (
        <List>
          {data?.results?.map((n) => (
            <ListItem key={n.id} divider sx={{ bgcolor: n.is_read ? 'transparent' : 'action.hover', borderRadius: 1, mb: 0.5 }}>
              <ListItemText
                primary={<>{n.title} {!n.is_read && <Chip size="small" label="новое" color="primary" sx={{ ml: 1 }} />}</>}
                secondary={<>{n.message}<br />{formatDate(n.created_at)}</>}
              />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};
