import { Navigate, Outlet, useLocation } from 'react-router';
import { Loader } from './components';
import { useAuth } from './context/AuthContext';
import { useOrganization } from './context/OrganizationContext';

export const AuthProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader loading={true} />;
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
    return <Loader loading={true} />;
  }
  if (!organization) {
    return <Navigate to="'/organizations?skip=0&take=10'" replace />;
  } else {
    return <Outlet />;
  }
};
