import { Box, Button, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AnalyticsIcon from '@mui/icons-material/Analytics';

export const HomePage = () => (
  <Box>
    <Box
      sx={{
        background: 'linear-gradient(135deg, #2563EB 0%, #1E293B 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h2" fontWeight={800} gutterBottom>
          Караван
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9, mb: 4, maxWidth: 600 }}>
          B2B-платформа для поставщиков и розничных магазинов. Заказы, каталог и аналитика в одном месте.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button component={Link} to="/register" variant="contained" size="large" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f1f5f9' } }}>
            Начать работу
          </Button>
          <Button component={Link} to="/login" variant="outlined" size="large" sx={{ borderColor: 'white', color: 'white' }}>
            Войти
          </Button>
        </Box>
      </Container>
    </Box>
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={3}>
        {[
          { icon: <StorefrontIcon fontSize="large" />, title: 'Каталог товаров', desc: 'Поиск, фильтры и актуальные остатки' },
          { icon: <LocalShippingIcon fontSize="large" />, title: 'Быстрые заказы', desc: 'Оформление за минуты с отслеживанием статуса' },
          { icon: <AnalyticsIcon fontSize="large" />, title: 'Аналитика', desc: 'Дашборды для поставщика и магазина' },
        ].map((f) => (
          <Grid item xs={12} md={4} key={f.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box color="primary.main" mb={2}>{f.icon}</Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>{f.title}</Typography>
                <Typography color="text.secondary">{f.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);
