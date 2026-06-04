import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  roles?: UserRole[];
}

export const ProtectedRoute = ({ roles }: Props) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
