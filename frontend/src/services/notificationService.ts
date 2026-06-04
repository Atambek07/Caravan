import api from './api';
import type { Notification, PaginatedResponse } from '@/types';

export const notificationService = {
  getAll: () => api.get<PaginatedResponse<Notification>>('/notifications/'),
  markRead: (id: number) => api.post(`/notifications/${id}/read/`),
  markAllRead: () => api.post('/notifications/read-all/'),
};
