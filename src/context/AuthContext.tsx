import debounce from 'lodash/debounce';
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Loader } from '../components';

enum Plan {
  FREE = 'FREE',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

interface Organization {
  id: string;
  name: string;
  email: string;
  photo: string;
  domain: string;
  isTwoFactorAuthEnabled: boolean;
  isVerified: boolean;
  plan: Plan;
  metadata: object;
  Secret: {
    publicKey: string;
    apiKey: string;
  };
}

interface AuthContextType {
  organization: Organization | null;
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  organization: null,
  isAuthenticated: false,
  loading: true,
  checkAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRequestPending, setRequestPending] = useState(false);
  const isAuthenticated = useMemo(() => !!organization, [organization]);

  const debouncedCheckAuthRef = useRef(
    debounce(async () => {
      if (isRequestPending) return;
      setRequestPending(true);
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/check`,
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

  const checkAuth = useCallback(async () => {
    debouncedCheckAuthRef.current();
  }, []);

  useEffect(() => {
    const debouncedFetchVar = debouncedCheckAuthRef.current;

    checkAuth();

    return () => {
      debouncedFetchVar.cancel();
    };
  }, [checkAuth]);

  return loading ? (
    <Loader loading={true} />
  ) : (
    <AuthContext.Provider
      value={{ organization, isAuthenticated, loading, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
