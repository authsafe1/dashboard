import { Navigate, Outlet, useLocation } from 'react-router';
import { ScreenLoader } from './components';
import { useAuth } from './context/AuthContext';
import { useOrganization } from './context/OrganizationContext';

export const AuthProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <ScreenLoader />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  } else {
    return <Outlet />;
  }
};

export const OrganizationProtectedRoute = () => {
  const { organization, loading } = useOrganization();

  if (loading) {
    return <ScreenLoader />;
  }
  if (!organization) {
    return <Navigate to="/" replace />;
  } else {
    return <Outlet />;
  }
};
