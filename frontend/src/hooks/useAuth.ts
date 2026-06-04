import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, tokens, setAuth, setUser, logout } = useAuthStore();
  const isAuthenticated = Boolean(user && tokens);
  return { user, tokens, isAuthenticated, setAuth, setUser, logout };
};

export const useRole = () => useAuthStore((s) => s.user?.role);
