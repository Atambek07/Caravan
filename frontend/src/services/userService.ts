import api from './api';
import type { PaginatedResponse, Store, User } from '@/types';

export const userService = {
  getUsers: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<User>>('/auth/users/', { params }),
  createUser: (data: Record<string, unknown>) => api.post<User>('/auth/users/', data),
  updateUser: (id: number, data: Record<string, unknown>) =>
    api.put<User>(`/auth/users/${id}/`, data),
  deleteUser: (id: number) => api.delete(`/auth/users/${id}/`),
};

export const storeService = {
  getStores: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Store>>('/stores/', { params }),
  createStore: (data: Partial<Store>) => api.post<Store>('/stores/', data),
  updateStore: (id: number, data: Partial<Store>) => api.put<Store>(`/stores/${id}/`, data),
  deleteStore: (id: number) => api.delete(`/stores/${id}/`),
};
