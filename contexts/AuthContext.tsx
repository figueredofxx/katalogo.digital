
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Tenant } from '../types';

interface AuthContextType {
  user: any | null;
  tenant: Tenant | null;
  token: string | null;
  loading: boolean;
  signIn: (token: string, userData: any) => Promise<void>;
  signOut: () => void;
  refreshTenant: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('katalogo_token'));
  const [loading, setLoading] = useState(true);

  const fetchTenant = async () => {
    try {
      const { data } = await api.get('/tenant/me');
      setTenant(data);
    } catch (err) {
      console.error("Erro ao buscar tenant:", err);
      setTenant(null);
    }
  };

  const fetchUser = async () => {
      try {
          const { data } = await api.get('/auth/me');
          setUser(data);
          await fetchTenant();
      } catch (e) {
          signOut();
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    if (token) {
        fetchUser();
    } else {
        setLoading(false);
    }
  }, [token]);

  const signIn = async (newToken: string, userData: any) => {
      localStorage.setItem('katalogo_token', newToken);
      setToken(newToken);
      setUser(userData);
      await fetchTenant();
  };

  const signOut = () => {
    localStorage.removeItem('katalogo_token');
    setToken(null);
    setUser(null);
    setTenant(null);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, token, loading, signIn, signOut, refreshTenant: fetchTenant }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
