import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Gate for protected routes — redirects to /login, remembering the target page.
export default function RequireAuth({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <div className="login-screen">Restoring your session...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
