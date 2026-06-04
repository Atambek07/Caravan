import api from './api';
import type { Order, OrderStatus, PaginatedResponse } from '@/types';

export const orderService = {
  getOrders: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<Order>>('/orders/', { params }),
  getOrder: (id: number) => api.get<Order>(`/orders/${id}/`),
  createOrder: (items: { product_id: number; quantity: number }[], comment?: string) =>
    api.post<Order>('/orders/', { items, comment }),
  updateStatus: (id: number, status: OrderStatus) =>
    api.patch<Order>(`/orders/${id}/status/`, { status }),
};
