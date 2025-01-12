import debounce from 'lodash/debounce';
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Loader } from '../components';

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
  changeOrganization: (id: string) => void;
  checkOrganization: () => Promise<void>;
}

const OrganizationContext = createContext<AuthContextType>({
  organization: null,
  loading: true,
  changeOrganization: () => {},
  checkOrganization: async () => {},
});

export const useOrganization = () => useContext(OrganizationContext);

export const OrganizationProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationId, setOrganizationId] = useState(
    localStorage.getItem('organization-id'),
  );
  const [loading, setLoading] = useState(false);
  const [isRequestPending, setRequestPending] = useState(false);

  const debouncedCheckOrganizationRef = useRef(
    debounce(async () => {
      if (isRequestPending) return;
      if (!organizationId) return;
      setRequestPending(true);
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/organization/${organizationId}`,
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
      } catch {
        setOrganization(null);
      } finally {
        setLoading(false);
        setRequestPending(false);
      }
    }, 300),
  );

  const changeOrganization = useCallback(
    (id: string) => {
      setOrganizationId(id);
      localStorage.setItem('organization-id', id);
    },
    [organizationId],
  );

  const checkOrganization = useCallback(async () => {
    debouncedCheckOrganizationRef.current();
  }, [organizationId]);

  useEffect(() => {
    const debouncedFetchVar = debouncedCheckOrganizationRef.current;

    checkOrganization();

    return () => {
      debouncedFetchVar.cancel();
    };
  }, [checkOrganization, organizationId]);

  return loading ? (
    <Loader loading={true} />
  ) : (
    <OrganizationContext.Provider
      value={{ organization, loading, changeOrganization, checkOrganization }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
