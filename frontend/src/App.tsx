import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { createAppTheme } from '@/theme';
import { useThemeStore } from '@/store/themeStore';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { PasswordResetPage } from '@/pages/PasswordResetPage';
import { PasswordResetConfirmPage } from '@/pages/PasswordResetConfirmPage';
import { AboutPage } from '@/pages/AboutPage';
import { CustomerDashboardPage } from '@/pages/customer/CustomerDashboardPage';
import { CatalogPage } from '@/pages/customer/CatalogPage';
import { ProductDetailPage } from '@/pages/customer/ProductDetailPage';
import { CartPage } from '@/pages/customer/CartPage';
import { CheckoutPage } from '@/pages/customer/CheckoutPage';
import { OrdersPage } from '@/pages/customer/OrdersPage';
import { OrderDetailPage } from '@/pages/customer/OrderDetailPage';
import { NotificationsPage } from '@/pages/customer/NotificationsPage';
import { ProfilePage } from '@/pages/customer/ProfilePage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { ProductsManagePage } from '@/pages/admin/ProductsManagePage';
import { CategoriesManagePage } from '@/pages/admin/CategoriesManagePage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminStoresPage } from '@/pages/admin/AdminStoresPage';
import { AdminStatsPage } from '@/pages/admin/AdminStatsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { ManagerDashboardPage } from '@/pages/admin/ManagerDashboardPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function App() {
  const mode = useThemeStore((s) => s.mode);
  const theme = createAppTheme(mode);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/password-reset" element={<PasswordResetPage />} />
                <Route path="/password-reset/confirm" element={<PasswordResetConfirmPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Route>

              <Route element={<ProtectedRoute roles={['CUSTOMER']} />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<CustomerDashboardPage />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/catalog/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:id" element={<OrderDetailPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute roles={['ADMIN']} />}>
                <Route element={<AppLayout />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/orders" element={<AdminOrdersPage />} />
                  <Route path="/admin/orders/:id" element={<OrderDetailPage />} />
                  <Route path="/admin/products" element={<ProductsManagePage basePath="/admin" title="Админ" />} />
                  <Route path="/admin/categories" element={<CategoriesManagePage basePath="/admin" title="Админ" />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/stores" element={<AdminStoresPage />} />
                  <Route path="/admin/stats" element={<AdminStatsPage />} />
                  <Route path="/admin/settings" element={<AdminSettingsPage />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute roles={['PRODUCT_MANAGER']} />}>
                <Route element={<AppLayout />}>
                  <Route path="/manager" element={<ManagerDashboardPage />} />
                  <Route path="/manager/products" element={<ProductsManagePage basePath="/manager" title="Менеджер" />} />
                  <Route path="/manager/categories" element={<CategoriesManagePage basePath="/manager" title="Менеджер" />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
