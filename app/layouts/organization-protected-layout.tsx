import { Navigate, Outlet } from 'react-router';
import { ScreenLoader } from '~/components';
import { useOrganization } from '~/context/OrganizationContext';

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
