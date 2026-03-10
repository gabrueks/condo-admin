import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './auth-context';

const STORAGE_KEY = 'condo-admin-selected-administradora';

interface AdministradoraContextValue {
  selectedAdministradoraId: string;
  setSelectedAdministradoraId: (id: string) => void;
  effectiveAdministradoraId: string | undefined;
}

const AdministradoraContext = createContext<AdministradoraContextValue | null>(
  null
);

export function AdministradoraProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selected, setSelectedState] = useState(() =>
    localStorage.getItem(STORAGE_KEY)
  );

  const setSelectedAdministradoraId = useCallback((id: string) => {
    setSelectedState(id);
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const effectiveAdministradoraId =
    user?.role === 'SUPER_ADMIN'
      ? selected || undefined
      : user?.administradoraId;

  return (
    <AdministradoraContext.Provider
      value={{
        selectedAdministradoraId: selected ?? '',
        setSelectedAdministradoraId,
        effectiveAdministradoraId,
      }}
    >
      {children}
    </AdministradoraContext.Provider>
  );
}

export function useAdministradora() {
  const ctx = useContext(AdministradoraContext);
  if (!ctx) throw new Error('useAdministradora must be used within AdministradoraProvider');
  return ctx;
}
