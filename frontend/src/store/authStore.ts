import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tokens, User } from '@/types';

interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  setAuth: (user: User, tokens: Tokens) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      setAuth: (user, tokens) => set({ user, tokens }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, tokens: null }),
    }),
    { name: 'caravan-auth' },
  ),
);
