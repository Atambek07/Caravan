import { Container, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

export const AboutPage = () => (
  <Container maxWidth="md" sx={{ py: 6 }}>
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>О проекте «Караван»</Typography>
      <Typography paragraph>
        «Караван» — B2B-платформа для поставщиков товаров и розничных магазинов. Система объединяет
        каталог, заказы, уведомления и аналитику в едином веб-интерфейсе.
      </Typography>
      <List>
        {[
          'Поставщик управляет товарами и обрабатывает заказы',
          'Магазины регистрируются и оформляют заказы онлайн',
          'Ролевая модель: администратор, менеджер товаров, заказчик',
          'JWT-аутентификация и REST API с документацией Swagger',
        ].map((t) => (
          <ListItem key={t} disablePadding>
            <ListItemText primary={`• ${t}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  </Container>
);
