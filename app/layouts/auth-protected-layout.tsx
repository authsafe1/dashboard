import { Navigate, Outlet, useLocation } from 'react-router';
import { ScreenLoader } from '~/components';
import { useAuth } from '~/context/auth-context';

const AuthProtectedLayout = () => {
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

export default AuthProtectedLayout;
