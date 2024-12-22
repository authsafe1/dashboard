import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Loader } from './components';
import { useAuth } from './context/AuthContext';

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader loading={true} />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  } else {
    return children;
  }
};

export default ProtectedRoute;
