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
import { ScreenLoader } from '../components';

enum Plan {
  FREE = 'FREE',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

interface Profile {
  id: string;
  name: string;
  email: string;
  photo: string;
  plan: Plan;
  isTwoFactorAuthEnabled: boolean;
  isVerified: boolean;
  Organizations: {
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
  }[];
}

interface AuthContextType {
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  isAuthenticated: false,
  loading: true,
  checkAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRequestPending, setRequestPending] = useState(false);
  const isAuthenticated = useMemo(() => !!profile, [profile]);

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
          setProfile(data);
        } else {
          setProfile(null);
        }
      } catch {
        setProfile(null);
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
    <ScreenLoader />
  ) : (
    <AuthContext.Provider
      value={{ profile, isAuthenticated, loading, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
