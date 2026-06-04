import api from './api';
import type { AdminDashboard, CustomerDashboard } from '@/types';

export const dashboardService = {
  getAdmin: () => api.get<AdminDashboard>('/dashboard/admin/'),
  getCustomer: () => api.get<CustomerDashboard>('/dashboard/customer/'),
  getManager: () => api.get<{ cards: Record<string, number> }>('/dashboard/manager/'),
};
