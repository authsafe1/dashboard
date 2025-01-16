import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ScreenLoader } from '../components';

interface Organization {
  id: string;
  name: string;
  domain: string;
  metadata: object;
  Secret: {
    publicKey: string;
    ApiKeys: {
      token: string;
    }[];
  };
}

interface AuthContextType {
  organization: Organization | null;
  loading: boolean;
  changeOrganization: (id: string) => Promise<void>;
  checkOrganization: () => Promise<void>;
}

const OrganizationContext = createContext<AuthContextType>({
  organization: null,
  loading: true,
  changeOrganization: async () => {},
  checkOrganization: async () => {},
});

export const useOrganization = () => useContext(OrganizationContext);

export const OrganizationProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(
    localStorage.getItem('organization-id'),
  );
  const [loading, setLoading] = useState(false);

  const fetchOrganization = useCallback(async (id: string | null) => {
    if (!id) {
      setOrganization(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/organization/switch/${id}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setOrganization(data);
      } else {
        setOrganization(null);
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const changeOrganization = useCallback(
    async (id: string) => {
      setOrganizationId(id);
      localStorage.setItem('organization-id', id);
      await fetchOrganization(id);
    },
    [fetchOrganization],
  );

  const checkOrganization = useCallback(async () => {
    await fetchOrganization(organizationId);
  }, [fetchOrganization, organizationId]);

  useEffect(() => {
    checkOrganization();
  }, [checkOrganization]);

  return loading ? (
    <ScreenLoader />
  ) : (
    <OrganizationContext.Provider
      value={{ organization, loading, changeOrganization, checkOrganization }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
