import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  const allowed = user && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role);
  if (!allowed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
