import api from './api';
import type { Category, PaginatedResponse, Product } from '@/types';

export const productService = {
  getProducts: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<Product>>('/products/', { params }),
  getProduct: (id: number) => api.get<Product>(`/products/${id}/`),
  createProduct: (data: FormData) =>
    api.post<Product>('/products/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateProduct: (id: number, data: FormData) =>
    api.put<Product>(`/products/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteProduct: (id: number) => api.delete(`/products/${id}/`),
  getCategories: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Category>>('/categories/', { params }),
  getCategory: (id: number) => api.get<Category>(`/categories/${id}/`),
  createCategory: (data: FormData) =>
    api.post<Category>('/categories/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateCategory: (id: number, data: FormData) =>
    api.put<Category>(`/categories/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteCategory: (id: number) => api.delete(`/categories/${id}/`),
};
