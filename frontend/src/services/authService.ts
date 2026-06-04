import api from './api';
import type { Tokens, User } from '@/types';

export const authService = {
  login: async (username: string, password: string) => {
    const { data } = await api.post<{ access: string; refresh: string }>('/auth/login/', {
      username,
      password,
    });
    const profile = await api.get<User>('/auth/profile/', {
      headers: { Authorization: `Bearer ${data.access}` },
    });
    return { tokens: data as Tokens, user: profile.data };
  },

  register: async (payload: Record<string, string>) => {
    const { data } = await api.post<{ user: User; tokens: Tokens }>('/auth/register/', payload);
    return data;
  },

  logout: async (refresh: string) => {
    await api.post('/auth/logout/', { refresh });
  },

  getProfile: () => api.get<User>('/auth/profile/'),
  updateProfile: (payload: Partial<User>) => api.put<User>('/auth/profile/', payload),

  requestPasswordReset: (email: string) =>
    api.post('/auth/password-reset/', { email }),

  confirmPasswordReset: (payload: {
    uid: string;
    token: string;
    password: string;
    password_confirm: string;
  }) => api.post('/auth/password-reset/confirm/', payload),
};
